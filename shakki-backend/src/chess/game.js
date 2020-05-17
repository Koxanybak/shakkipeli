const gameHelper = require("./gameHelper")
const { UserInputError } = require("apollo-server-express")

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
    this.gameOver = false
    this.check = null
  }



  // tries to make a move
  makeMove(
    pieceMoved,
    { row: oldRow, column: oldColumn },
    { row: newRow, column: newColumn },
    player,
  ) {
    if (this.gameOver) {
      throw new UserInputError("Game is over")
    }
    //game is not yet full
    if (!this.isFull()) {
      throw new UserInputError("Other player missing")
    }
    // the wrong player tries to move
    if (this.currentPlayer !== player) {
      throw new UserInputError("It is not your turn")
    }
    // the player tries to move the opponents piece
    if ((pieceMoved.side !== "white" && this.currentPlayer === this.whitePlayer) || (pieceMoved.side !== "black" && this.currentPlayer === this.blackPlayer)) {
      throw new UserInputError("That is not your piece")
    }
    
    // the frontend is out of sync
    if ((!this.board[oldRow][oldColumn])
      || (this.board[oldRow][oldColumn].getType() !== pieceMoved.type)
      || (this.board[oldRow][oldColumn].getSide() !== pieceMoved.side)
    ) {
      throw new UserInputError("No such piece in that location")
    }

    // promotion
    if (this.pieceToPromote) {
      throw new UserInputError("Can't make a move until the pawn is promoted")
    }

    // the piece wasn't moved
    if ((oldRow === newRow) && (oldColumn === newColumn)) {
      this.lastMove = {
        success: false,
        message: "Piece was not moved.",
      }
      return
    }

    const pieceToEat = this.board[newRow][newColumn]
    const pieceToMove = this.board[oldRow][oldColumn]

    // moves the piece
    if (pieceToMove.move(this.board, newRow, newColumn)) {
      // the move leads to check against the player
      if (this.isCheck(this.currentPlayer === this.whitePlayer ? "white" : "black")) {
        this.lastMove = {
          success: false,
          message: "Kuninkaasi tulisi uhatuksi.",
        }
        pieceToMove.undoMove(pieceToEat)
        return
      }
      // resets check
      this.check = null

      // checks for check
      if (this.isCheck(this.currentPlayer === this.whitePlayer ? "black" : "white")) {
        // checks for checkmate
        console.log("moves that prevent check")
        const movesAvailable = this.movesAvailable(this.currentPlayer === this.whitePlayer ? "black" : "white")
        if (movesAvailable.length === 0) {
          this.gameOver = true
          this.winner = this.currentPlayer
          return
        }
        console.log("movesAvailable:", movesAvailable)
        this.check = {
          threatenedPlayer: this.currentPlayer === this.whitePlayer ? this.blackPlayer : this.whitePlayer,
          movesAvailable,
        }
      }

      this.lastMove = {
        success: true,
      }

      // clear en passant
      this.clearEnPassant(newRow, newColumn)

      // checks for pawn promotion
      const movedPiece = this.board[newRow][newColumn]
      if (
        (movedPiece && movedPiece.getType() === "pawn") &&
        (
          (movedPiece.getSide() === "black" && newRow === 7) ||
          (movedPiece.getSide() === "white" && newRow === 0)
        )
      ) {
        this.promotionPlayerID = this.currentPlayer
        this.pieceToPromote = movedPiece
        console.log(this.pieceToPromote)
        return
      }

      // switches turn
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

  // a slow way of checking for check mate
  movesAvailable(side) {

    let piecesOfSide = []
    this.board.forEach(row => {
      row.forEach(piece => {
        piecesOfSide.push(piece)
      })
    })
    piecesOfSide = piecesOfSide.filter(piece => piece && piece.side === side)

    const movesAvailable = []

    piecesOfSide.forEach(piece => {
      this.board.forEach((rivi, row) => {
        rivi.forEach((sarake, column) => {
          const pieceEaten = this.board[row][column]

          if (piece.move(this.board, row, column, true)) {
            if (!this.isCheck(side)) {

              movesAvailable.push({
                piece: {
                  type: piece.getType(),
                  side: piece.getSide(),
                  id: piece.id,
                },
                newLocation: { row, column, },
              })
            }

            piece.undoMove(pieceEaten)
          }
        })
      })
    })

    return movesAvailable
  }

  isCheck(side) {
    const king = this.findKing(side)
    return king.isInCheck(king.row, king.column)
  }


  findKing(side) {
    let king
    this.board.forEach(row => {
      row.forEach(piece => {
        if (piece && (piece.getType() === "king" && piece.side === side)) {
          king = piece
        }
      })
    })

    return king
  }



  addPlayer(player) {
    if (!this.blackPlayer && !this.whitePlayer) {
      //console.log("id", player, "on valkoiset ja ensimmäinen vuoro")
      this.whitePlayer = player
      this.currentPlayer = this.whitePlayer
    } else {
      //console.log("id", player, "on mustat ja toinen vuoro")
      this.blackPlayer = player
    }
  }

  isFull() {
    return this.blackPlayer && this.whitePlayer
  }

  clearEnPassant(newRow, newColumn) {
    this.board.forEach(row => {
      row.forEach(piece => {
        if (
          (piece && piece.getType() === "pawn") &&
          (newRow !== piece.row && newColumn !== piece.column)
        ) {
          piece.vulnerableToEnPassant === false
        }
      })
    })
  }



  // makes a chess class out of the given pieceObject
  makePiece(type, side, location) {
    switch(type) {
    case "pawn":
      return new Pawn(side, location)
    case "rook":
      return new Rook(side, location)
    case "knight":
      return new Knight(side, location)
    case "bishop":
      return new Bishop(side, location)
    case "queen":
      return new Queen(side, location)
    case "king":
      return new King(side, location)
    default:
      return null
    }
  }

  // promotes a pawn
  promote(type, player) {
    if (player !== this.promotionPlayerID) {
      return false
    }

    const row = this.pieceToPromote.row
    const column = this.pieceToPromote.column
    this.board[row][column]
      = this.makePiece(type, this.promotionPlayerID === this.whitePlayer ? "white" : "black", { row, column })

    // checks for check
    if (this.isCheck(this.currentPlayer === this.whitePlayer ? "black" : "white")) {
      // checks for checkmate
      const movesAvailable = this.movesAvailable(this.currentPlayer === this.whitePlayer ? "black" : "white")
      if (movesAvailable.length === 0) {
        this.gameOver = true
        this.winner = this.currentPlayer
        return
      }
      console.log("movesAvailable:", movesAvailable)
      this.check = {
        threatenedPlayer: this.currentPlayer === this.whitePlayer ? this.blackPlayer : this.whitePlayer,
        movesAvailable,
      }
    }

    this.lastMove = {
      success: true,
    }

    // switches turn
    this.currentPlayer = this.currentPlayer === this.whitePlayer
      ? this.blackPlayer
      : this.whitePlayer

    this.promotionPlayerID = null
    this.pieceToPromote = null

    return true
  }

  // gets the board for the frontend to use
  getBoard() {
    const returnedBoard = this.board.map(row => {
      const returnedRow = row.map(piece => {
        return piece ? {
          type: piece.getType(),
          side: piece.getSide(),
          id: piece.id,
        } : null
      })
      return returnedRow
    })
    return returnedBoard
  }

  findPieceById(id) {
    let piece = null
    this.board.forEach(row => {
      row.forEach(p => {
        if (p.id === id) {
          piece = p
        }
      })
    })

    return piece
  }
}

module.exports = Game