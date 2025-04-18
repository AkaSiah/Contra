
    function playStory(videoSrc) {
        const overlay = document.createElement("div");
        overlay.id = "story-overlay";
        overlay.innerHTML = `
            <div class="story-player">
                <video src="${videoSrc}" autoplay controls></video>
                <button class="close-story" onclick="closeStory()">×</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    function closeStory() {
        const overlay = document.getElementById("story-overlay");
        if (overlay) overlay.remove();
    }
    let followedCommunities = JSON.parse(localStorage.getItem("followedCommunities")) || [];

function saveFollowedCommunities() {
  localStorage.setItem("followedCommunities", JSON.stringify(followedCommunities));
}

function toggleFollow(gameName, button) {
  const index = followedCommunities.indexOf(gameName);
  const isFollowing = index !== -1;

  if (isFollowing) {
    followedCommunities.splice(index, 1);
    button.textContent = 'Follow';
    button.style.backgroundColor = '#6a0dad';
  } else {
    followedCommunities.push(gameName);
    button.textContent = 'Unfollow';
    button.style.backgroundColor = '#b30000';
  }

  saveFollowedCommunities();
}

let allGames = [];
let currentIndex = 0;
const itemsPerPage = 10;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadNextCommunities() {
  const container = document.getElementById("community-list");
  const nextItems = allGames.slice(currentIndex, currentIndex + itemsPerPage);

  nextItems.forEach(game => {
    const isFollowed = followedCommunities.includes(game.title);
    const div = document.createElement("div");
    div.className = "community";
    div.innerHTML = `
      <span>${game.title}</span>
      <button onclick="toggleFollow('${game.title}', this)" style="background-color: ${isFollowed ? '#b30000' : '#6a0dad'}">
        ${isFollowed ? "Unfollow" : "Follow"}
      </button>
    `;
    container.appendChild(div);
  });

  currentIndex += itemsPerPage;

  // Hide button if no more items
  if (currentIndex >= allGames.length) {
    document.getElementById("load-more-btn").style.display = "none";
  }
}

function renderCommunities() {
  fetch("games.json")
    .then(res => res.json())
    .then(data => {
      allGames = shuffleArray(data);
      currentIndex = 0;
      document.getElementById("community-list").innerHTML = "";
      document.getElementById("load-more-btn").style.display = "block";
      loadNextCommunities();
    })
    .catch(err => {
      console.error("Failed to fetch games:", err);
    });
}

document.getElementById("load-more-btn").addEventListener("click", loadNextCommunities);

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

const clients = getUsers();
const currentClient = localStorage.getItem("currentUser");

// Run on page load
renderCommunities();
      const currentUser = {
        name: clients[currentClient].name,
        screen_name: clients[currentClient].email,
        profile_image_url: clients[currentClient].preference.profile
      };
      
      const tweetInput = document.querySelector("textarea");
      const tweetButton = document.querySelector("button");
      const feed = document.querySelector(".feed");
      const userList = document.getElementById("user-list");
      
      let tweets = JSON.parse(localStorage.getItem("tweets")) || [];
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      let followedUsers = JSON.parse(localStorage.getItem("followedUsers")) || [];
      
      function saveTweets() {
        localStorage.setItem("tweets", JSON.stringify(tweets));
      }
      
      function saveFavorites() {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
      
      function saveFollowedUsers() {
        localStorage.setItem("followedUsers", JSON.stringify(followedUsers));
      }
      
      function renderTweets(tweetArray) {
        feed.innerHTML = "";
        tweetArray.forEach((tweet, index) => {
          const isFavorite = favorites.includes(tweet.id);
          const tweetDiv = document.createElement("div");
          tweetDiv.className = "tweet";
      
          const commentsHtml = (tweet.comments || [])
            .map(
              comment => `
              <div class="comment">
                <strong>${comment.name}</strong> <span>${comment.screen_name}</span>: ${comment.text}
              </div>`
            )
            .join("");
      
          tweetDiv.innerHTML = `
            <div class="tweet-header">
              <img src="${tweet.profile_image_url}" width="32" height="32" style="border-radius:50%;vertical-align:middle;margin-right:8px;">
              <strong>${tweet.name}</strong> <span>${tweet.screen_name}</span> · <span>${new Date(tweet.timestamp).toLocaleString()}</span>
            </div>
            <p>${tweet.text}</p>
            <div class="tweet-actions">
              <button onclick="toggleFavorite('${tweet.id}')">${isFavorite ? "💖" : "🤍"} Favorite</button>
              <button onclick="toggleCommentBox('${tweet.id}')">🗨️ Comment</button>
              ${tweet.screen_name === currentUser.screen_name
                ? `<button onclick="editTweet('${tweet.id}')">✏️ Edit</button>
                   <button onclick="deleteTweet('${tweet.id}')">🗑️ Delete</button>`
                : ""}
            </div>
            <div class="comment-box" id="comment-box-${tweet.id}" style="display: none; margin-top: 10px;">
              <textarea id="comment-text-${tweet.id}" rows="2" style="width: 100%;"></textarea>
              <button onclick="submitComment('${tweet.id}')">Post Comment</button>
            </div>
            <div class="comments">${commentsHtml}</div>
          `;
          feed.appendChild(tweetDiv);
        });
      }
      
      function toggleCommentBox(tweetId) {
        const box = document.getElementById(`comment-box-${tweetId}`);
        box.style.display = box.style.display === "none" ? "block" : "none";
      }
      
      function submitComment(tweetId) {
        const tweet = tweets.find(t => t.id === tweetId);
        const textarea = document.getElementById(`comment-text-${tweetId}`);
        const text = textarea.value.trim();
        if (!text) return;
      
        const comment = {
          name: currentUser.name,
          screen_name: currentUser.screen_name,
          text,
          timestamp: new Date().toISOString()
        };
      
        if (!tweet.comments) tweet.comments = [];
        tweet.comments.push(comment);
        textarea.value = "";
      
        saveTweets();
        renderTweets(tweets);
      }
      // render tweets outside of function
      
      function showAll() {
        renderTweets(tweets);
      }
      
      function showFavorites() {
        const favs = tweets.filter(t => favorites.includes(t.id));
        renderTweets(favs);
      }
      
      tweetButton.addEventListener("click", () => {
        const text = tweetInput.value.trim();
        if (!text) return;
      
        const newTweet = {
          id: Date.now().toString(),
          text,
          timestamp: new Date().toISOString(),
          name: currentUser.name,
          screen_name: currentUser.screen_name,
          profile_image_url: currentUser.profile_image_url,
          comments: []
        };
      
        tweets.unshift(newTweet);
        saveTweets();
        tweetInput.value = "";
        renderTweets(tweets);
      });
      
      function toggleFavorite(id) {
        if (favorites.includes(id)) {
          favorites = favorites.filter(f => f !== id);
        } else {
          favorites.push(id);
        }
        saveFavorites();
        renderTweets(tweets);
      }
      
      function editTweet(id) {
        const tweet = tweets.find(t => t.id === id);
        const newText = prompt("Edit your tweet:", tweet.text);
        if (newText !== null) {
          tweet.text = newText;
          saveTweets();
          renderTweets(tweets);
        }
      }
      
      function deleteTweet(id) {
        tweets = tweets.filter(t => t.id !== id);
        saveTweets();
        renderTweets(tweets);
      }
      
      fetch("data.json")
        .then(res => res.json())
        .then(data => {
          const users = data.users;
      
          users.forEach(user => {
            const li = document.createElement("li");
            const isFollowed = followedUsers.includes(user.screen_name);
      
            li.innerHTML = `
              <img src="${user.profile_image_url}" alt="${user.name}" width="32" height="32" style="border-radius:50%;vertical-align:middle;margin-right:8px;">
              ${user.name}
              <button onclick="toggleFollow('${user.screen_name}')">
                ${isFollowed ? "Unfollow" : "Follow"}
              </button>
            `;
            userList.appendChild(li);
      
            // Add their tweet to the feed
            if (user.status) {
              const tweet = {
                id: Date.now().toString() + Math.random(),
                text: user.status.text,
                timestamp: user.status.created_at,
                name: user.name,
                screen_name: user.screen_name,
                profile_image_url: user.profile_image_url,
                comments: []
              };
              tweets.push(tweet);
            }
          });
      
          saveTweets();
          renderTweets(tweets);
        });

        document.addEventListener("DOMContentLoaded", () => {
          const favoriteTweetContainer = document.getElementById("favourite-tweets");
        
          if (favoriteTweetContainer) {
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const tweets = JSON.parse(localStorage.getItem("tweets")) || [];
        
            function renderFavoriteTweets() {
              favoriteTweetContainer.innerHTML = "";
        
              const favTweets = tweets.filter(tweet => favorites.includes(tweet.id));
        
              if (favTweets.length === 0) {
                favoriteTweetContainer.innerHTML = "<p>No favourites yet.</p>";
                return;
              }
        
              favTweets.forEach(tweet => {
                const tweetDiv = document.createElement("div");
                tweetDiv.className = "tweet";
        
                const commentsHtml = (tweet.comments || [])
                  .map(comment => `
                    <div class="comment">
                      <strong>${comment.name}</strong> <span>@${comment.screen_name}</span>: ${comment.text}
                    </div>
                  `).join("");
        
                tweetDiv.innerHTML = `
                  <div class="tweet-header">
                    <img src="${tweet.profile_image_url}" width="32" height="32" class="tweet-avatar">
                    <strong>${tweet.name}</strong> <span>@${tweet.screen_name}</span> · <span>${new Date(tweet.timestamp).toLocaleString()}</span>
                  </div>
                  <p>${tweet.text}</p>
                  <div class="tweet-actions">
                    <button onclick="toggleFavorite('${tweet.id}')">💖 Unfavourite</button>
                  </div>
                  <div class="comments">${commentsHtml}</div>
                `;
                favoriteTweetContainer.appendChild(tweetDiv);
              });
            }
        
            window.toggleFavorite = function(id) {
              let favs = JSON.parse(localStorage.getItem("favorites")) || [];
              if (favs.includes(id)) {
                favs = favs.filter(f => f !== id);
              } else {
                favs.push(id);
              }
              localStorage.setItem("favorites", JSON.stringify(favs));
              renderFavoriteTweets();
            }
        
            renderFavoriteTweets();
          }
        });
        document.addEventListener("DOMContentLoaded", () => {
          renderFollowedCommunities();
        });
        
        function renderFollowedCommunities() {
          const container = document.getElementById("followers-list");
          container.innerHTML = "";
        
          const followed = JSON.parse(localStorage.getItem("followedCommunities")) || [];
        
          fetch("games.json")
            .then(res => res.json())
            .then(data => {
              const followedData = data.filter(game => followed.includes(game.title));
        
              if (followedData.length === 0) {
                container.innerHTML = "<p>You haven't followed any communities yet.</p>";
                return;
              }
        
              followedData.forEach(game => {
                const div = document.createElement("div");
                div.className = "community-card";
                div.innerHTML = `
                  <strong>${game.title}</strong>
                  <button class="unfollow-btn" onclick="unfollowCommunity('${game.title}')">Unfollow</button>
                `;
                container.appendChild(div);
              });
            })
            .catch(err => {
              console.error("Failed to load followed communities:", err);
              container.innerHTML = "<p>Failed to load followed communities.</p>";
            });
        }
        
        function unfollowCommunity(title) {
          let followed = JSON.parse(localStorage.getItem("followedCommunities")) || [];
          followed = followed.filter(name => name !== title);
          localStorage.setItem("followedCommunities", JSON.stringify(followed));
          renderFollowedCommunities();
        }

        async function navigate(title, url){
          document.title = title;
          let content = document.querySelector('#page-layout');
          if(url === null){
            content.innerHTML = "";
          }else{
            let response = await fetch(url);//fetch another page eg battery.html
            content.innerHTML = await response.text();
            executeScripts();
          }
        }
        renderTweets(tweets);