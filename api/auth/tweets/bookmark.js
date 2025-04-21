import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tweetId } = req.body;
  const { access_token } = parse(req.headers.cookie || '');

  if (!access_token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    await axios.post(`https://api.twitter.com/2/users/me/bookmarks`, {
      tweet_id: tweetId
    }, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bookmark tweet' });
  }
}
