const gameBoard = (() => {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ]

  const getBoard = () => { return board }

  const clearBoard = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = ["","",""]
    }
  }

  const tileAlreadyTaken = tileIdx => {
    return board[tileIdx[0]][tileIdx[1]] === "" ? false : true
  }

  const addToBoard = (marker, outerIdx, innerIdx) => {
    board[outerIdx][innerIdx] = marker
  }

  const boardFull = () => {
    return !board.flat().some(tile => tile === "")
  }

  const _tripleMatch = line => { return (line == "XXX" || line == "OOO") ? true : false }

  const _horizontalWin = () => {
    for (let i = 0; i < 3; i++) {
      let current = board[i].join("")
      if (_tripleMatch(current)) {
        return true;
      }
    }
    return false
  }

  const _verticalWin = () => {
    for (let i = 0; i < 3; i++) {
      let current = ""
      for (let j = 0; j < 3; j++) {
        current += board[j][i]
      }
      if (_tripleMatch(current)) {
        return true
      }
    }
    return false
  }

  const _diagonalWin = () => {
    firstDiagonal = board[0][0] + board[1][1] + board[2][2]
    secondDiagonal = board[0][2] + board[1][1] + board[2][0]

    return _tripleMatch(firstDiagonal) ? true : _tripleMatch(secondDiagonal) ? true : false
  }

  const isWin = () => {
    return (_horizontalWin() || _verticalWin() || _diagonalWin()) ? true : false
  }
  
  return {
    getBoard,
    clearBoard,
    addToBoard,
    boardFull,
    isWin,
    tileAlreadyTaken,
  }
})()



const displayController = (() => {
  const displayBoard = board => {
    const ids = ["00", "01", "02", "10", "11", "12", "20", "21", "22"]
    ids.forEach(id => {
      const gameTile = document.getElementById(id)
      gameTile.innerText = board[id[0]][id[1]]
    })
  }

  const swapButtonVisibility = (main, opponent) => {
    main.forEach(button => { button.classList.add("d-none") })
    opponent.forEach(button => { button.classList.remove("d-none") })
  }

  const hideElement = element => element.classList.add("d-none")
  const showElement = element => element.classList.remove("d-none")


  let body = document.querySelector("body")
  let overlay = document.createElement("div")
  let boardWrapper = document.querySelector(".board-wrapper")
  let header = document.querySelector("header")
  let restart = document.querySelector(".restart")

  const gameOver = () => {
    overlay.innerText = "GAME OVER"
    overlay.classList.add("overlay")
    overlay.style.display = "grid"
    body.style.position = "relative"
    body.appendChild(overlay)
    boardWrapper.style.filter = "blur(10px)"
    header.style.filter = "blur(10px)"
    restart.style.zIndex = "99999"
  }

  const hideGameOver = () => {
    body.style.filter = "none"
    header.style.filter = "none"
    boardWrapper.style.filter = "none"
    overlay.style.display = "none"
  }

  return {
    displayBoard,
    swapButtonVisibility,
    hideElement,
    showElement,
    gameOver,
    hideGameOver,
  }
})()


const Player = (name, marker, isAI = false) => {
  const getName = () => name
  const getMarker = () => marker

  return {
    getName,
    getMarker,
  }
}


const gameFlowController = (() => {
  let board = gameBoard.getBoard()
  let opponentChoice;
  const player1 = Player("Player 1", "X", false)
  const player2 = Player("Player 2", "O", false);
  let currentPlayer = player1;
  let gameInPlay = false
  const mainButtons = document.querySelectorAll(".main")
  const opponentButtons = document.querySelectorAll(".vs")
  const startButton = document.querySelector(".start-game")
  const restartButton = document.querySelector(".restart")
  
  const initializeGame = () => {
    // adds event listeners for start & restart buttons, and then opponent selection
    // buttons. Upon opponent selection the play function is called, and passed
    // the opponent selection variable. This variable determines whether the 
    // second player is a huma or the CPU
    startButton.addEventListener(
      'click', 
      displayController.swapButtonVisibility.bind(this, mainButtons, opponentButtons)
    )
  
    restartButton.addEventListener('click', () => {
      gameInPlay = false
      gameBoard.clearBoard()
      displayController.displayBoard(board)
      displayController.swapButtonVisibility([restartButton], [startButton])
      displayController.hideGameOver()
    })
    
    const vsPlayer = document.querySelector(".vs-player")
    const vsCPU = document.querySelector(".vs-cpu")
    _addOpponentListeners(vsPlayer)
    _addOpponentListeners(vsCPU)
  }

  const _addOpponentListeners = (button) => {
    button.addEventListener('click', () => {
      opponentChoice = button.getAttribute("value")
      play(opponentChoice)
    })
  }

  const initializeTurn = () => {
    // add event listeners for each of the 9 tiles
    // fetches tiles by id, which is their position in the board array
    // board[0][0], board[0][1], etc..
    let ids = ["00", "01", "02", "10", "11", "12", "20", "21", "22"]
    ids.forEach(id => {
      let button = document.getElementById(`${id[0]}${id[1]}`)
      button.addEventListener('click', tile => {
        current = tile.target.id.split("")
        if (!gameBoard.tileAlreadyTaken(current) && gameInPlay) {
          gameBoard.addToBoard(currentPlayer.getMarker(), current[0], current[1])
          currentPlayer = nextPlayer()
        }  
        displayController.displayBoard(board)

        if (gameBoard.isWin() || gameBoard.boardFull()) {
          
        }
      })
    })
  }
  
  const nextPlayer = () => {
    return currentPlayer = currentPlayer === player1 ? player2 : player1
  }

  const play = (opponentChoice) => {
    // if (opponentChoice == 1) {
    //   player2 = Player("Player2", "O")
    // } else if (opponentChoice == 0) {
    //   player2 = Player("Player 2", "O", true)
    // }

    displayController.swapButtonVisibility(opponentButtons, [restartButton]);
    displayController.hideElement(startButton);
    gameInPlay = true
    currentPlayer = player1
    initializeTurn(currentPlayer);
  }

  return {
    initializeGame,
  }
})()

gameFlowController.initializeGame()
