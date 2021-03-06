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
  
  const returnWinningMark = () => {
    if (_horizontalWin()) {
      for (let i = 0; i < 3; i++) {
        let current = board[i].join("")
        if (_tripleMatch(current)) {
          return current[0];
        }
      }
    }
    
    if (_verticalWin()) {
      for (let i = 0; i < 3; i++) {
        let current = ""
        for (let j = 0; j < 3; j++) {
          current += board[j][i]
        }
        if (_tripleMatch(current)) {
          return current[0]
        }
      }
    }
    
    if (_diagonalWin()) {
      firstDiagonal = board[0][0] + board[1][1] + board[2][2]
    secondDiagonal = board[0][2] + board[1][1] + board[2][0]

    if (_tripleMatch(firstDiagonal)) {
      return firstDiagonal[0]
    } else if (_tripleMatch(secondDiagonal)) {
      return secondDiagonal[0]
    }
    }
  }

  return {
    getBoard,
    clearBoard,
    addToBoard,
    boardFull,
    isWin,
    tileAlreadyTaken,
    returnWinningMark,
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
  let winner = document.createElement("h3")
  let boardWrapper = document.querySelector(".board-wrapper")
  let header = document.querySelector("header")
  let restart = document.querySelector(".restart")

  const gameOver = (winnerName) => {
    overlay.innerText = "GAME OVER"
    overlay.classList.add("overlay")
    overlay.style.display = "grid"
    winner.innerText = `${winnerName} WINS`
    overlay.appendChild(winner)
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


const pcPlayer = () => {
  const _randomNum = () => Math.floor(Math.random() * 3)
  
  const chooseTile = (board, idx = [_randomNum(), _randomNum()]) => {
    while (board[idx[0]][idx[1]] !== "") {
      idx = [_randomNum(), _randomNum()]
    }

    board.forEach((row, outerIdx) => {
      if (row.join("") == "XX") {
        for (let i = 0; i < 3; i++) {
          if (board[outerIdx][i] == "") {
            idx = [outerIdx, i]
          }
        }
      }
    })
    return idx
  }  

  return {
    chooseTile,
  }
}

const Player = (name, marker, isAI = false) => {
  const getName = () => name
  const getMarker = () => marker
  const isCPU = () => isAI
  if (isAI) {
    const prototype = pcPlayer()
    return Object.assign({}, prototype, {getName, getMarker, isCPU})
  } 

  return {
    getName,
    getMarker,
    isCPU
  }
}


const gameFlowController = (() => {
  let board = gameBoard.getBoard()
  let opponentChoice;
  const player1 = Player("Player 1", "X", false)
  let player2;
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
      _play(opponentChoice)
    })
  }

  const _gameOver = () => {
    return gameBoard.isWin() || gameBoard.boardFull()
  }

  const _getWinner = () => {
    let winningMark = gameBoard.returnWinningMark()
    return winningMark === "X" ? player1.getName() : player2.getName()
  }

  const _initializeTurn = (tile) => {
    choice = tile.target.id.split("")
    // disallow placing pieces if game is not in play, or the tile already has a piece on it
    if (gameBoard.tileAlreadyTaken(choice) || !gameInPlay) { return }
    // otherwise add the piece to the tile & display the new board state
    gameBoard.addToBoard(currentPlayer.getMarker(), choice[0], choice[1])
    displayController.displayBoard(board)
    // check for game over condition & return out of function to prevent any more pieces from being added
    if (_gameOver()) {
      return gameBoard.isWin() ? displayController.gameOver(_getWinner()) : displayController.gameOver("NO ONE")
    }
    // change current player from player1 to player2 to switch markers
    currentPlayer = _nextPlayer()
    // if player2 is a human the function ends here. Upon clicking a tile this function will run again with player 2's marker
    // if player2 is the PC, then player2 selects a piece at random, that piece is displayed on the board, and win conditions are checked
    if(currentPlayer.isCPU()) {
      _computerTurn()
      currentPlayer = _nextPlayer()

      if (_gameOver()) {
        return gameBoard.isWin() ? displayController.gameOver(_getWinner()) : displayController.gameOver("NO ONE")
      }
    }
  }
  
  const _computerTurn = () => {
    choice = currentPlayer.chooseTile(gameBoard.getBoard())
    gameBoard.addToBoard(currentPlayer.getMarker(), choice[0], choice[1])
    // add some delay to make it seem like you're playing against a person
    setTimeout(() => {
      displayController.displayBoard(board)
    }, Math.floor(Math.random() * 500) + 500)
  }

  const _nextPlayer = () => {
    return currentPlayer = currentPlayer === player1 ? player2 : player1
  }

  const _play = (opponentChoice) => {
    player2 = opponentChoice == 1 ? Player("Player2", "O") : Player("Player 2", "O", true)
    
    displayController.swapButtonVisibility(opponentButtons, [restartButton]);
    displayController.hideElement(startButton);
    gameInPlay = true
    currentPlayer = player1

    // add event listeners for each of the 9 tiles
    // fetches tiles by id, which is their position in the board array
    // board[0][0], board[0][1], etc..
    let ids = ["00", "01", "02", "10", "11", "12", "20", "21", "22"]
    ids.forEach(id => {
      let button = document.getElementById(`${id[0]}${id[1]}`)
      button.addEventListener('click', _initializeTurn)
    })
  }

  return {
    initializeGame,
  }
})()

gameFlowController.initializeGame()
