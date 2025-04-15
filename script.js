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
