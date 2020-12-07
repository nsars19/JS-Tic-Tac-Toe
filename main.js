const gameBoard = (() => {
  let board = [
    ["X", "", "X"],
    ["", "O", ""],
    ["O", "", "O"]
  ]

  const checkMarkerAtTile = (tile) => {
    console.log(tile.target.innerText)
  }

  const getBoard = () => { return board }

  const clearBoard = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = ["","",""]
    }
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

  return {
    displayBoard,
    swapButtonVisibility,
    hideElement,
    showElement,
  }
})()


const Player = (name, marker, isAI) => {
  const getName = () => name
  const getMarker = () => marker

  return {
    getName,
    getMarker,
  }
}