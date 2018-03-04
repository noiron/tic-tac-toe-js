import { getAiToken, X, O } from './main';

let counter = 0;

export class GameState {
    constructor(board, player, depth, alpha, beta) {
        this.board = board;
        this.playerTurn = player;
        this.depth = depth;

        this.choosenState = null;
        this.winner = false;

        this.alpha = alpha || -Infinity;
        this.beta = beta || Infinity;

        this.counter = 0;
    }

    getScore() {
        const aiToken = getAiToken();

        // if (counter++ % 100 === 0) {
        //     console.log(counter - 1);
        // }

        const winner = this.checkFinish();
        if (winner) {
            if (winner === 'draw') return 0;
            if (winner === aiToken) return 10;
            return -10;
        }

        // 到达了最大深度后的相应处理，这里未限制深度
        if (this.depth >= 100) {
            return 0;
        }

        // 获得所有可能的位置，利用 shuffle 加入随机性
        const availablePos = _.shuffle(this.getAvailablePos());

        // 对于 max 节点，返回的是子节点中的最大值
        if (this.playerTurn === aiToken) {
            let maxScore = -1000;
            let maxIndex = 0;

            for (let i = 0; i < availablePos.length; i++) {
                const pos = availablePos[i];
                const newBoard = this.generateNewBoard(pos, this.playerTurn);

                const childState = new GameState(newBoard, changeTurn(this.playerTurn), this.depth + 1, this.alpha, this.beta);
                const childScore = childState.getScore();

                if (childScore > maxScore) {
                    maxScore = childScore;
                    maxIndex = i;
                    this.choosenState = childState;
                    this.alpha = maxScore;
                }

                if (this.alpha >= this.beta) {
                    break;
                }
            }

            return maxScore;
        } else {
            // 对于 min 节点，返回的是子节点中的最小值
            let minScore = 1000;
            let minIndex = 0;

            for (let i = 0; i < availablePos.length; i++) {
                const pos = availablePos[i];
                const newBoard = this.generateNewBoard(pos, this.playerTurn);

                const childState = new GameState(newBoard, changeTurn(this.playerTurn), this.depth + 1, this.alpha, this.beta);
                const childScore = childState.getScore();

                if (childScore < minScore) {
                    minScore = childScore;
                    minIndex = i;
                    this.choosenState = childState;
                    this.beta = minScore;
                }

                if (this.alpha >= this.beta) {
                    break;
                }
            }
            return minScore;
        }
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
            if (board[i] && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                return board[i];
            }
        }

        // 检查三列
        for (let i = 0; i < 3; i++) {
            if (board[i] && board[i] === board[i + 3] && board[i] === board[i + 6]) {
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
     * 找出当前仍可以下子的位置
     */
    getAvailablePos() {
        const result = [];
        this.board.forEach((ele, index) => {
            if (!ele) {
                result.push(index);
            }
        });
        return result;
    }

    /**
     * 给出一个位置，返回一个新的 board
     */
    generateNewBoard(pos, player) {
        const newBoard = _.clone(this.board);
        newBoard[pos] = player;
        return newBoard;
    }

    nextMove() {
        this.board = _.clone(this.choosenState.board);
    }
}

function changeTurn(player) {
    return player === X ? O : X;
} 
