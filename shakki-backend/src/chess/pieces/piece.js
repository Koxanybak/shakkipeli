class Piece {
  constructor(side, location, id, board) {
    this.side = side
    this.row = location.row
    this.column = location.column
    this.board = board
    this.id = id
  }

  getSide() {
    return this.side
  }

  toString() {
    return this ? this.getType() : null
  }

  // moves the piece and eats any piece at the target location
  moveSuccess(board, newRow, newColumn) {
    this.lastRow = this.row
    this.lastColumn = this.column
    board[this.row][this.column] = null
    this.row = newRow
    this.column = newColumn
    board[newRow][newColumn] = this
  }

  // gets all the moves the piece can make
  getAvailableMoves(game) {
    const availableMoves = []

    this.board.forEach((r, i) => {
      r.forEach((pieceToEat, j) => {
        /* if (this.move(this.board, i, j)) {
          // the move leads to check against the player
          if (!game.isCheck(game.currentPlayer === game.whitePlayer ? "white" : "black")) {
            availableMoves.push({ newLocation: { row: i, column: j } })
          }
          if (this.lastMoveWasCastling) {
            this.undoCastling(pieceToEat)
          } else {
            this.undoMove(pieceToEat)
          }
        } */
        if (this.canMove(this.board, i, j)) {
          availableMoves.push({ newLocation: { row: i, column: j } })
        }
      })
    })

    return availableMoves
  }

  // TÄMÄ SAATANA
  
  moveResultsInCheck(game, piece, newRow, newColumn) {
    const testBoard = this.getTestBoard()

    testBoard[newRow][newColumn] = piece

    if (game.isCheck(this.getSide(), testBoard)) {
      return true
    }

    return false
  }

  didntMove(newRow, newColumn) {
    if (newRow === this.row && newColumn === this.column) {
      return true
    }
  }

  sameSide(board, newRow, newColumn) {
    const pieceToEat = this.board[newRow][newColumn]

    if (pieceToEat && pieceToEat.getSide() === this.side) {
      return true
    }
  }

  undoMove(pieceEaten) {
    this.board[this.lastRow][this.lastColumn] = this
    this.board[this.row][this.column] = pieceEaten

    this.row = this.lastRow
    this.column = this.lastColumn
  }

  getTestBoard() {
    let testBoard = []
    this.board.forEach((r, i) => {
      testBoard[i] = new Array(8)
      r.forEach((p, j) => {
        testBoard[i][j] = p
      })
    })
    return testBoard
  }

  obstaclesInWay(board, newRow, newColumn) {
    const rowOffset = this.row - newRow
    const colOffset = this.column - newColumn

    if ((rowOffset === 1 || colOffset === 1) || (rowOffset === -1 || colOffset === -1)) {
      return false
    }

    // diagonal check
    if (Math.abs(rowOffset) === Math.abs(colOffset)) {
      if (rowOffset > 0 && colOffset > 0) {
        for (let i = 1; i < Math.abs(rowOffset); i++) {
          if (board[this.row - i][this.column - i]) {
            return true
          }
        }
      }
      if (rowOffset > 0 && colOffset < 0) {
        for (let i = 1; i < Math.abs(rowOffset); i++) {
          if (board[this.row - i][this.column + i]) {
            return true
          }
        }
      }
      if (rowOffset < 0 && colOffset > 0) {
        for (let i = 1; i < Math.abs(rowOffset); i++) {
          if (board[this.row + i][this.column - i]) {
            return true
          }
        }
      }
      if (rowOffset < 0 && colOffset < 0) {
        for (let i = 1; i < Math.abs(rowOffset); i++) {
          if (board[this.row + i][this.column + i]) {
            return true
          }
        }
      }

      return false
    }

    // straight check
    if (colOffset > 0) {
      for (let i = 1; i < Math.abs(colOffset); i++) {
        if (board[this.row][this.column - i]) {
          return true
        }
      }
    }
    if (colOffset < 0) {
      for (let i = 1; i < Math.abs(colOffset); i++) {
        if (board[this.row][this.column + i]) {
          return true
        }
      }
    }
    if (rowOffset > 0) {
      for (let i = 1; i < Math.abs(rowOffset); i++) {
        if (board[this.row - i][this.column]) {
          return true
        }
      }
    }
    if (rowOffset < 0) {
      for (let i = 1; i < Math.abs(rowOffset); i++) {
        if (board[this.row + i][this.column]) {
          return true
        }
      }
    }

    return false
  }
}

module.exports = Piece