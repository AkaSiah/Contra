


function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}


document.getElementById("login-form").addEventListener('submit', function (e) {
  e.preventDefault(); 
  
  const password = document.getElementById("login-password").value;
  const username = document.getElementById("login-username").value;

  const users = getUsers();

  if (users[username] && users[username].password === password) {
    
    if(!localStorage.getItem("currentUser", username)) {
      localStorage.setItem("currentUser", username);
    }

    const audio = document.getElementById('WelcomeAudio');
    audio.play();
    setTimeout(() => {
        window.location.href = "index.html";
  
    }, 2000)
    
    

  } else {
    alert("Invalid username or password.");
  }  
  
  
});