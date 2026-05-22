// api/dropbox-upload.js — Vercel serverless proxy for Dropbox uploads
// Supports files up to 150MB via Dropbox session upload API

const DROPBOX_APP_KEY       = process.env.DROPBOX_APP_KEY;
const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;
const DROPBOX_APP_SECRET    = process.env.DROPBOX_APP_SECRET;

let _cachedToken = null;
let _tokenExpiry = 0;

async function getToken() {
  if (_cachedToken && Date.now() < _tokenExpiry - 60_000) return _cachedToken;
  const res = await fetch("https://api.dropbox.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      refresh_token: DROPBOX_REFRESH_TOKEN,
      client_id:     DROPBOX_APP_KEY,
      client_secret: DROPBOX_APP_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Token refresh failed: " + JSON.stringify(data));
  _cachedToken = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in || 14400) * 1000;
  return _cachedToken;
}

// Vercel config: disable body parser, raise size limit to 50MB, extend timeout
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "50mb",
    maxDuration: 60,
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-dropbox-path");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const dropboxPath = req.headers["x-dropbox-path"];
    if (!dropboxPath) return res.status(400).json({ error: "Missing x-dropbox-path header" });

    const token = await getToken();

    // Read body into buffer
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const fileBuffer = Buffer.concat(chunks);
    const fileSize   = fileBuffer.length;

    let uploadData;

    if (fileSize <= 148 * 1024 * 1024) {
      // ── Small/medium file: single-shot upload ─────────────
      const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
          Authorization:    `Bearer ${token}`,
          "Content-Type":   "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({
            path:       dropboxPath,
            mode:       "overwrite",
            autorename: true,
            mute:       false,
          }),
        },
        body: fileBuffer,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.text();
        throw new Error("Upload fallito (" + uploadRes.status + "): " + err);
      }
      uploadData = await uploadRes.json();
    } else {
      // ── Large file: session upload (chunked) ──────────────
      const CHUNK = 100 * 1024 * 1024; // 100MB chunks

      // Start session
      const startRes = await fetch("https://content.dropboxapi.com/2/files/upload_session/start", {
        method: "POST",
        headers: {
          Authorization:    `Bearer ${token}`,
          "Content-Type":   "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({ close: false }),
        },
        body: fileBuffer.slice(0, CHUNK),
      });
      const { session_id } = await startRes.json();

      // Append chunks
      let offset = CHUNK;
      while (offset < fileSize - CHUNK) {
        const chunk = fileBuffer.slice(offset, offset + CHUNK);
        await fetch("https://content.dropboxapi.com/2/files/upload_session/append_v2", {
          method: "POST",
          headers: {
            Authorization:    `Bearer ${token}`,
            "Content-Type":   "application/octet-stream",
            "Dropbox-API-Arg": JSON.stringify({ cursor: { session_id, offset }, close: false }),
          },
          body: chunk,
        });
        offset += CHUNK;
      }

      // Finish
      const finishRes = await fetch("https://content.dropboxapi.com/2/files/upload_session/finish", {
        method: "POST",
        headers: {
          Authorization:    `Bearer ${token}`,
          "Content-Type":   "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({
            cursor: { session_id, offset },
            commit: { path: dropboxPath, mode: "overwrite", autorename: true },
          }),
        },
        body: fileBuffer.slice(offset),
      });
      uploadData = await finishRes.json();
    }

    // ── Create public shared link ───────────────────────────
    let publicUrl = null;
    try {
      const linkRes  = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ path: uploadData.path_lower }),
      });
      const linkData = await linkRes.json();
      publicUrl = linkData.url || null;
    } catch {}

    // Fallback: list existing links
    if (!publicUrl) {
      const listRes  = await fetch("https://api.dropboxapi.com/2/sharing/list_shared_links", {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ path: uploadData.path_lower, direct_only: true }),
      });
      const listData = await listRes.json();
      publicUrl = listData.links?.[0]?.url || null;
    }

    if (!publicUrl) return res.status(500).json({ error: "Could not create public link" });

    // Return direct playable URL
    const rawUrl = publicUrl
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace(/[?&]dl=[01]/g, "")
      .replace(/[?&]raw=1/g, "")
      + (publicUrl.includes("?") ? "&raw=1" : "?raw=1");

    return res.status(200).json({
      url:  rawUrl,
      path: uploadData.path_lower,
      name: uploadData.name,
    });

  } catch (err) {
    console.error("Dropbox proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
