const OFFSET_X = 0;
const OFFSET_Y = 0;

/**
 * 根据一个点在canvas上的像素坐标，计算出其所在格子的行和列
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
export function px2Index(x, y, gridSize = GRID_SIZE) {
    const offsetX = OFFSET_X;
    const offsetY = OFFSET_Y;

    const col = Math.floor((x - offsetX) / gridSize);
    const row = Math.floor((y - offsetY) / gridSize);

    return {col, row};
}

export function drawGrid(ctx, cols, rows, gridSize = GRID_SIZE, strokeStyle = '#000', offsetX = 0, offsetY = 0) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Draw vertical lines
    ctx.moveTo(offsetX - 0.5, offsetY);
    ctx.lineTo(offsetX - 0.5, rows * gridSize + offsetY);
    for (let i = 0; i < cols + 1; i++) {
        ctx.moveTo(i * gridSize - 0.5 + offsetX, offsetY);
        ctx.lineTo(i * gridSize - 0.5 + offsetX, rows * gridSize + offsetY);
    }
    ctx.stroke();
    
    // Draw horizontal lines
    ctx.moveTo(offsetX, offsetY - 0.5);
    ctx.lineTo(cols * gridSize + offsetX, offsetY - 0.5);
    for (let i = 0; i < rows + 1; i++) {
        ctx.moveTo(offsetX, i * gridSize - 0.5 + offsetY);
        ctx.lineTo(cols * gridSize + offsetX, i * gridSize - 0.5 + offsetY);
    }
    ctx.stroke();
}


export const canvas = document.getElementById('board');
export const ctx = canvas.getContext('2d');
export function initCanvas() {
    canvas.width = 450;
    canvas.height = 450;
}

export function draw(board) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, 3, 3, 150);

    ctx.font = "40px Arial";
    board.forEach((value, i) => {
        if (value) {
            ctx.fillStyle = value === 'X' ? 'red' : 'green';
            ctx.fillText(value, (i % 3 + 0.4)* 150, (Math.floor(i / 3) + 0.6)* 150,  )
        }
    })
}
