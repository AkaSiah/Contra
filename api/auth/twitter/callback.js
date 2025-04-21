import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req, res) {
  const { code, state } = req.query;
  const cookies = parse(req.headers.cookie || '');

  if (!code || !state || state !== cookies.twitter_state) {
    return res.status(400).send('Invalid state or missing code');
  }

  const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    client_id: process.env.TWITTER_CLIENT_ID,
    redirect_uri: 'https://your-deployment.vercel.app/api/auth/twitter/callback',
    code_verifier: cookies.code_verifier
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  // Set access_token in a secure cookie
  res.setHeader('Set-Cookie', serialize('access_token', tokenResponse.data.access_token, {
    path: '/',
    httpOnly: true,
    secure: true
  }));

  res.redirect('/');
}