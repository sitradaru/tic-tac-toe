const gameGrid = document.querySelector(".gameboard");
const registerDialog = document.querySelector(".player-registration");
const playersForm = document.querySelector(".playersForm");
const player1Name = document.querySelector("#player1");
const player2Name = document.querySelector("#player2");
const playerOne = document.querySelector(".player1");
const playerTwo = document.querySelector(".player2");
const page = document.querySelector("body");
const resultsDiv = document.querySelector(".result");
const restartBtn = document.querySelector(".restart-btn");

registerDialog.showModal();

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
            name:"Player1",
            mark:"X"
        },

        {
            name:"Player2",
            mark:"O"
        }
    ];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => {
        activePlayer = activePlayer===players[0]? players[1] : players[0];
    }
    const setPlayerName = (playerName, player) => {
        players[player].name = playerName;
        console.log(players);
    }

    const getPlayerName = (player) => players[player].name;

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

    return { playRound, getActivePlayer, setPlayerName, getPlayerName, getBoard: game.getBoard }
}

const screenController = (() => {
    const xoGame = gameController();
    const xoBoard = xoGame.getBoard();
    const resultPara = document.createElement("p");
    

    const updateScreen = () => {
        gameGrid.innerHTML = "";
        playerOne.textContent = xoGame.getPlayerName(0);
        playerTwo.textContent = xoGame.getPlayerName(1);
    
        if(xoGame.getActivePlayer().mark==="O") { 
            playerTwo.classList.add("active-player-two");
            playerOne.classList.remove("active-player-one");
            page.classList.add("blue-bg");
        } 
        else {
            playerTwo.classList.remove("active-player-two");
            playerOne.classList.add("active-player-one");
            page.classList.remove("blue-bg");
        }

        xoBoard.forEach((cells, rowIndex) => {
        cells.forEach((cell, columnIndex) => {
            const boardCell = document.createElement("button");
            boardCell.classList.add("boardCell");
            // xoGame.getActivePlayer().mark==="O"?  boardCell.classList.add("blue-bg"): boardCell.classList.remove("blue-bg");
            boardCell.textContent = cell.getValue();
            boardCell.dataset.row = rowIndex;
            boardCell.dataset.column = columnIndex;
            gameGrid.appendChild(boardCell);
        })
    })
    }

    let gameState = "";
    const handleCellClick = (event) => {

        const cell = event.target.closest(".boardCell");
        if(!cell) return;
        const rowIndex = Number(cell.dataset.row);
        const columnIndex = Number(cell.dataset.column);
        gameState = xoGame.playRound(rowIndex, columnIndex);
        updateScreen();
        
        if(gameState==="winner") {
            resultPara.textContent = `${xoGame.getActivePlayer().name} won this round!`;
            resultsDiv.appendChild(resultPara);
            restartBtn.classList.add("replay");
            gameGrid.removeEventListener("click", handleCellClick);
        }
        if(gameState==="tie") {
            resultPara.textContent = `It is a tie!`;
            resultsDiv.appendChild(resultPara);
            restartBtn.classList.add("replay");
            gameGrid.removeEventListener("click", handleCellClick);
        }
    }
    gameGrid.addEventListener("click", handleCellClick);

    playersForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const pOneName = player1Name.value;
        const pTwoName = player2Name.value;
        xoGame.setPlayerName(pOneName, 0);
        xoGame.setPlayerName(pTwoName, 1);
        registerDialog.close();
        updateScreen();
    })
    updateScreen();
})();

