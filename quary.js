function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}
  
function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

const splash = document.querySelector('.splash');

document.addEventListener('DOMContentLoaded', (e)=>{
    setTimeout(()=>{
        splash.classList.add("display-none");
    }, 2000)
})

document.body.classList.add("no-scroll"); // lock scroll
document.body.classList.remove("no-scroll"); // unlock scroll (when ready)

const users = getUsers();
const currentUser = localStorage.getItem("currentUser");

const navigation = document.querySelector('.nav-bar')
const navHeight = navigation.offsetHeight;
document.documentElement.style.setProperty(
    "--scroll-padding",
    navHeight + "px"
)

document.getElementById("welcome-name").textContent = 'Welcome ' + users[currentUser].name;
setTimeout(()=>{
    document.getElementById("welcome-name").textContent = "Console";
}, 4000)

let next = document.querySelector('.next')
let prev = document.querySelector('.prev')

let sec1prev = document.querySelector('.prev-slide')
let sec1next = document.querySelector('.next-slide')

let sec2prev = document.querySelector('.prev2-slide')
let sec2next = document.querySelector('.next2-slide')

const consoleButtons = document.querySelectorAll('.console-btn');
const genreButtons = document.querySelectorAll('.genre-btn');
const profileButton = document.querySelectorAll('.profile-btn');
const gameButton = document.querySelector('.game-btn')

let chosenConsole;
let genre;
let game;
let avatar;
let bio;

function scrollToCenter(element) {
    const offset = window.innerHeight / 2 - element.offsetHeight / 2;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: top,
        behavior: 'smooth'
    });
}

consoleButtons.forEach(button => {
    button.addEventListener('click', function () {     
      chosenConsole = this.value;
      console.log(chosenConsole);

      // Optional: update user preference   
      if (currentUser && users[currentUser]) {
        users[currentUser].preference.console = chosenConsole;
        
        saveUsers(users);
      }

      const section = document.getElementById('section-1');
      scrollToCenter(section);
      document.getElementById("welcome-name").textContent = 'Genre'
    });
});

const slide = document.querySelector('.slide');
const secSlide1 = document.querySelector('.sec-slide1')
const secSlide2 = document.querySelector('.sec-slide2')

next.addEventListener('click', function() {
    let items = document.querySelectorAll('.item');
    slide.appendChild(items[0]);
})
prev.addEventListener('click', function() {
    let items = document.querySelectorAll('.item');
    slide.prepend(items[items.length - 1]);
})

sec1next.addEventListener('click', function() {
    let secItems = document.querySelectorAll('.sec-item');
    secSlide1.appendChild(secItems[0]);
})
sec1prev.addEventListener('click', function() {
    let secIitems = document.querySelectorAll('.sec-item');
    secSlide1.prepend(secIitems[secIitems.length - 1]);
})

sec2next.addEventListener('click', function() {
    let secItems2 = document.querySelectorAll('.sec-item2');
    secSlide2.appendChild(secItems2[0]);
})
sec2prev.addEventListener('click', function() {
    let secIitems2 = document.querySelectorAll('.sec-item2');
    secSlide2.prepend(secIitems2[secIitems2.length - 1]);
})



genreButtons.forEach(button => {
    button.addEventListener('click', function () {     
      genre = this.value;
      console.log(genre);

      // Optional: update user preference   
      if (currentUser && users[currentUser]) {
        users[currentUser].preference.genre = genre;
        
        saveUsers(users);
      }

      const section2 = document.getElementById('section-2');
      scrollToCenter(section2);
      document.getElementById("welcome-name").textContent = "Profile";
    });
});

profileButton.forEach(button => {
    button.addEventListener('click', function () {     
      let profile = this.value;
      console.log(profile);

      // Optional: update user preference   
      if (currentUser && users[currentUser]) {
        users[currentUser].preference.profile = profile;
        
        saveUsers(users);
      }

      const section3 = document.getElementById('section-3');
      scrollToCenter(section3);
      document.getElementById("welcome-name").textContent = "Favourite Game";
    });
});

gameButton.addEventListener('click', function(e) {
    e.preventDefault();

    const game = document.getElementById('game').value;
    if(game === '') {
        alert("No value entered");
    } else {
        console.log(game);

        if (currentUser && users[currentUser]) {
            users[currentUser].preference.favGame = game;
            
            saveUsers(users);
        }
        const section4 = document.getElementById('section-4');
        scrollToCenter(section4);
        document.getElementById("welcome-name").textContent = "Completed";

        const audio = document.getElementById('WelcomeAudio');
        audio.play();
        setTimeout(() => {
            // change to homescreen file location
            window.location.href = "following.html";
          }, 2000)
    }
    
})