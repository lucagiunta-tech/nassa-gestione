// nassa-portal/api/meta-oauth.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const META_APP_ID     = process.env.META_APP_ID     || "1543498264065807";
  const META_APP_SECRET = process.env.META_APP_SECRET || "e2f69284d7f2ea71a3752596d19e8921";
  const REDIRECT_URI    = "https://nassa-gestione.vercel.app/api/meta-oauth";

  // ── POST: main window exchanges code for pages ────────────
  if (req.method === "POST") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
        req.on("error", reject);
      });

      const code = body.code;
      if (!code) return res.status(400).json({ error: "Missing code" });

      // Step 1: exchange code → short-lived user token
      const r1 = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token` +
        `?client_id=${META_APP_ID}` +
        `&client_secret=${META_APP_SECRET}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&code=${encodeURIComponent(code)}`
      );
      const d1 = await r1.json();
      if (d1.error) return res.status(400).json({ error: d1.error.message });

      // Step 2: exchange → long-lived user token (60 days)
      const r2 = await fetch(
        `https://graph.facebook.com/v19.0/oauth/access_token` +
        `?grant_type=fb_exchange_token` +
        `&client_id=${META_APP_ID}` +
        `&client_secret=${META_APP_SECRET}` +
        `&fb_exchange_token=${encodeURIComponent(d1.access_token)}`
      );
      const d2 = await r2.json();
      if (d2.error) return res.status(400).json({ error: d2.error.message });

      // Step 3: get FB pages with their own page tokens
      const r3 = await fetch(
        `https://graph.facebook.com/v19.0/me/accounts` +
        `?fields=id,name,access_token` +
        `&limit=100` +
        `&access_token=${encodeURIComponent(d2.access_token)}`
      );
      const d3 = await r3.json();
      if (d3.error) return res.status(400).json({ error: d3.error.message });

      const pages = d3.data || [];

      // Step 4: for each page get linked IG Business account
      const pagesWithIG = await Promise.all(pages.map(async (page) => {
        try {
          const igR = await fetch(
            `https://graph.facebook.com/v19.0/${page.id}` +
            `?fields=instagram_business_account{id,name,username}` +
            `&access_token=${encodeURIComponent(page.access_token)}`
          );
          const igD = await igR.json();
          return { ...page, instagram_business_account: igD.instagram_business_account || null };
        } catch {
          return { ...page, instagram_business_account: null };
        }
      }));

      return res.status(200).json({ pages: pagesWithIG });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── GET: Facebook redirects here with ?code= ─────────────
  // Just send the code back to the opener via postMessage
  const code = req.query.code;
  const error = req.query.error;

  if (error) {
    return res.status(200).send(`<!DOCTYPE html><html><body>
<script>
  window.opener && window.opener.postMessage({type:"META_OAUTH_ERROR",error:${JSON.stringify(req.query.error_description||error)}},"*");
  window.close();
</script></body></html>`);
  }

  if (!code) {
    return res.status(200).send(`<!DOCTYPE html><html><body><p>No code received.</p></body></html>`);
  }

  return res.status(200).send(`<!DOCTYPE html><html><body>
<script>
  if (window.opener) {
    window.opener.postMessage({type:"META_OAUTH_CODE", code:${JSON.stringify(code)}},"*");
  } else {
    document.body.innerHTML = '<p>Errore: finestra opener non trovata. Riprova.</p>';
  }
  window.close();
</script>
<p>Connessione completata...</p>
</body></html>`);
}
