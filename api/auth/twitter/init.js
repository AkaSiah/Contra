export default async function handler(req, res) {
  const { default: fetch } = await import('node-fetch');

  const client_id = process.env.TWITTER_CLIENT_ID;
  const redirect_uri = process.env.TWITTER_REDIRECT_URI;

  const codeVerifier = [...Array(128)].map(() => Math.random().toString(36)[2]).join('');
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const url = new URL('https://twitter.com/i/oauth2/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', client_id);
  url.searchParams.set('redirect_uri', redirect_uri);
  url.searchParams.set('scope', 'tweet.read tweet.write users.read offline.access');
  url.searchParams.set('state', 'state');
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  res.status(200).json({ url: url.toString(), codeVerifier });
}