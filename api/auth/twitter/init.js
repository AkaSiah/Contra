import { generateCodeChallenge, generateCodeVerifier } from '../../../utils/pkce';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  const CLIENT_ID = process.env.TWITTER_CLIENT_ID;
  const codeVerifier = generateCodeVerifier();
  const state = Math.random().toString(36).substring(2);

  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Set cookies for state and verifier
  res.setHeader('Set-Cookie', [
    serialize('twitter_state', state, { path: '/', httpOnly: true }),
    serialize('code_verifier', codeVerifier, { path: '/', httpOnly: true })
  ]);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: 'https://contra-git-main-part-3-akasiahs-projects.vercel.app/api/auth/twitter/init',
    scope: 'tweet.read tweet.write users.read bookmark.write',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  res.redirect(`https://twitter.com/i/oauth2/authorize?${params.toString()}`);
}
