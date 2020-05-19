const Piece = require("./piece")

class Knight extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
  }

  getType() {
    return "knight"
  }

  move(board, newRow, newColumn) {
    if (this.didntMove(newRow, newColumn, board)) {
      return false
    }
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

  canMove(board, newRow, newColumn, ignoreCheck, ignoreSameSide, game,) {
    if (this.didntMove(newRow, newColumn, board)) {
      return false
    }
    if (!ignoreSameSide && this.sameSide(board, newRow, newColumn)) {
      return false
    }
    if (!ignoreCheck && this.moveResultsInCheck(game, newRow, newColumn)) {
      return false
    }

    if (
      (newRow === this.row + 2 || newRow === this.row - 2) &&
      (newColumn === this.column + 1 || newColumn === this.column - 1)
    ) {
      return true
    }
    if (
      (newRow === this.row + 1 || newRow === this.row - 1) &&
      (newColumn === this.column + 2 || newColumn === this.column - 2)
    ) {
      return true
    }

    return false
  }
}

module.exports = Knight