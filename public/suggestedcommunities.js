document.addEventListener("DOMContentLoaded", () => {
    let followedCommunities = JSON.parse(localStorage.getItem("followedCommunities")) || [];
    let allGames = [];
    let currentIndex = 0;
    const itemsPerPage = 10;
  
    function saveFollowedCommunities() {
      localStorage.setItem("followedCommunities", JSON.stringify(followedCommunities));
    }
  
    window.toggleFollow = function (gameName, button) {
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
      renderFollowedCommunities();
    };
  
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
      if (currentIndex >= allGames.length) {
        const loadMoreBtn = document.getElementById("load-more-btn");
        if (loadMoreBtn) loadMoreBtn.style.display = "none";
      }
    }
  
    function renderCommunities() {
      fetch("games.json")
        .then(res => res.json())
        .then(data => {
          allGames = shuffleArray(data);
          currentIndex = 0;
          const container = document.getElementById("community-list");
          if (container) container.innerHTML = "";
          const loadMoreBtn = document.getElementById("load-more-btn");
          if (loadMoreBtn) loadMoreBtn.style.display = "block";
          loadNextCommunities();
        })
        .catch(err => console.error("Failed to fetch games:", err));
    }
  
    function renderFollowedCommunities() {
      const container = document.getElementById("followers-list");
      if (!container) return;
  
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
  
    window.unfollowCommunity = function (title) {
      let followed = JSON.parse(localStorage.getItem("followedCommunities")) || [];
      followed = followed.filter(name => name !== title);
      localStorage.setItem("followedCommunities", JSON.stringify(followed));
      renderFollowedCommunities();
    };
  
    // Initial load
    renderCommunities();
  
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", loadNextCommunities);
    }
  });