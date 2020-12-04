const gameBoard = (() => {
  let board = [
    ["X", "", "X"],
    ["", "O", ""],
    ["O", "", "O"]
  ]

  const checkMarkerAtTile = (tile) => {
    console.log(tile.target.innerText)
  }

  const clearBoard = () => {
    for (let i = 0; i < 3; i++) {
      board[i] = ["","",""]
    }
  }

  const addToBoard = (marker, outerIdx, innerIdx) => {
    board[outerIdx][innerIdx] = marker
  }

  const init = () => {
    // add event listeners for each of the 9 tiles
    // fetches tiles by id, which is their position in the board array
    // board[0][0], board[0][1], etc..
    let ids = ["00", "01", "02", "10", "11", "12", "20", "21", "22"]
    ids.forEach(id => {
      let button = document.getElementById(`${id[0]}${id[1]}`)
      button.addEventListener('click', checkMarkerAtTile)
    })
  }

  return {
    init,
    board,
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
displayController.displayBoard(gameBoard.board)


const gameFlowController = (() => {

})()



const player = (name, marker, isAI) => {
  const getName = () => name
  const getMarker = () => marker

  return {
    getName,
    getMarker,
  }
}