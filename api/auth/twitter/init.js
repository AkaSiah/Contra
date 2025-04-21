import { generatePKCECodes } from "../../../utils/pkce";

export default async function handler(req, res) {
  const { codeChallenge, codeVerifier } = await generatePKCECodes();

  const state = crypto.randomUUID();
  const url = new URL("https://twitter.com/i/oauth2/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.TWITTER_CLIENT_ID);
  url.searchParams.set("redirect_uri", process.env.TWITTER_REDIRECT_URI);
  url.searchParams.set("scope", "tweet.read tweet.write users.read offline.access bookmark.read bookmark.write");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  // Set verifier in cookie (temporary session)
  res.setHeader("Set-Cookie", [
    `verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    `state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  ]);

  res.status(200).json({ url: url.toString() });
}