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
