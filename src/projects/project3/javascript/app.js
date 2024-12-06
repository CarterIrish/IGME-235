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
let currentWord = []; // the current state of our word
let properWord = []; // the proper spelling of our word

window.onload = (e) => {
    newWordBtnClicked();

    const newWordButton = document.querySelector("#newWordButton");
    newWordButton.addEventListener("click", newWordBtnClicked);

    const checkBtn = document.querySelector("#checkButton");
    checkBtn.addEventListener("click", checkLocation);

}


// Apply the event listeners for when user clicks, drags and drops a letter tile.
const applyEventListeners = () => {
    const tiles = document.querySelectorAll('.letterTile');
    // Add drag and drop events to each tile
    tiles.forEach(tile => {
        // Start dragging
        tile.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', tile.id);
            tile.style.opacity = '0.5';
        });

        // End dragging
        tile.addEventListener('dragend', () => {
            tile.style.opacity = '1';
        });

        // Allow dropping onto other tiles
        tile.addEventListener('dragover', (e) => {
            e.preventDefault(); // Enable dropping
        });

        // Handle the drop event
        tile.addEventListener('drop', (e) => {
            e.preventDefault();

            // Get the dragged tile
            const draggedTileId = e.dataTransfer.getData('text/plain');
            const draggedTile = document.getElementById(draggedTileId);

            // Get the tile being dropped onto
            const targetTile = e.currentTarget;

            // Swap the two tiles in the DOM
            const parent = targetTile.parentNode;
            // ensure that you only swap the nextSibling for dragged tile with target tile if they are adgjacent. 
            const draggedTileNextSibling = draggedTile.nextSibling === targetTile ? draggedTile : draggedTile.nextSibling;

            // insert the draged tile and target tile into their respective spots in DOM
            parent.insertBefore(draggedTile, targetTile);
            parent.insertBefore(targetTile, draggedTileNextSibling);
        });
    });
}

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
    console.log(properWord);

    // Create a copy of properWord
    currentWord = shuffleArray([...properWord]);
    console.log("Post Shuffle");
    console.log(currentWord);
    console.log(properWord);

    // Update the tiles with the shuffled letters
    let tiles = document.querySelectorAll(".letterTile");
    for (i = 0; i < tiles.length; i++) {
        tiles[i].innerHTML = currentWord[i];
    }
}

// check location of all letter tiles on page
const checkLocation = () => {
    // get list of nodes to check
    const tileNodeList = document.querySelectorAll(".letterTile");
    // for each node, check the innerHTML against the proper letter for that location
    for (i = 0; i < tileNodeList.length; i++) {
        if (tileNodeList[i].innerHTML === properWord[i]) {
            tileNodeList[i].style.backgroundColor = "#4CAF50";
        }
        else {
            tileNodeList[i].style.backgroundColor = "#FF7043";
        }
    }
}

