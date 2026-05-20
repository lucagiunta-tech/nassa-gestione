// nassa-portal/api/meta-oauth.js — Vercel serverless function
// Exchanges a Meta authorization code for a long-lived user token
// Called by the popup after Facebook redirects back

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const META_APP_ID     = process.env.META_APP_ID     || "1543498264065807";
  const META_APP_SECRET = process.env.META_APP_SECRET || "e2f69284d7f2ea71a3752596d19e8921";
  const REDIRECT_URI    = process.env.META_REDIRECT_URI || "https://nassa-gestione.vercel.app/api/meta-oauth";

  // ── GET: Facebook redirects here with ?code=... ──────────
  if (req.method === "GET") {
    const code = req.query.code;
    if (!code) {
      // No code — just serve the postMessage page
      return res.status(200).send(`<!DOCTYPE html>
<html><head><title>Auth</title></head>
<body>
<script>
  const params = new URLSearchParams(window.location.search);
  const error  = params.get('error');
  if (error) {
    window.opener && window.opener.postMessage({ type: "META_OAUTH_ERROR", error }, "*");
    window.close();
  }
</script>
<p>Connessione in corso...</p>
</body></html>`);
    }

    try {
      // Exchange code for short-lived token
      const tokenRes = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token` +
        `?client_id=${META_APP_ID}` +
        `&client_secret=${META_APP_SECRET}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&code=${encodeURIComponent(code)}`
      );
      const tokenData = await tokenRes.json();
      if (tokenData.error) throw new Error(tokenData.error.message);

      // Exchange for long-lived token (60 days)
      const llRes = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token` +
        `?grant_type=fb_exchange_token` +
        `&client_id=${META_APP_ID}` +
        `&client_secret=${META_APP_SECRET}` +
        `&fb_exchange_token=${encodeURIComponent(tokenData.access_token)}`
      );
      const llData = await llRes.json();
      if (llData.error) throw new Error(llData.error.message);

      const longToken = llData.access_token;

      // Return HTML that postMessages the token to the opener
      return res.status(200).send(`<!DOCTYPE html>
<html><head><title>Auth Success</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: "META_OAUTH_TOKEN", token: "${longToken}" }, "*");
    window.close();
  } else {
    document.body.innerHTML = '<p>Connesso! Puoi chiudere questa finestra.</p>';
  }
</script>
<p>Connessione completata...</p>
</body></html>`);

    } catch (err) {
      return res.status(200).send(`<!DOCTYPE html>
<html><head><title>Auth Error</title></head>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: "META_OAUTH_ERROR", error: ${JSON.stringify(err.message)} }, "*");
    window.close();
  }
</script>
<p>Errore: ${err.message}</p>
</body></html>`);
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
