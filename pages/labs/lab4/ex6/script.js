// UI elements
let sizeSelect = document.getElementById("nr_select");
let gameTable = document.getElementById("game_table");
let resetBu = document.getElementById("reset_bu");
let switchBu = document.getElementById("switch_button");

// Data
const defaultSize = 4;
let currentSize = defaultSize;
let minSize = 3;
let maxSize = 10;
let xPos = null;
let yPos = null;
let playing = true;
let currentCell = null;
let picture = true;
let imageSize = 600;

// Sounds
let wrongSound = new Audio("sound/poc.mp3");

// Initializing select
for (let i = minSize; i <= maxSize; i++) {
    let selectOption = document.createElement("option");
    selectOption.innerHTML = i.toString();
    if (i === defaultSize)
        selectOption.selected = true;
    sizeSelect.appendChild(selectOption);
}

// Initializing table
function initTable() {
    playing = false;
    // Clearing table
    while (gameTable.hasChildNodes())
        gameTable.removeChild(gameTable.firstChild);

    // Generating numbers to add
    let nrArray = Array.from(Array(currentSize ** 2), (x, index) => index);

    for (let i = 1; i <= currentSize; i++) {
        let row = document.createElement("tr");
        for (let j = 1; j <= currentSize; j++) {
            let cell = document.createElement("td");

            let randPos = Math.floor(Math.random() * nrArray.length);
            let value = nrArray[randPos];
            nrArray.splice(randPos, 1);

            if (picture === false) {
                if (value > 0)
                    cell.innerHTML = value.toString();
                else {
                    cell.innerHTML = " ";
                    currentCell = cell;
                    xPos = i;
                    yPos = j;
                }
            } else {
                if (value < currentSize ** 2 - 1) {
                    let iPicture = Math.floor(value / currentSize);
                    let jPicture = (value % currentSize);

                    iPicture *= -(imageSize / currentSize);
                    jPicture *= -(imageSize / currentSize);

                    cell.style.background = "url(images/ccc.jpg) " + jPicture.toString() + "px " + iPicture.toString() + "px";
                    cell.style.width = ((imageSize / currentSize)-2).toString() + 'px';
                    cell.style.height = ((imageSize / currentSize)-2).toString() + 'px';
                } else {
                    xPos = i;
                    yPos = j;
                    currentCell = cell;
                    cell.style.width = ((imageSize / currentSize)-2).toString() + 'px';
                    cell.style.height = ((imageSize / currentSize)-2).toString() + 'px';
                }
            }
            row.appendChild(cell);
        }
        gameTable.appendChild(row);
    }
    playing = true;
}

// Utils

function getTableCell(x, y) {
    return gameTable.childNodes[x - 1].childNodes[y - 1];
}

// Game functions

function invalidMove() {
    wrongSound.play();
}

function validMove(xfinish, yfinish) {
    let nextCell = getTableCell(xfinish, yfinish);

    if (!picture) {
        currentCell.innerHTML = nextCell.innerHTML;
        nextCell.innerHTML = ' ';
    } else {
        let aux = nextCell.style.background;
        nextCell.style.background = currentCell.style.background;
        currentCell.style.background = aux;
    }

    xPos = xfinish;
    yPos = yfinish;
    currentCell = nextCell;
}

function finish() {

}

function win() {
    playing = false;
}

function moveCell(xfinish, yfinish) {
    if (!playing)
        return;

    if (xfinish < 1 || xfinish > currentSize || yfinish < 1 || yfinish > currentSize) {
        invalidMove();
        return;
    }
    validMove(xfinish, yfinish);
    if (finish()) {
        win();
    }
}

function switchContent() {
    playing = false;
    picture = !picture;
    if (picture)
        switchBu.innerHTML = "Switch to numbers";
    else
        switchBu.innerHTML = "Switch to photos";
    initTable();
    playing = true;
}

// Setting event handlers
resetBu.onclick = initTable;
switchBu.onclick = switchContent;
sizeSelect.onchange = () => {
    currentSize = sizeSelect.selectedOptions[0].innerHTML;
    initTable()
};

document.onkeydown = function (event) {
    let key = event.key;
    console.log("Key pressed");
    switch (key) {
        case "ArrowDown":
            moveCell(xPos - 1, yPos);
            break;
        case "ArrowUp":
            moveCell(xPos + 1, yPos);
            break;
        case "ArrowLeft":
            moveCell(xPos, yPos + 1);
            break;
        case "ArrowRight":
            moveCell(xPos, yPos - 1);
            break
    }

};


// Loading
initTable();
