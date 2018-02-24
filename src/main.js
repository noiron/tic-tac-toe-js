// import { GameState } from './minimax-new';
import { GameState } from './alphabeta';
import { canvas, ctx, initCanvas, draw, px2Index } from './draw';

export const X = 'X';
export const O = 'O';

let aiToken = O;
let gameState = new GameState(EmptyBoard, aiToken);

// const TestBoard = [null, X, null, null, null, X, O, O, X];
const EmptyBoard = _.fill(Array(9), null);

canvas.addEventListener('click', handleClick, false);
function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { col, row } = px2Index(x, y, 150);
    humanMove(row, col); 
}

function getIndex(row, col) {
    return row * 3 + col;
}

function humanMove(row, col) {
    const index = getIndex(row, col);
    // 不能在已下子的位置下子
    if (gameState.board[index]) return;
    // 游戏已结束
    if (gameState.winner) return;

    const board = _.clone(gameState.board);
    board[index] = aiToken === X ? O : X;
    gameState.board = _.clone(board);
    draw(gameState.board);
    checkWinner();

    // 一秒后 ai 开始操作
    setTimeout(aiMove, 1000);
}

function aiMove() {
    if (gameState.winner) return;    
    gameState.getScore();
    gameState.nextMove();
    draw(gameState.board);
    checkWinner();
}

function checkWinner() {
    const winner = gameState.checkFinish();
    if (winner) {
        console.log('游戏结束', winner);
        const winnerEle = document.getElementById('winner');
        winnerEle.innerHTML = winner === 'draw' ? 'Draw' : 'Winner is: ' + winner;
        gameState.winner = winner;
    }
}


function chooseToken(e) {
    const token = e.target.dataset.token;
    aiToken = token === X ? O : X;

    if (token === O) {
        gameState = new GameState(EmptyBoard, aiToken);
        displayChoice(token);
        setTimeout(aiMove, 0);
    }
}

function displayChoice(choice) {
    const showChoice = document.getElementById('show-choice');
    showChoice.innerHTML = 'Your choice: ' + choice;
}

export function getAiToken() {
    return aiToken;
}

function restartGame() {
    aiToken = O;
    displayChoice(aiToken === X ? O : X);
    gameState = new GameState(EmptyBoard, aiToken);
    draw(gameState.board);

    const winnerEle = document.getElementById('winner');
    winnerEle.innerHTML = '';
}

function initGame() {
    initCanvas();
    gameState = new GameState(EmptyBoard, aiToken, 0);
    draw(gameState.board);

    const chooseTokenO = document.getElementById('btn-choose-o');
    const chooseTokenX = document.getElementById('btn-choose-x');
    chooseTokenO.addEventListener('click', chooseToken);
    chooseTokenX.addEventListener('click', chooseToken);

    const restartEle = document.getElementById('restart-game');
    restartEle.addEventListener('click', restartGame);
}



initGame();
