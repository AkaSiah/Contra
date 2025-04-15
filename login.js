function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}


document.getElementById("login-form").addEventListener('submit', function (e) {
  e.preventDefault(); 
  
  const password = document.getElementById("login-password").value;
  const email = document.getElementById("login-email").value;

  const users = getUsers();

  if (users[email] && users[email].pass === password) {
    
    const audio = document.getElementById('WelcomeAudio');
    audio.play();
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000)
    
    localStorage.setItem("loggedInUser", email);
  } else {
    alert("Invalid email or password.");
  }  
  
  
});