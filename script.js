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
var petMessage = document.getElementById("pet-message");
var happinessTrack = document.getElementById("happiness-track");
var happinessFill = document.getElementById("happiness-fill");

/* How much happiness a dog loses every day, because it gets
   hungry and bored while time passes. Change this number to
   make the game harder or easier, or set it to 0 to turn the
   daily change off. */
var HAPPINESS_LOST_PER_DAY = 5;

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

/* The same idea for the line under the Feed / Play buttons.
   It tells the visitor what just happened to the happiness. */
function showPetMessage(text) {
  petMessage.textContent = text;
  petMessage.removeAttribute("hidden");
}

function hidePetMessage() {
  petMessage.textContent = "";
  petMessage.setAttribute("hidden", "");
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
  hidePetMessage();

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
  saveDog();
});

/* ===========================================================
   6. MY VIRTUAL DOG - Feed and Play
   =========================================================== */

/* Both buttons add 10 points. Math.min(100, ...) makes sure the
   happiness never goes above 100. When it is already full the
   visitor gets a message, so the button does not look broken. */
function changeHappiness(points) {
  if (myDog === null) {
    return;
  }

  if (myDog.happiness >= 100) {
    showPetMessage("Your dog is already as happy as can be (" + myDog.happiness + " / 100). It will get a little hungry tomorrow!");
    return;
  }

  myDog.happiness = Math.min(100, myDog.happiness + points);
  hidePetMessage();
  renderDog();
  saveDog();
}

document.getElementById("feed-button").addEventListener("click", function () {
  changeHappiness(10);
});

document.getElementById("play-button").addEventListener("click", function () {
  changeHappiness(10);
});

/* ===========================================================
   7. MY VIRTUAL DOG - the Next Day button
   =========================================================== */

/* One day older. The dog also loses a few happiness points,
   because a day has passed without care. Math.max(0, ...) stops
   the number from ever going below zero. Then the growth stage
   is worked out again from the new day number, and renderDog()
   draws the card again, so every line on the page updates. */
function goToNextDay() {
  if (myDog === null) {
    return;
  }

  myDog.day = myDog.day + 1;
  myDog.happiness = Math.max(0, myDog.happiness - HAPPINESS_LOST_PER_DAY);
  myDog.stage = getGrowthStage(myDog.day);

  var note = "A new day starts. Happiness went down by " + HAPPINESS_LOST_PER_DAY + ".";
  if (myDog.happiness === 0) {
    note = note + " Your dog is very sad now, so feed it and play with it!";
  }
  showPetMessage(note);

  renderDog();
  saveDog();
}

document.getElementById("next-day-button").addEventListener("click", goToNextDay);

/* ===========================================================
   8. SAVING AND LOADING THE DOG
   localStorage is a small store built into every browser. We
   keep one text value there. JSON.stringify turns the myDog
   object into text, and JSON.parse turns the text back into an
   object when the page is opened again.
   =========================================================== */

var STORAGE_KEY = "virtualDogPark.myDog";

/* Save the current dog. Called after every change: adopt,
   feed, play and next day. */
function saveDog() {
  if (myDog === null) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(myDog));
  } catch (error) {
    /* A few browsers block storage, for example in private
       mode. The game still works, the dog is just forgotten. */
  }
}

/* Check that the saved text really looks like one of our dogs.
   If somebody edited it by hand, we would rather start fresh
   than show something strange on the page. */
function isUsableDog(dog) {
  if (dog === null || typeof dog !== "object") {
    return false;
  }
  /* The same rule as the form, so a saved name can never be
     empty or longer than 20 characters. */
  if (typeof dog.name !== "string" || checkName(dog.name).ok === false) {
    return false;
  }
  /* hasOwnProperty() makes sure the breed is really one of our
     three names, and not something like "toString". */
  if (typeof dog.breed !== "string" || BREED_IMAGES.hasOwnProperty(dog.breed) === false) {
    return false;
  }
  /* The typeof check is not enough on its own: typeof NaN and
     typeof Infinity are both "number", so isFinite() is used too. */
  if (typeof dog.day !== "number" || isFinite(dog.day) === false || dog.day < 1) {
    return false;
  }
  if (typeof dog.happiness !== "number" || isFinite(dog.happiness) === false) {
    return false;
  }
  return true;
}

/* Read the saved dog. Returns the dog, or null when there is
   nothing saved that we can use. */
function loadDog() {
  var text;

  try {
    text = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }

  if (text === null) {
    return null;
  }

  var dog;
  try {
    dog = JSON.parse(text);
  } catch (error) {
    clearSavedDog();   /* the text was broken, so forget it */
    return null;
  }

  if (isUsableDog(dog) === false) {
    clearSavedDog();
    return null;
  }

  return dog;
}

/* Throw the saved dog away. It is used when the saved text cannot
   be used, so a broken value does not stay in the browser and get
   read again on every visit. */
function clearSavedDog() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    /* Nothing to do. */
  }
}

/* Run once, when the page opens. If a dog was saved earlier,
   show it again and greet the visitor. */
function startFromSavedDog() {
  var dog = loadDog();

  if (dog === null) {
    return;
  }

  /* Work the simple parts out again from the saved values, so an
     old or edited value cannot put odd numbers on the page. */
  dog.name = dog.name.trim();
  dog.day = Math.floor(dog.day);
  dog.image = BREED_IMAGES[dog.breed];
  dog.stage = getGrowthStage(dog.day);
  dog.happiness = Math.max(0, Math.min(100, Math.round(dog.happiness)));

  myDog = dog;
  renderDog();
  showPetMessage("Welcome back! " + myDog.name + " is still here, on day " + myDog.day + ".");
}

startFromSavedDog();
