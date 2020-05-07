const Piece = require("./piece")

class Queen extends Piece {
  constructor(side, location) {
    super(side, location)
  }

  getType() {
    return "queen"
  }

  move(board, newRow, newColumn) {
    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    const rowOffset = this.row - newRow
    const colOffset = this.column - newColumn

    if (Math.abs(rowOffset) === Math.abs(colOffset) || (colOffset === 0 || rowOffset === 0)) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        this.moveSuccess(board, newRow, newColumn)
        return true
      }
    }

    return false
  }
}

module.exports = Queen