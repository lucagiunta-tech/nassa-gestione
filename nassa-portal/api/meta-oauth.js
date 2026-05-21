// nassa-portal/api/meta-oauth.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const META_APP_ID     = process.env.META_APP_ID     || "1543498264065807";
  const META_APP_SECRET = process.env.META_APP_SECRET || "e2f69284d7f2ea71a3752596d19e8921";
  const REDIRECT_URI    = "https://nassa-gestione.vercel.app/api/meta-oauth";

  const code = req.query.code;

  if (!code) {
    return res.status(200).send(`<!DOCTYPE html><html><body>
<script>
  const p = new URLSearchParams(window.location.search);
  if (p.get('error')) {
    window.opener && window.opener.postMessage({type:"META_OAUTH_ERROR",error:p.get('error_description')},"*");
    window.close();
  }
</script><p>Connessione...</p></body></html>`);
  }

  try {
    // Step 1: exchange code for SHORT-lived user token
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

    // Step 3: get all pages WITH their own long-lived page tokens
    const r3 = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts` +
      `?fields=id,name,access_token,instagram_business_account{id,name,username}` +
      `&limit=100` +
      `&access_token=${encodeURIComponent(d2.access_token)}`
    );
    const d3 = await r3.json();
    if (d3.error) throw new Error(d3.error.message);

    // Page access tokens from /me/accounts are already long-lived — no extra exchange needed
    const pages = JSON.stringify(d3.data || []);

    return res.status(200).send(`<!DOCTYPE html><html><body>
<script>
  if (window.opener) {
    window.opener.postMessage({
      type: "META_OAUTH_PAGES",
      pages: ${pages}
    }, "*");
    window.close();
  }
</script>
<p>Connesso! Puoi chiudere questa finestra.</p>
</body></html>`);

  } catch (err) {
    return res.status(200).send(`<!DOCTYPE html><html><body>
<script>
  if (window.opener) {
    window.opener.postMessage({type:"META_OAUTH_ERROR",error:${JSON.stringify(err.message)}},"*");
    window.close();
  }
</script>
<p>Errore: ${err.message}</p>
</body></html>`);
  }
}
