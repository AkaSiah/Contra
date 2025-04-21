export default async function handler(req, res) {
  const { code } = req.query;
  const { default: fetch } = await import('node-fetch');

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: process.env.TWITTER_CLIENT_ID,
      redirect_uri: process.env.TWITTER_REDIRECT_URI,
      code_verifier: req.cookies.codeVerifier,
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}