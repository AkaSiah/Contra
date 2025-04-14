 function login() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "bob" && password === "bobpass") {
            window.location.href = "index.html";
        } else {
            alert("Invalid username or password.");
        }
    }
