let eggPosition = null;
let isShuffling = false;

function shuffle() {
  if (isShuffling) return;
  isShuffling = true;

  const resultEl = document.getElementById('result');
  resultEl.textContent = "Placing egg...";

  const cups = document.querySelectorAll('.cup');

  // Remove existing egg visuals
  const existingEgg = document.getElementById('egg');
  if (existingEgg) existingEgg.remove();

  // Randomly choose egg position
  eggPosition = Math.floor(Math.random() * 3) + 1;
  console.log("Egg is under cup", eggPosition);

  // Place egg animation first
  placeEggAnimation(eggPosition, () => {
    // After egg placement, start real shuffle
    resultEl.textContent = "Shuffling...";
    startRealShuffle(cups, resultEl);
  });
}

function placeEggAnimation(cupNumber, callback) {
  const cup = document.getElementById(`cup${cupNumber}`);
  const egg = document.createElement('div');
  egg.id = "egg";
  egg.className = "egg";
  document.body.appendChild(egg);

  const cupRect = cup.getBoundingClientRect();
  egg.style.left = `${cupRect.left + cupRect.width/2 - 15}px`;
  egg.style.top = `${cupRect.top - 30}px`;

  // Animate egg down into cup
  setTimeout(() => {
    egg.style.top = `${cupRect.top + cupRect.height/2 - 15}px`;
  }, 100);

  // After animation ends, proceed to shuffle
  setTimeout(() => {
    egg.style.visibility = "hidden"; // hide egg before shuffling
    callback();
  }, 700);
}

function startRealShuffle(cups, resultEl) {
  let shuffleCount = 0;
  const maxShuffles = 5; // fewer but realistic swaps

  // Record initial positions
  const positions = [];
  cups.forEach(cup => {
    const rect = cup.getBoundingClientRect();
    positions.push(rect.left);
  });

  const shuffleInterval = setInterval(() => {
    // Choose two random cups to swap
    const i = Math.floor(Math.random() * cups.length);
    let j = Math.floor(Math.random() * cups.length);
    while (i === j) {
      j = Math.floor(Math.random() * cups.length);
    }

    const cup1 = cups[i];
    const cup2 = cups[j];

    // Swap positions visually by changing their transform X based on difference
    const cup1Rect = cup1.getBoundingClientRect();
    const cup2Rect = cup2.getBoundingClientRect();
    const dx = cup2Rect.left - cup1Rect.left;

    cup1.style.transition = "transform 0.5s ease";
    cup2.style.transition = "transform 0.5s ease";

    cup1.style.transform = `translateX(${dx}px)`;
    cup2.style.transform = `translateX(${-dx}px)`;

    // After swap, reset transforms and swap their DOM positions for next swap
    setTimeout(() => {
      cup1.style.transition = "";
      cup2.style.transition = "";
      cup1.style.transform = "";
      cup2.style.transform = "";

      // Swap elements in the DOM for correct future swaps
      const parent = cup1.parentNode;
      if (cup1.nextSibling === cup2) {
        parent.insertBefore(cup2, cup1);
      } else {
        parent.insertBefore(cup1, cup2);
      }

      shuffleCount++;
      if (shuffleCount >= maxShuffles) {
        clearInterval(shuffleInterval);
        resultEl.textContent = "Shuffling done. Pick a cup!";
        isShuffling = false;
      }
    }, 600);

  }, 700);
}

function checkCup(selectedCup) {
  if (eggPosition === null) {
    document.getElementById('result').textContent = "Please shuffle first!";
    return;
  }

  const egg = document.getElementById('egg');
  const selectedCupEl = document.getElementById(`cup${selectedCup}`);
  const cupRect = selectedCupEl.getBoundingClientRect();

  // Reveal egg only if selected cup is correct
  if (selectedCup === eggPosition) {
    egg.style.left = `${cupRect.left + cupRect.width/2 - 15}px`;
    egg.style.top = `${cupRect.top + cupRect.height/2 - 15}px`;
    egg.style.visibility = "visible";
    document.getElementById('result').textContent = "🎉 You found the egg! You win!";
  } else {
    document.getElementById('result').textContent = "❌ Wrong cup. Try again!";
  }
}

document.getElementById('shuffleBtn').addEventListener('click', shuffle);

document.getElementById('cup1').addEventListener('click', () => checkCup(1));
document.getElementById('cup2').addEventListener('click', () => checkCup(2));
document.getElementById('cup3').addEventListener('click', () => checkCup(3));
