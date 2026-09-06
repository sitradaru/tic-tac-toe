function cell() {
    let value = "";

    const getValue = () => value; 
    const setValue = (playerMark) => value = playerMark;

    return { getValue, setValue }
}

function gameBoard() {
    const board = [];
    const row = 3;
    const column = 3;

    for(let i=0; i<row; i++) {
        board[i] = [];
        for(let j=0; j<column; j++) {
            board[i].push(cell())
        }
    }

    const getBoard = () => board;

    const updateBoard = (row, column, playerMark) => {
        const targetCell = board[row][column];
        
        if(targetCell.getValue()==="") {
            targetCell.setValue(playerMark);
        }
    }

    const printValues = () => {
        const cellValues = board.map(row => {
            return row.map(column => column.getValue())
        }
        )

        return cellValues;
    }

    return { getBoard, updateBoard, printValues }
}