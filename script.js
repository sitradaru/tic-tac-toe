const gameGrid = document.querySelector(".gameboard");

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
            return true;
        }

        return false;
    }

    const printValues = () => {
        const cellValues = board.map(row => 
             row.map(column => column.getValue())
        )

        console.log(cellValues);
    }

    return { getBoard, updateBoard, printValues }
}

function gameController() {

    const game = gameBoard();
    const board = game.getBoard();
    
    const players = [
        {
            name:"player1",
            mark:"X"
        },

        {
            name:"player2",
            mark:"O"
        }
    ];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => {
        activePlayer = activePlayer===players[0]? players[1] : players[0];
    }

    const checkWinner = (playerMark) => {

        const winningCondition = [
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]]
        ]

        return winningCondition.some(combination => 
            combination.every(element => element.getValue()===playerMark)
        )
    }

    const checkTie = () => {
        return board.every(row => 
            row.every(cell => cell.getValue())
        )
    }

    const printNewRound = () => {
        game.printValues();
        console.log(`It is ${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        const isChanged = game.updateBoard(row, column, getActivePlayer().mark)
        if(!isChanged) { return }

        if(checkWinner(getActivePlayer().mark)) { 
            console.log(`${getActivePlayer().name} won this round`);
            printNewRound();
            return "winner";
         }
        if(checkTie()) { 
            console.log(`It is a tie.`);
            printNewRound();
            return "tie";
        }

        switchActivePlayer();
        printNewRound();
    }

    printNewRound();

    return { playRound, getActivePlayer, getBoard: game.getBoard }
}

const screenController = (() => {
    const xoGame = gameController();
    const xoBoard = xoGame.getBoard();
    
    const updateScreen = () => {
        gameGrid.innerHTML = "";
        xoBoard.forEach((cells, rowIndex) => {
        cells.forEach((cell, columnIndex) => {
            const boardCell = document.createElement("button");
            boardCell.classList.add("boardCell");
            boardCell.textContent = cell.getValue();
            boardCell.dataset.row = rowIndex;
            boardCell.dataset.column = columnIndex;
            gameGrid.appendChild(boardCell);
        })
    })
    }

    let gameState = "";
    gameGrid.addEventListener("click", (event) => {
        if(gameState==="winner") {
            return;
        }
        if(gameState==="tie") {
            return;
        }
        const cell = event.target.closest(".boardCell");
        if(!cell) return;
        const rowIndex = Number(cell.dataset.row);
        const columnIndex = Number(cell.dataset.column);
        gameState = xoGame.playRound(rowIndex, columnIndex);
        updateScreen();
    })

    updateScreen();
})();

