const gameGrid = document.querySelector(".gameboard");
const registerDialog = document.querySelector(".player-registration");
const playersForm = document.querySelector(".playersForm");
const player1Name = document.querySelector("#player1");
const player2Name = document.querySelector("#player2");
const playerOne = document.querySelector(".player1");
const playerTwo = document.querySelector(".player2");
const page = document.querySelector("body");
const restartBtn = document.querySelector(".restart-btn");
const resultPara = document.querySelector(".result-para");

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

    const resetBoard = () => {
        for (let row of board) {
            for (let cellData of row) {
                cellData.setValue("");
            }
        }
    };

    return { getBoard, updateBoard, resetBoard }
}

function gameController() {

    const game = gameBoard();
    const board = game.getBoard();
    
    const players = [
        {
            name:"Player1",
            mark:"X",
            score: 0,
        },

        {
            name:"Player2",
            mark:"O",
            score: 0,
        }
    ];

    let activePlayer = players[0];
    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () => activePlayer = activePlayer===players[0]? players[1] : players[0];
    const resetActivePlayer = () => activePlayer = players[0];
    
    const setPlayerName = (playerName, player) => players[player].name = playerName;
    const getPlayerName = (player) => players[player].name;

    const getPlayerScore = (player) => players[player].score;
    const incrementPlayerScore = (player) => players[player].score++;

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

    const playRound = (row, column) => {

        const isChanged = game.updateBoard(row, column, getActivePlayer().mark)
        if(!isChanged) { return }
        if(checkWinner(getActivePlayer().mark)) { return "winner" }
        if(checkTie()) { return "tie" }

        switchActivePlayer();
    }

    return { playRound, getActivePlayer, resetActivePlayer, setPlayerName, getPlayerName, incrementPlayerScore, getPlayerScore, getBoard: game.getBoard, resetBoard: game.resetBoard }
}

const screenController = (() => {
    let xoGame;
    let xoBoard;
    let gameState = "";
   
    xoGame = gameController();
    xoBoard = xoGame.getBoard();

    updateScreen();

    const handleCellClick = (event) => {

        const cell = event.target.closest(".boardCell");
        if(!cell) return;
        const rowIndex = Number(cell.dataset.row);
        const columnIndex = Number(cell.dataset.column);
        gameState = xoGame.playRound(rowIndex, columnIndex);
        
        if(gameState==="winner") {
            resultPara.textContent = `${xoGame.getActivePlayer().name} won this round!`;
            restartBtn.classList.remove("hidden");
            if(xoGame.getActivePlayer().mark==="O") {
                xoGame.incrementPlayerScore(1);
            }
            else {
                xoGame.incrementPlayerScore(0);
            }
            gameGrid.removeEventListener("click", handleCellClick);
        }
        if(gameState==="tie") {
            resultPara.textContent = `It is a tie!`;
            restartBtn.classList.remove("hidden");
            gameGrid.removeEventListener("click", handleCellClick);
        }
        updateScreen();
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

    restartBtn.addEventListener("click", () => {
        resultPara.textContent = "";
        restartBtn.classList.add("hidden");
       
        xoGame.resetBoard();
        xoGame.resetActivePlayer();
        
        gameGrid.addEventListener("click", handleCellClick);
        updateScreen();
    })

    function updateScreen() {
        gameGrid.innerHTML = "";
        playerOne.textContent = `${xoGame.getPlayerName(0)}: ${xoGame.getPlayerScore(0)}`;
        playerTwo.textContent = `${xoGame.getPlayerName(1)}: ${xoGame.getPlayerScore(1)}`;

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
                boardCell.textContent = cell.getValue();
                boardCell.dataset.row = rowIndex;
                boardCell.dataset.column = columnIndex;
                gameGrid.appendChild(boardCell);
            })
        })
    }
})();


