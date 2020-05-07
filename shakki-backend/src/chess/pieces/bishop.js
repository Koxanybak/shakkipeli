const Piece = require("./piece")

class Bishop extends Piece {
  constructor(side, location) {
    super(side, location)
  }

  getType() {
    return "bishop"
  }

  move(board, newRow, newColumn) {
    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    const rowOffset = this.row - newRow
    const colOffset = this.column - newColumn

    if (Math.abs(rowOffset) === Math.abs(colOffset)) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        this.moveSuccess(board, newRow, newColumn)
        return true
      }
    }

    return false
  }
}

module.exports = Bishop