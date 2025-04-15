 function login() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "bob" && password === "bobpass") {
            
            document.querySelector(".wrapper").style.display = "none";
            document.getElementById("loading-screen").style.display = "flex";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } else {
            alert("Invalid username or password.");
        }
    }
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
    function toggleFollow(button) {
        if (button.textContent === 'Follow') {
          button.textContent = 'Unfollow';
          button.style.backgroundColor = '#b30000'; 
        } else {
          button.textContent = 'Follow';
          button.style.backgroundColor = '#6a0dad'; 
        }
      }
