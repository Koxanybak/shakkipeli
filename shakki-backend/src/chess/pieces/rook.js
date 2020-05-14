const Piece = require("./piece")

class Rook extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
    this.moved = false
    this.lastMoveWasCastling = false
    this.movedFirstLastTime = false
  }

  getType() {
    return "rook"
  }

  getMoved() {
    return this.moved
  }

  undoCastling(castledPiece) {
    this.movedFirstLastTime = false
    this.moved = false
    this.lastMoveWasCastling = false
    castledPiece.movedFirstLastTime = false
    castledPiece.moved = false
    castledPiece.lastMoveWasCastling = false

    this.board[this.lastRow][this.lastColumn] = this
    this.board[castledPiece.lastRow][castledPiece.lastColumn] = castledPiece

    this.row = this.lastRow
    this.column = this.lastColumn

    castledPiece.row = castledPiece.lastRow
    castledPiece.column = castledPiece.lastColumn
  }

  undoMove(pieceEaten) {
    if (this.movedFirstLastTime) {
      this.movedFirstLastTime = false
      this.moved = false
    }
    this.board[this.lastRow][this.lastColumn] = this
    this.board[this.row][this.column] = pieceEaten

    this.row = this.lastRow
    this.column = this.lastColumn
  }

  move(board, newRow, newColumn, ignoreCastling) {
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
        (Math.abs(colOffset) === 3 || Math.abs(colOffset) === 4) &&
        (!ignoreCastling && !targetPiece.isInCheck(targetPiece.row, targetPiece.column))
      ) &&
      (
        !targetPiece.getMoved() &&
        !this.obstaclesInWay(board, newRow, newColumn)
      )
    ) {
      if (Math.abs(colOffset) === 3) {
        if (!targetPiece.isInCheck(newRow, newColumn + 2) && !targetPiece.isInCheck(newRow, newColumn + 1)) {
          this.movedFirstLastTime = true
          this.moved = true
          targetPiece.moved = true
          this.moveSuccess(board, newRow, newColumn + 1)
          targetPiece.moveSuccess(board, newRow, newColumn + 2)
          this.lastMoveWasCastling = true
          targetPiece.lastMoveWasCastling = true
          return true
        }
      } else {
        if (
          (
            !targetPiece.isInCheck(newRow, newColumn - 2) &&
            !targetPiece.isInCheck(newRow, newColumn - 1)
          )
        ) {
          this.movedFirstLastTime = true
          this.moved = true
          targetPiece.moved = true
          this.moveSuccess(board, newRow, newColumn - 1)
          targetPiece.moveSuccess(board, newRow, newColumn - 2)
          this.lastMoveWasCastling = true
          targetPiece.lastMoveWasCastling = true
          return true
        }
      }
    }

    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (colOffset === 0 || rowOffset === 0) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        if (!this.moved) {
          this.movedFirstLastTime = true
        }
        this.moveSuccess(board, newRow, newColumn)
        this.lastMoveWasCastling = false
        this.moved = true
        return true
      }
    }

    return false
  }

  canMove(board, newRow, newColumn) {
    /* console.log("newRow at canMove:", newRow) */
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