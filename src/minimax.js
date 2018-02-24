import { getAiToken, X, O } from './main';

let counter = 0;
let maxDepth = 0;
const LimitedDepth = 100; // 对搜索深度的限制

export class GameState {
    constructor(board, player, depth) {
        this.board = _.clone(board) || _.fill(Array(9), null);
        this.playerTurn = player;   // 当前轮到谁下子
        this.minimax = -100;

        this.choosenState = null;
        this.winner = false;
        this.depth = depth || 0;
    }

    /** 
     * 找出当前仍可以下子的位置
    */
    getAvailablePos() {
        const result = [];
        this.board.forEach((ele, index) => {
            if(!ele) {
                result.push(index);
            }
        });
        return result;
    }

    /**
     * 检查游戏是否结束
     * 游戏结束会有三种可能的返回结果 X, O, draw
     * 游戏未结束返回 false
     */
    checkFinish() {
        const board = this.board;

        // 检查三行
        for (let i = 0; i < 9; i += 3) {
            if (board[i] && board[i] === board[i+1] && board[i] === board[i+2]) {
                return board[i];
            }
        }

        // 检查三列
        for (let i = 0; i < 3; i++) {
            if (board[i] && board[i] === board[i+3] && board[i] === board[i+6]) {
                return board[i];
            }
        }

        // 检查对角线
        if (board[0] && board[0] === board[4] && board[0] === board[8]) return board[0];
        if (board[2] && board[2] === board[4] && board[2] === board[6]) return board[2];

        // 如果无可下子位置则为平局，否则游戏未结束
        if (_.compact(board).length === 9) return 'draw';        
        else return false;
    }

    /**
     * 根据可能的位置，生成新的游戏状态
     */
    generateNextStates() {
        const availablePos = this.getAvailablePos();
        const nextStates = [];

        availablePos.forEach(pos => {
            const board = _.clone(this.board);
            board[pos] = this.playerTurn;
            const nextTurn = changeTurn(this.playerTurn);
            nextStates.push(new GameState(board, nextTurn, this.depth + 1));
        });
        return nextStates;
    }

    /** 
     * 
    */
    getMinimax() {
        const aiToken = getAiToken();

        // console.log(counter++, this.depth);

        const winner = this.checkFinish();
        if (winner) {
            if (winner === 'draw') return 0;
            if (winner === aiToken) return 10;
            return -10;
        }

        // 限制搜索深度
        // TODO: 现在超过搜索深度时，均返回分数0
        if (this.depth >= LimitedDepth) {
            return 0;
        }

        // 游戏尚未结束，根据下一状态来选择
        const nextStates = this.generateNextStates();
        const nextMinimax = [];
        nextStates.forEach(state => {
            nextMinimax.push(state.getMinimax());
        });

        let rank;

        if (this.playerTurn === aiToken) {
            // 轮到自己，选取最大值
            rank = Math.max(...nextMinimax);
        } else {
            rank = Math.min(...nextMinimax);
        }

        // rank 值可能有相同的多个，从中随机选取一个
        const possibleStateIndex = [];
        for (let i = 0; i < nextMinimax.length; i++) {
            if (nextMinimax[i] === rank) possibleStateIndex.push(i);
        }
        const index = _.sample(possibleStateIndex);
        const choosenState = nextStates[index];
        this.choosenState = choosenState;
        return choosenState.getMinimax();
    }

    nextMove() {
        this.board = _.clone(this.choosenState.board);
    }
}

function changeTurn(player) {
    return player === X ? O : X;
} 
