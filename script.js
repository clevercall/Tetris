const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const grid = 20;
const boardWidth = 10;
const boardHeight = 20;
let board = Array(boardHeight).fill().map(() => Array(boardWidth).fill(0));
let currentTetrimino = getRandomTetrimino();
let score = 0;

// Draw game board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
            if (board[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * grid, y * grid, grid, grid);
            }
        }
    }
}

// Draw current Tetrimino
function drawTetrimino() {
    ctx.fillStyle = currentTetrimino.color;
    for (let y = 0; y < currentTetrimino.shape.length; y++) {
        for (let x = 0; x < currentTetrimino.shape[y].length; x++) {
            if (currentTetrimino.shape[y][x] === 1) {
                ctx.fillRect((currentTetrimino.x + x) * grid, (currentTetrimino.y + y) * grid, grid, grid);
            }
        }
    }
}

// Get random Tetrimino
function getRandomTetrimino() {
    const tetriminos = [
        { shape: [[1, 1, 1, 1]], color: 'blue', x: 3, y: 0 }, // I
        { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange', x: 3, y: 0 }, // J
        { shape: [[0, 0, 1], [1, 1, 1]], color: 'green', x: 3, y: 0 }, // L
        { shape: [[1, 1], [1, 1]], color: 'yellow', x: 4, y: 0 }, // O
        { shape: [[0, 1, 1], [1, 1, 0]], color: 'red', x: 3, y: 0 }, // S
        { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple', x: 3, y: 0 }, // T
        { shape: [[1, 1, 0], [0, 1, 1]], color: 'pink', x: 3, y: 0 }, // Z
    ];
    return tetriminos[Math.floor(Math.random() * tetriminos.length)];
}

// Move Tetrimino
function moveTetrimino(dx, dy) {
    currentTetrimino.x += dx;
    currentTetrimino.y += dy;
    if (checkCollision()) {
        currentTetrimino.x -= dx;
        currentTetrimino.y -= dy;
        if (dy === 1) {
            placeTetrimino();
        }
    }
}

// Rotate Tetrimino
function rotateTetrimino() {
    const shape = currentTetrimino.shape;
    currentTetrimino.shape = shape[0].map((val, index) => shape.map(row => row[index]).reverse());
    if (checkCollision()) {
        currentTetrimino.shape = shape;
    }
}

// Check collision
function checkCollision() {
    for (let y = 0; y < currentTetrimino.shape.length; y++) {
        for (let x = 0; x < currentTetrimino.shape[y].length; x++) {
            if (currentTetrimino.shape[y][x] === 1) {
                const boardX = currentTetrimino.x + x;
                const boardY = currentTetrimino.y + y;
                if (boardX < 0 || boardX >= boardWidth || boardY >= boardHeight) {
                    return true;
                }
                if (boardY >= 0 && board[boardY][boardX] === 1) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Place Tetrimino
function placeTetrimino() {
    for (let y = 0; y < currentTetrimino.shape.length; y++) {
        for (let x = 0; x < currentTetrimino.shape[y].length; x++) {
            if (currentTetrimino.shape[y][x] === 1) {
                const boardX = currentTetrimino.x + x;
                const boardY = currentTetrimino.y + y;
                if (boardY >= 0) {
                    board[boardY][boardX] = 1;
                }
            }
        }
    }
    currentTetrimino = getRandomTetrimino();
    checkLines();
}

// Check lines
function checkLines() {
    for (let y = 0; y < boardHeight; y++) {
        let fullLine = true;
        for (let x = 0; x < boardWidth; x++) {
            if (board[y][x] === 0) {
                fullLine = false;
                break;
            }
        }
        if (fullLine) {
            board.splice(y, 1);
            board.unshift(Array(boardWidth).fill(0));
            score++;
        }
    }
}

// Main loop
setInterval(() => {
    moveTetrimino(0, 1);
    drawBoard();
    drawTetrimino();
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 10);
}, 500);

// Controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            moveTetrimino(-1, 0);
            break;
        case 'ArrowRight':
            moveTetrimino(1, 0);
            break;
        case 'ArrowDown':
            moveTetrimino(0, 1);
            break;
        case 'ArrowUp':
            rotateTetrimino();
            break;
    }
});
