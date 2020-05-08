const gameHelper = require("./gameHelper")
const { UserInputError } = require("apollo-server")

const King = require("./pieces/king")
const Queen = require("./pieces/queen")
const Rook = require("./pieces/rook")
const Knight = require("./pieces/knight")
const Bishop = require("./pieces/bishop")
const Pawn = require("./pieces/pawn")


// class that represents a single chess game

class Game {
  constructor(id, whitePlayer, blackPlayer) {
    this.whitePlayer = whitePlayer
    this.blackPlayer = blackPlayer
    this.board = gameHelper.initializeBoard()
    this.lastMove = null
    this.currentPlayer = this.whitePlayer
    this.id = id
  }



  // tries to make a move
  makeMove(
    pieceMoved,
    { row: oldRow, column: oldColumn },
    { row: newRow, column: newColumn },
    player,
  ) {

    // the wrong player tries to move
    if (this.currentPlayer.id !== player.id) {
      return
    }
    
    // the frontend is out of sync
    if ((!this.board[oldRow][oldColumn])
      || (this.board[oldRow][oldColumn].getType() !== pieceMoved.type)
      || (this.board[oldRow][oldColumn].getSide() !== pieceMoved.side)
    ) {
      throw new UserInputError("No such piece in that location")
    }

    // the piece wasn't moved
    if ((oldRow === newRow) && (oldColumn === newColumn)) {
      this.lastMove = {
        success: false,
        message: "Piece was not moved.",
      }
      return
    }

    // moves the piece
    if (this.board[oldRow][oldColumn].move(this.board, newRow, newColumn)) {
      this.lastMove = {
        success: true,
      }
      this.currentPlayer = this.currentPlayer === this.whitePlayer
        ? this.blackPlayer
        : this.whitePlayer
      return
    }

    // move was against the rules
    this.lastMove = {
      success: false,
      message: "Ootko paska ku yritit tehdä väärän siirron?",
    }
  }



  addPlayer(player) {
    this.blackPlayer = player
  }

  isFull() {
    return this.blackPlayer && this.whitePlayer
  }



  // makes a chess class out of the given pieceObject
  static makePiece(piece) {
    switch(piece.type) {
    case "pawn":
      return new Pawn(piece.side)
    case "rook":
      return new Rook(piece.side)
    case "knight":
      return new Knight(piece.side)
    case "bishop":
      return new Bishop(piece.side)
    case "queen":
      return new Queen(piece.side)
    case "king":
      return new King(piece.side)
    default:
      return null
    }
  }

  // gets the board for the frontend to use
  getBoard() {
    const returnedBoard = this.board.map(row => {
      const returnedRow = row.map(piece => {
        return piece ? {
          type: piece.getType(),
          side: piece.getSide(),
        } : null
      })
      return returnedRow
    })
    return returnedBoard
  }
}

module.exports = Game