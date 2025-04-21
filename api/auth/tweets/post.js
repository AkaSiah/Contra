import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tweet } = req.body;
  const { access_token } = parse(req.headers.cookie || '');

  if (!access_token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const tweetResponse = await axios.post('https://api.twitter.com/2/tweets', {
      text: tweet
    }, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ tweet: tweetResponse.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post tweet' });
  }
}
