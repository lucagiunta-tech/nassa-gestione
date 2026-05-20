// api/dropbox-upload.js — Vercel serverless function
// Proxies file uploads to Dropbox to avoid CORS issues
// Deploy at: /api/dropbox-upload.js in your project root (not inside nassa-portal/)

const DROPBOX_APP_KEY       = process.env.DROPBOX_APP_KEY;      
const DROPBOX_REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;

let _cachedToken   = null;
let _tokenExpiry   = 0;

async function getToken() {
  if (_cachedToken && Date.now() < _tokenExpiry - 60_000) return _cachedToken;
  const res  = await fetch("https://api.dropbox.com/oauth2/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
  grant_type:    "refresh_token",
  refresh_token: DROPBOX_REFRESH_TOKEN,
  client_id:     DROPBOX_APP_KEY,
  client_secret: process.env.DROPBOX_APP_SECRET,  // ← ADD THIS LINE
}),
  });
  const data     = await res.json();
  if (!data.access_token) throw new Error("Token refresh failed: " + JSON.stringify(data));
  _cachedToken = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in || 14400) * 1000;
  return _cachedToken;
}

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // CORS headers — allow requests from your Vercel app
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-dropbox-path");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  try {
    const dropboxPath = req.headers["x-dropbox-path"];
    if (!dropboxPath) return res.status(400).json({ error: "Missing x-dropbox-path header" });

    const token = await getToken();

    // ── Step 1: stream the body directly to Dropbox upload ───
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const fileBuffer = Buffer.concat(chunks);

    const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method:  "POST",
      headers: {
        Authorization:     `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify({ path: dropboxPath, mode: "add", autorename: true, mute: true }),
        "Content-Type":    "application/octet-stream",
      },
      body: fileBuffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return res.status(500).json({ error: "Upload failed", detail: err });
    }

    const uploadData = await uploadRes.json();

    // ── Step 2: create a public shared link ──────────────────
    let publicUrl = null;

    try {
      const linkRes  = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ path: uploadData.path_lower }),
      });
      const linkData = await linkRes.json();
      publicUrl      = linkData.url || null;
    } catch {}

    // Fallback: list existing links
    if (!publicUrl) {
      const listRes  = await fetch("https://api.dropboxapi.com/2/sharing/list_shared_links", {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ path: uploadData.path_lower, direct_only: true }),
      });
      const listData = await listRes.json();
      publicUrl      = listData.links?.[0]?.url || null;
    }

    if (!publicUrl) return res.status(500).json({ error: "Could not create public link" });

    // ── Step 3: also create client folder structure ───────────
    // (non-blocking, best-effort)
    fetch("https://api.dropboxapi.com/2/files/create_folder_batch", {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify({
        paths:       [dropboxPath.split("/").slice(0, -1).join("/")],
        autorename:  false,
      }),
    }).catch(() => {});

    return res.status(200).json({
      url:      publicUrl.replace("dl=0", "raw=1"),
      path:     uploadData.path_lower,
      name:     uploadData.name,
    });

  } catch (err) {
    console.error("Dropbox proxy error:", err);
    return res.status(500).json({ error: err.message });
  }
}
