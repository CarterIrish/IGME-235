const words = {
    0: ['a', 'p', 'p', 'l', 'e'],    // "apple"
    1: ['b', 'a', 'k', 'e', 'r'],    // "baker"
    2: ['c', 'a', 'n', 'd', 'y'],    // "candy"
    3: ['d', 'e', 'l', 't', 'a'],    // "delta"
    4: ['e', 'a', 'g', 'l', 'e'],    // "eagle"
    5: ['f', 'l', 'a', 'm', 'e'],    // "flame"
    6: ['g', 'r', 'a', 'p', 'e'],    // "grape"
    7: ['h', 'o', 'v', 'e', 'r'],    // "hover"
    8: ['j', 'o', 'k', 'e', 'r'],    // "joker"
    9: ['k', 'i', 't', 'e', 's'],    // "kites"
    10: ['l', 'a', 'm', 'p', 's'],   // "lamps"
    11: ['m', 'a', 'p', 'l', 'e'],   // "maple"
    12: ['p', 'a', 's', 't', 'e'],   // "paste"
    13: ['q', 'u', 'a', 'k', 'e'],   // "quake"
    14: ['r', 'e', 's', 't', 's'],   // "rests"
    15: ['v', 'a', 'l', 'u', 'e'],   // "value"
    16: ['w', 'h', 'i', 'p', 's'],   // "whips"
    17: ['y', 'o', 'g', 'a', 's'],   // "yogas"
    18: ['z', 'e', 'r', 'o', 's'],   // "zeros"
    19: ['s', 't', 'o', 'n', 'e'],   // "stone"
    20: ['c', 'h', 'a', 'i', 'r']    // "chair"
};

const tileContainer = document.querySelector("#wordContainer");
const initalHtmlState = tileContainer.innerHTML;
const clickSound = document.querySelector("#clickSound");
let currentWord = []; // the current state of our word
let properWord = []; // the proper spelling of our word

window.onload = (e) => {
    newWordBtnClicked();

    // Replace getElementById with querySelector
    const newWordButton = document.querySelector("#newWordButton");
    newWordButton.addEventListener("click", newWordBtnClicked);

    const checkBtn = document.querySelector("#checkButton");
    checkBtn.addEventListener("click", checkLocation);

    checkBtn.addEventListener('click', () => {
        clickSound.currentTime = 0; // Reset to start in case it was already playing
        clickSound.play(); // Play the sound
    });

    newWordButton.addEventListener('click', () => {
        clickSound.currentTime = 0; // Reset to start in case it was already playing
        clickSound.play(); // Play the sound
    });
}

// Apply swap animation on tile swap
const swapTiles = (draggedTile, targetTile) => {
    // Add animation classes
    draggedTile.classList.add('swapping');
    targetTile.classList.add('swapping');

    // Delay DOM manipulation to sync with animation
    setTimeout(() => {
        const parent = targetTile.parentNode;
        const draggedTileNextSibling = draggedTile.nextSibling === targetTile ? draggedTile : draggedTile.nextSibling;

        // Swap tiles in the DOM
        parent.insertBefore(draggedTile, targetTile);
        parent.insertBefore(targetTile, draggedTileNextSibling);

        // Remove animation classes
        draggedTile.classList.remove('swapping');
        targetTile.classList.remove('swapping');
    }, 300); // Match CSS animation duration
};

// Update drop event
const applyEventListeners = () => {
    const tiles = document.querySelectorAll('.letterTile');

    tiles.forEach(tile => {
        tile.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tile.id);
            tile.style.opacity = '0.5';
        });

        tile.addEventListener('dragend', () => {
            tile.style.opacity = '1';
        });

        tile.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        tile.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedTileId = e.dataTransfer.getData('text/plain');
            const draggedTile = document.querySelector(`#${draggedTileId}`);
            const targetTile = e.currentTarget;

            const bothNotCorrect = draggedTile.getAttribute('isCorrect') === 'false' && targetTile.getAttribute('isCorrect') === 'false';
            if (bothNotCorrect) {
                swapTiles(draggedTile, targetTile);
            }
        });
    });
};

// shuffle the word array
const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// Get a random word
const newWordBtnClicked = () => {
    tileContainer.innerHTML = initalHtmlState;
    applyEventListeners();

    // Pick a random word and create copy for currentWord
    properWord = words[Math.floor(Math.random() * (Object.keys(words).length))];

    // Create a copy of properWord
    currentWord = shuffleArray([...properWord]);

    // Update the tiles with the shuffled letters
    let tiles = document.querySelectorAll(".letterTile");
    for (i = 0; i < tiles.length; i++) {
        tiles[i].innerHTML = currentWord[i];
    }
}

// Check the location of all letter tiles on page
const checkLocation = () => {
    const tileNodeList = document.querySelectorAll(".letterTile");
    
    // For each tile, check if it matches the proper word at that location
    for (let i = 0; i < tileNodeList.length; i++) {
        if (tileNodeList[i].innerHTML === properWord[i]) {
            // If the tile is in the correct position, mark it as correct
            tileNodeList[i].style.backgroundColor = "#4CAF50"; // Green for correct
            tileNodeList[i].setAttribute('isCorrect', 'true'); // Update the isCorrect attribute
            tileNodeList[i].setAttribute('draggable', 'false'); // Make it non-draggable
        } else {
            // If the tile is incorrect, mark it as incorrect
            tileNodeList[i].style.backgroundColor = "#FF7043"; // Red for incorrect
            tileNodeList[i].setAttribute('isCorrect', 'false'); // Update the isCorrect attribute
        }
    }
}
