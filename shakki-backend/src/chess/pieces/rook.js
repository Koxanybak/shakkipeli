const Piece = require("./piece")

class Rook extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
    this.moved = false
  }

  getType() {
    return "rook"
  }

  getMoved() {
    return this.moved
  }

  move(board, newRow, newColumn) {
    if (this.didntMove(newRow, newColumn)) {
      return false
    }
    const rowOffset = this.row - newRow
    const colOffset = this.column - newColumn

    const targetPiece = board[newRow][newColumn]

    // castling
    if (
      (
        !this.moved &&
        targetPiece
      ) &&
      (
        targetPiece.getType() === "king" &&
        targetPiece.getSide() === this.getSide()
      ) && 
      (
        !targetPiece.getMoved() &&
        !this.obstaclesInWay(board, newRow, newColumn)
      ) &&
      (
        Math.abs(colOffset) === 3
      )
    ) {
      if (!targetPiece.isInCheck(board, newRow, newColumn + 2)) {
        this.moved = true
        targetPiece.moved = true
        this.moveSuccess(board, newRow, newColumn + 1)
        targetPiece.moveSuccess(board, newRow, newColumn + 2)
        return true
      }
    }

    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (colOffset === 0 || rowOffset === 0) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        this.moveSuccess(board, newRow, newColumn)
        this.moved = true
        return true
      }
    }

    return false
  }

  canMove(board, newRow, newColumn) {
    if (this.didntMove(newRow, newColumn)) {
      return false
    }
    const rowOffset = this.row - newRow
    const colOffset = this.column - newColumn

    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (colOffset === 0 || rowOffset === 0) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        return true
      }
    }

    return false
  }
}

module.exports = Rook