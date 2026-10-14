# Virtual Dog Park

A small dog encyclopedia and virtual pet website, built with plain HTML, CSS and vanilla
JavaScript for a first-year programming lab. There is no framework, no package manager, no
backend and no external API: the browser opens three local files and does all the work.

## Features

**Dog Encyclopedia**
- Three breed cards: Beagle, Golden Retriever and Poodle.
- Each card lists size, personality and everyday care in short, plain sentences.
- A "Show fun fact" button reveals one extra fact per breed, and changes to "Hide fun fact" while it is open.

**My Virtual Dog**
- Choose a breed from a drop-down list, type a name, then press Adopt.
- The typed name is trimmed first, so spaces at the start and end are removed while spaces inside the
  name are kept ("  Big  Rex  " becomes "Big  Rex").
- An empty name, or a name longer than 20 characters, is refused and a short message explains why.
- The adopted dog is shown with its name, breed, day number, growth stage and happiness.
- Feed and Play buttons add happiness. A Next Day button moves the dog on to the next day.
- A happiness bar shows the same number as the text next to it.
- Short messages under the buttons explain what just happened, for example when happiness is
  already full or when a new day starts.

**Small details**
- One column on a phone, three columns for the encyclopedia on a laptop.
- Every image has descriptive alt text, and both form controls have a real `<label>`.
- The dog's name is written into the page as plain text, so a name like `<b>Rex</b>` is shown as
  characters and can never be treated as HTML.

## Files

| File | What it is |
|---|---|
| `index.html` | The page: heading, welcome message, encyclopedia, adopt form and the adopted dog card. |
| `style.css` | All of the styling, including the one-column and three-column layouts. |
| `script.js` | All of the behaviour: greeting, fun facts, adopting, feeding, playing, next day, saving and loading. |
| `assets/beagle.svg` | Illustration used for the Beagle. |
| `assets/golden-retriever.svg` | Illustration used for the Golden Retriever. |
| `assets/poodle.svg` | Illustration used for the Poodle. |

## How to preview the page

The page works when opened directly, but a local server is closer to a real website and keeps the
same address between reloads (which matters for saved progress).

**With VS Code Live Server**
1. Open the project folder in VS Code.
2. Install the extension **Live Server** (by Ritwick Dey) from the Extensions panel.
3. In the Explorer, right-click `index.html` and choose **Open with Live Server**.
4. The page opens in your browser at an address such as `http://127.0.0.1:5500/index.html`, and
   Live Server reloads it automatically whenever you save a file.

**With Python instead**
1. Open a terminal in the project folder (the folder that contains `index.html`).
2. Run `python -m http.server 8000` (Python 3).
3. Open `http://localhost:8000` in your browser. Press `Ctrl+C` in the terminal to stop it.

**Without a server**
- You can also just double-click `index.html`. It opens from the file system (`file://`) and the
  whole page still works, because everything in it is local.

## Growth and happiness rules

A brand new dog starts on **day 1**, at the **Puppy** stage, with **50 happiness**.

**Growth stage** is worked out from the day number:

| Day number | Growth stage |
|---|---|
| 1 to 3 | Puppy |
| 4 to 6 | Young Dog |
| 7 or more | Adult Dog |

**Happiness** always stays between 0 and 100:

| Action | Change |
|---|---|
| Feed | +10 happiness |
| Play | +10 happiness |
| Next Day | &minus;5 happiness |

- Happiness can never go above 100. When it is already 100, Feed and Play do nothing except show a
  short message saying the dog is as happy as it can be.
- Happiness can never go below 0.
- Next Day also increases the day number by one and recalculates the growth stage.
- Adopting again replaces the current dog with a brand new puppy (day 1, Puppy, 50 happiness).

Both rules are easy to change in `script.js`: `HAPPINESS_LOST_PER_DAY` holds the number of points a
day costs, and `getGrowthStage(day)` holds the day ranges for the stages.

## Where your pet's progress is stored

Your pet is saved **inside the browser on your own computer**, using the browser's built-in
`localStorage`. Nothing is sent anywhere, and there is no account to log in to.

- The saved value is one piece of text kept under the key `virtualDogPark.myDog`, written with
  `JSON.stringify()` and read back with `JSON.parse()`.
- It is saved straight after every change: adopting, feeding, playing and moving on a day.
- It is loaded again when the page is opened, so the same dog is there after a refresh or after
  closing and reopening the browser.
- **It is not stored in a GitHub account.** Putting this project on GitHub, or hosting it with
  GitHub Pages, only copies the code. It does not upload, move or sync your pet's progress, and
  your pet is not tied to any GitHub sign-in. The save lives in the browser that made it.
- Because the save belongs to one browser on one computer, a different browser, a different device,
  a private/incognito window, or clearing the browser's site data will all start with no dog.
- If a browser blocks local storage, the game still works normally, but the dog is simply not
  remembered the next time the page is opened.

## About the illustrations

The three dog pictures in `assets/` are **original SVG illustrations drawn for this project** with
basic shapes such as circles and ellipses. They are simple cartoon drawings, **not real dog
photographs**, and they contain no copyrighted photographs. The page does not link to, or depend
on, any external image website.

## Manual testing checklist

Run through these steps by hand and check the expected result each time.

| # | Step | Expected result |
|---|---|---|
| 1 | Open the page on a laptop, then narrow the window to phone width. | Text stays readable, the encyclopedia goes from three columns to one, and nothing overflows sideways. |
| 2 | Look at the three breed pictures and read their alt text (for example by right-clicking an image and choosing Inspect). | Each one has alt text such as "Illustration of a Beagle". |
| 3 | Press "Show fun fact" on each breed card. | A fact appears, the button says "Hide fun fact", and pressing it again hides the fact. |
| 4 | Press Adopt without typing a name. | A message asks for a name, and no dog card appears. |
| 5 | Type only spaces and press Adopt. | The same message appears; spaces do not count as a name. |
| 6 | Type a name, press Adopt, and check the fields. | The card shows the name, the breed, Day 1, Puppy and 50 happiness, with the matching illustration. |
| 7 | Press Feed and Play a few times. | Happiness goes up by 10 each time, and the bar moves with it. |
| 8 | Keep pressing Feed until happiness reaches 100, then press it once more. | The number stays at 100 and a message explains that the dog is as happy as it can be. |
| 9 | Press Next Day several times. | The day number goes up by 1, happiness drops by 5, and the stage changes to Young Dog at day 4 and Adult Dog at day 7. |
| 10 | Refresh the page, or close and reopen the browser tab. | The same dog comes back with the same name, breed, day, stage and happiness. |
| 11 | Adopt a different breed with a new name. | The old dog is replaced by a new puppy on day 1 with 50 happiness. |
| 12 | Open the page in a different browser, or in a private window. | No dog is shown, and the encyclopedia and adopt form still work normally. |

## Known limits and possible next steps

- A day only moves on when Next Day is pressed; nothing happens in real time.
- There is no way to delete the saved dog from the page. Adopting a new dog overwrites it, and
  clearing the browser's site data removes it.
- Ideas for later: more breeds, more care actions, a puppy that grows visibly bigger, a "start over"
  button, or moving the save to a shared backend so it follows the visitor between devices.
