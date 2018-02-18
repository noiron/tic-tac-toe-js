import { GameState, X, O } from './ai';
import { canvas, ctx, initCanvas, draw, px2Index } from './draw';

// const TestBoard = [O, X, O, O, X, X, null, null, null];
const TestBoard = _.fill(Array(9), null);

const gameState = new GameState(TestBoard, X);

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
    board[index] = O;
    gameState.board = _.clone(board);
    draw(gameState.board);
    checkWinner();

    // 一秒后 ai 开始操作
    setTimeout(aiMove, 1000);
}

function aiMove() {
    if (gameState.winner) return;    
    gameState.getMinimax();
    gameState.nextMove();
    draw(gameState.board);
    checkWinner();
}

function checkWinner() {
    const winner = gameState.checkFinish();
    if (winner) {
        console.log('游戏结束', winner);
        gameState.winner = winner;
    }
}

initCanvas();
draw(gameState.board);
aiMove();
