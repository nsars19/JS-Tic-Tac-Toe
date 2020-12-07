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

  return {
    getBoard,
    clearBoard,
    addToBoard,
    checkMarkerAtTile,
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

  return {
    displayBoard,
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