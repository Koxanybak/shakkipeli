class Piece {
  constructor(side, location) {
    this.side = side
    this.row = location.row
    this.column = location.column
  }

  getSide() {
    return this.side
  }

  moveSuccess(board, newRow, newColumn) {
    board[this.row][this.column] = null
    this.row = newRow
    this.column = newColumn
    board[newRow][newColumn] = this
  }

  sameSide(board, newRow, newColumn) {
    const pieceToEat = board[newRow][newColumn]

    if (pieceToEat && pieceToEat.getSide() === this.side) {
      return true
    }
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