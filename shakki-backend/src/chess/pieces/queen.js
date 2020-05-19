const Piece = require("./piece")

class Queen extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
  }

  getType() {
    return "queen"
  }

  move(board, newRow, newColumn) {
    if (this.didntMove(newRow, newColumn, board)) {
      return false
    }
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

    const rowOffset = this.row - newRow
    const colOffset = this.column - newColumn

    if (Math.abs(rowOffset) === Math.abs(colOffset) || (colOffset === 0 || rowOffset === 0)) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        return true
      }
    }

    return false
  }
}

module.exports = Queen