function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}


document.getElementById("signup-form").addEventListener('submit', function (e) {
    e.preventDefault(); 
    
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
    const email = document.getElementById("signup-email").value;

    const users = getUsers();

    if (users[email]) {
        alert("Email already registered.");
    } else {
        users[email] = {
            userName: username, 
            pass: password
        };
        saveUsers(users);

        const audio = document.getElementById('WelcomeAudio');
        audio.play();
        setTimeout(() => {
            window.location.href = "index.html";
          }, 2000)
        document.getElementById("signup-form").reset();
    }  
    
    
});