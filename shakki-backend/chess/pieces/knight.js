const Piece = require("./piece")

class Knight extends Piece {
  constructor(side, location) {
    super(side, location)
  }

  getType() {
    return "knight"
  }

  move(board, newRow, newColumn) {
    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (
      (newRow === this.row + 2 || newRow === this.row - 2) &&
      (newColumn === this.column + 1 || newColumn === this.column - 1)
    ) {
      this.moveSuccess(board, newRow, newColumn)
      return true
    }
    if (
      (newRow === this.row + 1 || newRow === this.row - 1) &&
      (newColumn === this.column + 2 || newColumn === this.column - 2)
    ) {
      this.moveSuccess(board, newRow, newColumn)
      return true
    }

    return false
  }
}

module.exports = Knight