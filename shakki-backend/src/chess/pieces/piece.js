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

  moveSuccess(board, newRow, newColumn) {
    this.lastRow = this.row
    this.lastColumn = this.column
    board[this.row][this.column] = null
    this.row = newRow
    this.column = newColumn
    board[newRow][newColumn] = this
  }

  didntMove(newRow, newColumn) {
    if (newRow === this.row && newColumn === this.column) {
      return true
    }
  }

  sameSide(board, newRow, newColumn) {
    /* if (newRow !== 0 && newRow !== 7) {
      console.log("this:", this.toString())
      console.log("newRow:", newRow)
    } */
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