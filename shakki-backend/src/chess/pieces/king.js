const Piece = require("./piece")

class King extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
    this.moved = false
    this.lastMoveWasCastling = false
    this.movedFirstLastTime = false
  }

  getType() {
    return "king"
  }

  getMoved() {
    return this.moved
  }

  // check if the given location would place the king in check
  isInCheck(row, column) {
    /* console.log("isInCheck was called with row:", row) */
    let result = false
    this.board.forEach(r => {
      r.forEach(piece => {
        if (piece && (piece.side !== this.side && piece.canMove(this.board, row, column))) {
          console.log("The king would be in check and the piece that can eat him is:", piece)
          result = true
        }
      })
    })

    return result
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
        targetPiece.getType() === "rook" &&
        targetPiece.getSide() === this.getSide()
      ) &&
      (
        (Math.abs(colOffset) === 3 || Math.abs(colOffset) === 4) &&
        (!ignoreCastling && !this.isInCheck(this.row, this.column))
      ) &&
      (
        !targetPiece.getMoved() &&
        !this.obstaclesInWay(board, newRow, newColumn)
      )
    ) {
      if (Math.abs(colOffset) === 3) {
        if (!this.isInCheck(newRow, newColumn - 2) && !this.isInCheck(newRow, newColumn - 1)) {
          this.movedFirstLastTime = true
          this.moved = true
          targetPiece.moved = true
          this.moveSuccess(board, newRow, newColumn - 1)
          targetPiece.moveSuccess(board, newRow, newColumn - 2)
          this.lastMoveWasCastling = true
          targetPiece.lastMoveWasCastling = true
          return true
        }
      } else {
        if (
          (
            !this.isInCheck(newRow, newColumn + 2) &&
            !this.isInCheck(newRow, newColumn + 1)
          )
        ) {
          this.movedFirstLastTime = true
          this.moved = true
          targetPiece.moved = true
          this.moveSuccess(board, newRow, newColumn + 2)
          targetPiece.moveSuccess(board, newRow, newColumn + 3)
          this.lastMoveWasCastling = true
          targetPiece.lastMoveWasCastling = true
          return true
        }
      }
    }

    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (
      (
        (Math.abs(colOffset) === 1 && Math.abs(rowOffset) === 0) ||
        (Math.abs(rowOffset) === 1 && Math.abs(colOffset) === 0) ||
        (Math.abs(rowOffset) === 1 && Math.abs(colOffset) === 1)
      )
    ) {
      if (!this.isInCheck(newRow, newColumn)) {
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
    if (this.didntMove(newRow, newColumn)) {
      return false
    }
    const rowOffset = this.row - newRow
    const colOffset = this.column - newColumn

    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (
      (
        (Math.abs(colOffset) === 1 && Math.abs(rowOffset) === 0) ||
        (Math.abs(rowOffset) === 1 && Math.abs(colOffset) === 0) ||
        (Math.abs(rowOffset) === 1 && Math.abs(colOffset) === 1)
      )
    ) {
      //console.log(this, "can move to the row", newRow, "and column", newColumn)
      return true
    }

    return false
  }
}

module.exports = King