let nrSelect = document.getElementById("nr_select");
let resetBu = document.getElementById("reset_bu");
let startBu = document.getElementById("start_bu");
let switchBu = document.getElementById("switch_button");
let gameTable = document.getElementById("game_table");
let defaultNumber = 4;
let nrImages = 38;
let pictureOn = false;
let nodes = [];
let mySound = new Audio("sound/yes.wav");
let winningSound = new Audio("sound/tada.mp3");
let noSound = new Audio("sound/no.mp3");

let gameStats = {
    'inPlay': false,
    'remaining': (defaultNumber ** 2) / 2,
    'priveous': null
};

// Initialize UI
startBu.onclick = start;
resetBu.onclick = initTable;
switchBu.onclick = switchContent;

//Initialize select
for (let i = 2; i <= 8; i += 2) {
    let nrNode = document.createElement("option");

    if (i === defaultNumber)
        nrNode.selected = "selected";

    nrNode.innerHTML = i.toString();
    nrSelect.appendChild(nrNode)
}

nrSelect.onchange = () => {
    defaultNumber = nrSelect.selectedOptions[0].innerHTML;
    initTable();
};

//Initialize table
function initTable() {
    gameStats.inPlay = false;
    gameStats.priveous = null;
    gameStats.remaining = (defaultNumber ** 2) / 2;

    while (gameTable.firstChild)
        gameTable.removeChild(gameTable.firstChild);

    let tableValues = [];
    if (!pictureOn)
        for (let i = 0; i < gameStats.remaining; i++) {
            tableValues.push({
                'myvalue': i,
                'equality': i
            });
            tableValues.push({
                'myvalue': i,
                'equality': i
            });
        }
    else {
        let selection = [];
        for (let i = 0; i < nrImages; i++)
            selection.push(i);

        for (let j = 0; j < gameStats.remaining; j++) {
            let pos = Math.floor(Math.random() * selection.length);
            let i = selection[pos];
            selection.splice(pos, 1);

            tableValues.push({
                'myvalue': '<img alt="teacher" src="images/p' + (i+1).toString() + '.jpg" width="100px" height="120px">',
                'equality': i
            });
            tableValues.push({
                'myvalue': '<img alt="teacher" src="images/p' + (i+1).toString() + '.jpg" width="100px" height="120px">',
                'equality': i
            });
        }
    }

    nodes.length = 0;
    for (let i = 0; i < defaultNumber; i++) {
        let tableRow = document.createElement("tr");
        for (let j = 0; j < defaultNumber; j++) {
            let pos = Math.floor(Math.random() * tableValues.length); //Rand element selected

            let innerContent = document.createElement("div"); //Inner element in table
            innerContent.style.display = "inline";
            innerContent.innerHTML = tableValues[pos].myvalue;
            innerContent.equalityValue = tableValues[pos].equality;
            tableValues.splice(pos, 1);
            nodes.push(innerContent);

            let tableElement = document.createElement("td"); //Table cell
            tableElement.appendChild(innerContent);
            tableElement.onclick = () => {
                clicker(innerContent);
            };

            tableRow.appendChild(tableElement);
        }
        gameTable.appendChild(tableRow);
    }
    startBu.disabled = false;
}

initTable();

//Event handlers clicking

function clicker(cell) {
    if (!gameStats.inPlay || cell.style.visibility !== "hidden")
        return;

    cell.style.visibility = "visible";
    if (gameStats.priveous === null)
        gameStats.priveous = cell;
    else {
        gameStats.inPlay = false;
        if (gameStats.priveous.equalityValue === cell.equalityValue) {
            gameStats.remaining --;
            gameStats.priveous = null;
            gameStats.inPlay = true;
            if (gameStats.remaining > 0)
                mySound.play();
            if (gameStats.remaining === 0) {
                winningSound.play();
                alert("You won!");
            }
            return;
        }
        noSound.play();
        setTimeout(() => {
                gameStats.priveous.style.visibility = "hidden";
                cell.style.visibility = "hidden";
                gameStats.priveous = null;
                gameStats.inPlay = true;
            }
            , 500);
    }
}

//Switching content
function switchContent() {
    pictureOn = !pictureOn;
    initTable();
}

//Hide everything at a click
function start() {
    startBu.disabled = true;
    for (let i = 0; i < nodes.length; i++)
        nodes[i].style.visibility = "hidden";


    gameStats.inPlay = true;
}