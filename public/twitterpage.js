async function postTweet(text) {
    const response = await fetch('http://localhost:3000/api/postTweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
  
    const data = await response.json();
  
    if (data.success) {
      alert('Tweet posted!');
      console.log(data.tweet);
    } else {
      alert('Failed to post tweet');
      console.error(data.error);
    }
  }

  function renderPosts(tweets) {
    const postsContainer = document.getElementById('posts'); // Ensure this element exists in your HTML
    if (!postsContainer) {
      console.error('Error: #posts element not found in DOM');
      return;
    }
  
    postsContainer.innerHTML = ''; // Clear previous content
  
    tweets.forEach(tweet => {
      const tweetElement = document.createElement('div');
      tweetElement.classList.add('tweet'); // Add a class for styling
      tweetElement.innerHTML = `
        <p><strong>@${tweet.author_id}</strong> - ${new Date(tweet.created_at).toLocaleString()}</p>
        <p>${tweet.text}</p>
        <hr>
      `;
      postsContainer.appendChild(tweetElement);
    });
  }
  
  // Example usage:
  document.getElementById('post-btn').addEventListener('click', () => {
    const text = document.getElementById('post-input').value;
    postTweet(text);
  });