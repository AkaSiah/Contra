// backend/server.js (Add these modifications to your existing server.js)

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const axios = require('axios');
const dotenv = require('dotenv');
const crypto = require('crypto');
const base64url = require('base64url');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

const cache = {};
const CACHE_TTL = 1000 * 60 * 5;

const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// If you want to handle the main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());
app.use(cors());

app.use(session({
  secret: 'siah-session-secret', // Replace this with a secure secret in .env for production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const CLIENT_SECRET= process.env.CLIENT_SECRET;
const CLIENT_ID= process.env.CLIENT_ID;
const clientId = process.env.TWITTER_CLIENT_ID;
const BEARER_TOKEN = process.env.BEARER_TOKEN;
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

// In-memory store (replace with Redis/DB in production)
const pkceStore = {};

function generateCodeVerifier() {
  return base64url(crypto.randomBytes(32));
}

function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return base64url(hash);
}

app.get('/auth/twitter/init', (req, res) => {
  const state = uuidv4();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  pkceStore[state] = codeVerifier;

  const url = new URL('https://twitter.com/i/oauth2/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', process.env.TWITTER_CLIENT_ID);
  url.searchParams.set('redirect_uri', 'http://localhost:3000/auth/twitter/callback');
  url.searchParams.set('scope', 'tweet.read tweet.write users.read offline.access');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  res.json({ url: url.toString() });
});

// Store tweet timestamps and cached data
let tweetCache = {
  data: null,
  timestamp: null,
};

let lastTweetTime = null;
let lastLikeTime = null;

// Middleware to avoid posting tweets too fast
function checkTweetRateLimit(req, res, next) {
  const now = Date.now();
  if (lastTweetTime && now - lastTweetTime < 15 * 60 * 1000 / 5) {
    return res.status(429).json({ error: 'Tweet rate limit hit. Try again later.' });
  }
  next();
}

// Middleware to limit liking/bookmarking tweets
function checkLikeRateLimit(req, res, next) {
  const now = Date.now();
  if (lastLikeTime && now - lastLikeTime < 15 * 60 * 1000) {
    return res.status(429).json({ error: 'Like rate limit hit. Try again later.' });
  }
  next();
}

app.get('/auth/twitter/callback', async (req, res) => {
  const { code, state } = req.query;
  const { CLIENT_ID, CLIENT_SECRET } = process.env;

  if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing CLIENT_ID or CLIENT_SECRET in .env file');
  return res.status(500).send('Server error: Missing Twitter credentials');
}

const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  console.log('Received callback with state:', state);
  console.log('Received callback with code:', code);


  // Step 1: Validate state and retrieve code_verifier
  const codeVerifier = pkceStore[state];
  if (!codeVerifier) {
    return res.status(400).send('Invalid or expired state');
  }

  try {
    // Step 2: Exchange code for access token
    const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: process.env.TWITTER_CLIENT_ID,
      redirect_uri: 'http://localhost:3000/auth/twitter/callback',
      code_verifier: codeVerifier,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
    });

    console.log('Token exchange successful:', tokenResponse.data);

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    req.session.twitter = {
      access_token,
      refresh_token,
      expires_in,
    };

    
    // TODO: Store these securely in DB or session
    console.log('Access Token Stored in Session');
    res.redirect('/index.html');
  } catch (err) {
    console.error('Token exchange failed:', err.response?.data || err.message);
    res.status(500).send('Twitter authentication failed');
  }
});

let tweetCaches = {
  username: null,
  timestamp: 0,
  data: null
};

const userCache = {};

const twitterUsernames = ['IGN', 'Kotaku'];

const tweetCacheMap = {}; // { [username]: { timestamp, data } }

const rateLimitInfo = {};

app.get('/api/twitter/tweets', async (req, res) => {
  const now = Date.now();
  const combinedTweets = [];

  for (const username of twitterUsernames) {
    try {
      // Use cached tweets if within 15 minutes
      const cache = tweetCacheMap[username];
      if (cache && now - cache.timestamp < 15 * 60 * 1000) {
        console.log(`Serving cached tweets for ${username}`);
        combinedTweets.push(...cache.data);
        continue;
      }

      // Add delay between API calls to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Fetch user ID from Twitter API
      const userResponse = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
        headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` }
      });

      const userId = userResponse.data.data.id;

      // Fetch tweets for the user
      const tweetsResponse = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
        headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
        params: {
          max_results: 5,
          expansions: 'author_id',
          'tweet.fields': 'created_at,text',
          'user.fields': 'username,profile_image_url'
        }
      });

      const tweets = tweetsResponse.data.data || [];
      tweetCacheMap[username] = {
        timestamp: now,
        data: tweets
      };

      combinedTweets.push(...tweets);
    } catch (err) {
      console.error(`Error fetching tweets for ${username}:`, err.response?.data || err.message);
      if (err.response?.status === 429) {
        return res.status(429).json({ error: `Rate limit exceeded for ${username}. Try again later.` });
      }
    }
  }

  res.json({ tweets: combinedTweets });
});

// Post a Tweet (Twitter OAuth must be set up beforehand)
app.post('/api/postTweet', checkTweetRateLimit, async (req, res) => {
  const { tweet } = req.body;
  const token = req.session.twitter?.access_token;

  if (!token) {
    return res.status(401).json({ error: 'User not authenticated with Twitter' });
  }

  try {
    const response = await axios.post('https://api.twitter.com/2/tweets', {
      text: tweet
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    res.status(200).json({ success: true, tweet: response.data });
  } catch (err) {
    console.error('Error posting tweet:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to post tweet to Twitter' });
  }
});

// Get User Tweets (with cache)
app.get('/api/userTweets', async (req, res) => {
  const { userId, accessToken } = req.query;
  const now = Date.now();
  const cacheValid = tweetCache.timestamp && (now - tweetCache.timestamp < 15 * 60 * 1000);

  if (cacheValid && tweetCache.data) {
    return res.json(tweetCache.data);
  }

  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/${userId}/tweets`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    tweetCache = {
      data: response.data,
      timestamp: Date.now(),
    };
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

// Like a tweet (bookmark)
app.post('/api/likeTweet', checkLikeRateLimit, async (req, res) => {
  const { tweetId, userId, accessToken } = req.body;
  try {
    const response = await axios.post(
      `https://api.twitter.com/2/users/${userId}/likes`,
      { tweet_id: tweetId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    lastLikeTime = Date.now();
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Failed to like tweet' });
  }
});

try {
  app.get('/api/:id', (req, res) => {
    res.send(`Route with parameter: ${req.params.id}`);
  });
} catch (error) {
  console.error('Error registering route:', error.message);
}

app.get('/api/getPosts', (req, res) => {
  const mockTweets = [
    {
      id: '1',
      username: 'IGN',
      profile_image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/49/IGN_Logo.svg',
      content: "Just dropped our review of Elden Ring: Shadow of the Erdtree — it's brutal, beautiful, and bold. 🌌🔥",
      created_at: '2025-04-19T10:05:00Z',
    },
    {
      id: '2',
      username: 'PlayStation',
      profile_image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg',
      content: "The PS5 Pro is real and it's coming sooner than you think 👀 Stay tuned.",
      created_at: '2025-04-19T09:45:00Z',
    },
    {
      id: '3',
      username: 'Kotaku',
      profile_image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Kotaku_logo.svg',
      content: "Tears of the Kingdom modders are getting WILD. Someone turned Link into Goku.",
      created_at: '2025-04-19T08:30:00Z',
    },
  ];

  res.json(mockTweets); // Return mock data as JSON
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});