var numSelected = null;
var tileSelected = null;
var errors = 0;
var maxErrors = 10; // default medium
var board = [];
var solution = [];

function newGame() {
    errors = 0;
    document.getElementById("errors").innerText = errors;
    document.getElementById("board").innerHTML = "";
    document.getElementById("digits").innerHTML = "";

    // Set difficulty
    const difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") {
        maxErrors = 15;
        removeCount = 35;
    } else if (difficulty === "medium") {
        maxErrors = 10;
        removeCount = 45;
    } else if (difficulty === "hard") {
        maxErrors = 5;
        removeCount = 55;
    }

    generateFullBoard();
    removeCells(removeCount);
    setGame();
}

window.onload = newGame;

function setGame() {
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            if (board[r][c] !== 0) {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r === 2 || r === 5) tile.classList.add("horizontal-line");
            if (c === 2 || c === 5) tile.classList.add("vertical-line");
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber() {
    if (numSelected) numSelected.classList.remove("number-selected");
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (!numSelected || this.innerText !== "") return;
    let [r, c] = this.id.split("-").map(Number);
    if (solution[r][c] == numSelected.id) {
        this.innerText = numSelected.id;
    } else {
        errors += 1;
        document.getElementById("errors").innerText = errors;
        if (errors >= maxErrors) {
            alert(`Game Over! You exceeded the max errors (${maxErrors})`);
            disableBoard();
        }
    }
}

function disableBoard() {
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach(tile => tile.removeEventListener("click", selectTile));
}

function generateFullBoard() {
    solution = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(solution);
    board = solution.map(row => [...row]);
}

function fillBoard(board) {
    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) return false;
            let boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            let boxCol = 3 * Math.floor(col / 3) + (i % 3);
            if (board[boxRow][boxCol] === num) return false;
        }
        return true;
    }

    function solve(pos = 0) {
        if (pos >= 81) return true;
        let row = Math.floor(pos / 9);
        let col = pos % 9;

        if (board[row][col] !== 0) return solve(pos + 1);

        let nums = shuffle([...Array(9).keys()].map(x => x + 1));
        for (let num of nums) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve(pos + 1)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    solve();
}

function removeCells(count) {
    let removed = 0;
    while (removed < count) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        if (board[r][c] !== 0) {
            board[r][c] = 0;
            removed++;
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
