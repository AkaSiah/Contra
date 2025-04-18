import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig.js";
const app = initializeApp(firebaseConfig);


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
    const preference = {};

    const users = getUsers();

    if (users[username]) {
        alert("Username already taken.");
    } else {
        users[username] = {
            name: username,
            email: email, 
            password: password,
            preference 
        };
        saveUsers(users);
        localStorage.setItem("currentUser", username);

        const audio = document.getElementById('WelcomeAudio');
        audio.play();
        setTimeout(() => {
            window.location.href = "quary.html";
          }, 2000)
        document.getElementById("signup-form").reset();
    }  
    
    
});