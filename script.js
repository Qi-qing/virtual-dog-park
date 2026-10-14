/* ===========================================================
   Virtual Dog Park - script.js
   Three small jobs, written in plain ("vanilla") JavaScript.
   The <script> tag is at the end of the HTML file, so the page
   is already loaded when this code runs.
   =========================================================== */

/* -----------------------------------------------------------
   1. Greeting that changes with the time of day
   ----------------------------------------------------------- */
var hour = new Date().getHours();
var greeting = "Welcome to the park!";

if (hour < 12) {
  greeting = "Good morning! Welcome to the park.";
} else if (hour < 18) {
  greeting = "Good afternoon! Welcome to the park.";
} else {
  greeting = "Good evening! Welcome to the park.";
}

document.getElementById("welcome").textContent =
  greeting + " Meet three friendly dog breeds in the encyclopedia below.";

/* -----------------------------------------------------------
   2. "Show fun fact" buttons
   Each button knows which paragraph it controls through the
   aria-controls attribute, so one small loop handles all three.
   ----------------------------------------------------------- */
var buttons = document.querySelectorAll(".fact-toggle");

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    var factId = this.getAttribute("aria-controls");
    var fact = document.getElementById(factId);
    var isOpen = this.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      fact.setAttribute("hidden", "");
      this.setAttribute("aria-expanded", "false");
      this.textContent = "Show fun fact";
    } else {
      fact.removeAttribute("hidden");
      this.setAttribute("aria-expanded", "true");
      this.textContent = "Hide fun fact";
    }
  });
}

/* -----------------------------------------------------------
   3. Put the current year in the footer
   ----------------------------------------------------------- */
document.getElementById("year").textContent =
  "Copyright " + new Date().getFullYear() + " Virtual Dog Park";

/* ===========================================================
   4. MY VIRTUAL DOG - the data and the picture
   =========================================================== */

/* Which drawing belongs to which breed. */
var BREED_IMAGES = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

/* The adopted dog is kept in this variable. It stays "null"
   until the visitor adopts, which means "no dog yet". */
var myDog = null;

/* Short cuts to the parts of the page we need to change. */
var petCard = document.getElementById("pet-card");
var petImage = document.getElementById("pet-image");
var formMessage = document.getElementById("form-message");
var happinessTrack = document.getElementById("happiness-track");
var happinessFill = document.getElementById("happiness-fill");

/* getGrowthStage(day) -> the name of the stage.
   A dog of 1 to 3 days is a Puppy, 4 to 6 days is a Young Dog,
   and 7 days or more is an Adult Dog. */
function getGrowthStage(day) {
  if (day <= 3) {
    return "Puppy";
  } else if (day <= 6) {
    return "Young Dog";
  } else {
    return "Adult Dog";
  }
}

/* checkName(text) -> an object telling us if the name is usable.
   trim() removes spaces at the start and the end, but keeps the
   spaces in the middle, so "  Big  Rex  " becomes "Big  Rex". */
function checkName(text) {
  var name = text.trim();

  if (name === "") {
    return { ok: false, message: "Please type a name for your dog before adopting." };
  }

  if (name.length > 20) {
    return { ok: false, message: "That name is too long. Please use 20 characters or fewer." };
  }

  return { ok: true, name: name };
}

/* Show or hide the message under the Adopt button. */
function showMessage(text) {
  formMessage.textContent = text;
  formMessage.removeAttribute("hidden");
}

function hideMessage() {
  formMessage.textContent = "";
  formMessage.setAttribute("hidden", "");
}

/* renderDog() redraws the dog card from the myDog object.
   Every piece of text is written with textContent, so the name
   is shown as plain text. If someone typed "<b>Rex</b>", the
   page would print those characters instead of running HTML. */
function renderDog() {
  document.getElementById("pet-name").textContent = myDog.name;
  document.getElementById("pet-breed").textContent = myDog.breed;
  document.getElementById("pet-day").textContent = myDog.day;
  document.getElementById("pet-stage").textContent = myDog.stage;
  document.getElementById("pet-happiness").textContent = myDog.happiness;

  /* The drawing and its alt text follow the chosen breed. */
  petImage.src = myDog.image;
  petImage.alt = "Illustration of a " + myDog.breed;

  /* The bar shows the same number as the text above it. */
  happinessFill.style.width = myDog.happiness + "%";
  happinessTrack.setAttribute("aria-valuenow", myDog.happiness);

  petCard.removeAttribute("hidden");
}

/* ===========================================================
   5. MY VIRTUAL DOG - the Adopt button
   =========================================================== */

document.getElementById("adopt-form").addEventListener("submit", function (event) {
  /* Stop the browser from reloading the page when we submit. */
  event.preventDefault();

  var breed = document.getElementById("dog-breed").value;
  var checked = checkName(document.getElementById("dog-name").value);

  /* If the name is not usable, show the message and stop here. */
  if (checked.ok === false) {
    showMessage(checked.message);
    return;
  }

  hideMessage();

  /* A brand new dog: day 1, Puppy, happiness 50. */
  var day = 1;
  myDog = {
    name: checked.name,
    breed: breed,
    image: BREED_IMAGES[breed],
    day: day,
    stage: getGrowthStage(day),
    happiness: 50
  };

  renderDog();
});

/* ===========================================================
   6. MY VIRTUAL DOG - Feed and Play
   =========================================================== */

/* Both buttons add 10 points. Math.min(100, ...) makes sure the
   happiness never goes above 100. */
function changeHappiness(points) {
  if (myDog === null) {
    return;
  }

  myDog.happiness = Math.min(100, myDog.happiness + points);
  renderDog();
}

document.getElementById("feed-button").addEventListener("click", function () {
  changeHappiness(10);
});

document.getElementById("play-button").addEventListener("click", function () {
  changeHappiness(10);
});
