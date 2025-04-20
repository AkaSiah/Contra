
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
      
      const tweetInput = document.querySelector("post-input");
      const tweetButton = document.querySelector("post-btn");
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
      
        function unfollowCommunity(title) {
          let followed = JSON.parse(localStorage.getItem("followedCommunities")) || [];
          followed = followed.filter(name => name !== title);
          localStorage.setItem("followedCommunities", JSON.stringify(followed));
          renderFollowedCommunities();
        }

        

        