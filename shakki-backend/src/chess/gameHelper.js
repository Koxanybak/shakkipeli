const King = require("./pieces/king")
const Queen = require("./pieces/queen")
const Rook = require("./pieces/rook")
const Knight = require("./pieces/knight")
const Bishop = require("./pieces/bishop")
const Pawn = require("./pieces/pawn")

const { UserInputError } = require("apollo-server")

const initializeBoard = () => {
  const board = Array.from(Array(8), () => {
    const row = new Array(8)

    for (let j = 0; j < 8; j++) {
      row[j] = null
    }

    return row
  })

  board[1] = board[1].map((piece, j) => {
    return new Pawn("black", { row: 1, column: j })
  })

  board[6] = board[6].map((piece, j) => {
    return new Pawn("white", { row: 6, column: j })
  })


  board[0][0] = new Rook("black", { row: 0, column: 0 })
  board[0][1] = new Knight("black", { row: 0, column: 1 })
  board[0][2] = new Bishop("black", { row: 0, column: 2 })
  board[0][3] = new Queen("black", { row: 0, column: 3 })
  board[0][4] = new King("black", { row: 0, column: 4 })
  board[0][5] = new Bishop("black", { row: 0, column: 5 })
  board[0][6] = new Knight("black", { row: 0, column: 6 })
  board[0][7] = new Rook("black", { row: 0, column: 7 })

  board[7][0] = new Rook("white", { row: 7, column: 0 })
  board[7][1] = new Knight("white", { row: 7, column: 1 })
  board[7][2] = new Bishop("white", { row: 7, column: 2 })
  board[7][3] = new Queen("white", { row: 7, column: 3 })
  board[7][4] = new King("white", { row: 7, column: 4 })
  board[7][5] = new Bishop("white", { row: 7, column: 5 })
  board[7][6] = new Knight("white", { row: 7, column: 6 })
  board[7][7] = new Rook("white", { row: 7, column: 7 })

  return board
}

const findGame = (id, games) => {
  const game = games.find(g => g.id === id)
  if (!game) {
    throw new UserInputError("Game not found, probably malformatted id or the server has been restarted.")
  }

  return game
}

module.exports = { initializeBoard, findGame }