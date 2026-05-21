// nassa-portal/api/meta-oauth.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const META_APP_ID     = process.env.META_APP_ID;
  const META_APP_SECRET = process.env.META_APP_SECRET;
  const REDIRECT_URI    = process.env.META_REDIRECT_URI || "https://nassa-gestione.vercel.app/api/meta-oauth";

  const code      = req.query.code;
  const errCode   = req.query.error_code   || req.query.error;
  const errMsg    = req.query.error_message || req.query.error_description || req.query.error_reason || "Errore sconosciuto";

  // ── Facebook redirected back with an error (e.g. user denied, invalid scope) ──
  if (!code) {
    const htmlErr = errCode
      ? `
<!DOCTYPE html><html><body>
<script>
  if (window.opener) {
    window.opener.postMessage(
      { type: "META_OAUTH_ERROR", error: ${JSON.stringify(errMsg)} },
      "*"
    );
    window.close();
  } else {
    document.body.innerHTML = "<p>Errore OAuth: ${errMsg.replace(/"/g, "'")}. Puoi chiudere questa finestra.</p>";
  }
</script>
<p>Errore: ${errMsg}</p>
</body></html>`
      : `
<!DOCTYPE html><html><body>
<script>
  // No code and no error — probably a direct browser hit, ignore
</script>
<p>Connessione in corso...</p>
</body></html>`;

    return res.status(200).send(htmlErr);
  }

  try {
    // Step 1: exchange authorization code for SHORT-lived user token
    const r1 = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token` +
      `?client_id=${META_APP_ID}` +
      `&client_secret=${META_APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&code=${encodeURIComponent(code)}`
    );
    const d1 = await r1.json();
    if (d1.error) throw new Error(d1.error.message);

    // Step 2: exchange for LONG-lived user token (60 days)
    const r2 = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token` +
      `?grant_type=fb_exchange_token` +
      `&client_id=${META_APP_ID}` +
      `&client_secret=${META_APP_SECRET}` +
      `&fb_exchange_token=${encodeURIComponent(d1.access_token)}`
    );
    const d2 = await r2.json();
    if (d2.error) throw new Error(d2.error.message);

    // Step 3: get all Facebook Pages managed by this user,
    //         including the linked Instagram Business account on each page
    const r3 = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts` +
      `?fields=id,name,access_token,instagram_business_account{id,name,username,profile_picture_url}` +
      `&limit=100` +
      `&access_token=${encodeURIComponent(d2.access_token)}`
    );
    const d3 = await r3.json();
    if (d3.error) throw new Error(d3.error.message);

    // Page tokens from /me/accounts are already long-lived — no further exchange needed
    const pages = JSON.stringify(d3.data || []);

    return res.status(200).send(`
<!DOCTYPE html><html><body>
<script>
  if (window.opener) {
    window.opener.postMessage(
      { type: "META_OAUTH_PAGES", pages: ${pages} },
      "*"
    );
    window.close();
  } else {
    document.body.innerHTML = "<p>Connesso! Puoi chiudere questa finestra.</p>";
  }
</script>
<p>Connesso! Puoi chiudere questa finestra.</p>
</body></html>`);

  } catch (err) {
    console.error("Meta OAuth error:", err.message);
    return res.status(200).send(`
<!DOCTYPE html><html><body>
<script>
  if (window.opener) {
    window.opener.postMessage(
      { type: "META_OAUTH_ERROR", error: ${JSON.stringify(err.message)} },
      "*"
    );
    window.close();
  } else {
    document.body.innerHTML = "<p>Errore: ${err.message.replace(/"/g, "'")}. Puoi chiudere questa finestra.</p>";
  }
</script>
<p>Errore: ${err.message}</p>
</body></html>`);
  }
}
