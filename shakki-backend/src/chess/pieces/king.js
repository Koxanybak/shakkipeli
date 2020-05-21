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
  setMoved(bool) {
    this.moved = bool
  }
  getMovedFirstLastTime() {
    return this.movedFirstLastTime
  }
  setMovedFirstLastTime(bool) {
    this.movedFirstLastTime = bool
  }
  getLastMoveWasCastling() {
    return this.lastMoveWasCastling
  }
  setLastMoveWasCastling(bool) {
    this.lastMoveWasCastling = bool
  }

  // check if the given location would place the king in check
  isInCheck(row, column, board, ignoreSameSide) {
    let result = false

    board.forEach(r => {
      r.forEach(piece => {
        if (piece && (piece.side !== this.side && piece.canMove(board, row, column, true, ignoreSameSide))) {
          /* console.log("The king would be in check and the piece that can eat him is:", piece) */
          result = true
        }
      })
    })

    return result
  }

  undoCastling(castledPiece) {

    if (this.movedFirstLastTime) {
      this.movedFirstLastTime = false
      this.moved = false
    }
    this.lastMoveWasCastling = false

    if (castledPiece.movedFirstLastTime) {
      castledPiece.movedFirstLastTime = false
      castledPiece.moved = false
    }
    castledPiece.lastMoveWasCastling = false

    this.board[this.row][this.column] = null
    this.board[castledPiece.row][castledPiece.column] = null

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
    if (this.didntMove(newRow, newColumn, board)) {
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
        (!ignoreCastling && !this.isInCheck(this.row, this.column, board))
      ) &&
      (
        !targetPiece.getMoved() &&
        !this.obstaclesInWay(board, newRow, newColumn)
      )
    ) {
      console.log("castling done")
      console.log(targetPiece)
      console.log(this)
      if (Math.abs(colOffset) === 3) {
        if (!this.isInCheck(newRow, newColumn - 2, board) && !this.isInCheck(newRow, newColumn - 1, board)) {
          this.setMovedFirstLastTime(true)
          this.setMoved(true)
          targetPiece.setMoved(true)
          targetPiece.setMovedFirstLastTime(true)
          this.moveSuccess(board, newRow, newColumn - 1)
          targetPiece.moveSuccess(board, newRow, newColumn - 2)
          this.setLastMoveWasCastling(true)
          targetPiece.setLastMoveWasCastling(true)
          return true
        }
      } else {
        if (
          (
            !this.isInCheck(newRow, newColumn + 2, board) &&
            !this.isInCheck(newRow, newColumn + 3, board)
          )
        ) {
          this.setMovedFirstLastTime(true)
          this.setMoved(true)
          targetPiece.setMoved(true)
          targetPiece.setMovedFirstLastTime(true)
          this.moveSuccess(board, newRow, newColumn + 2)
          targetPiece.moveSuccess(board, newRow, newColumn + 3)
          this.setLastMoveWasCastling(true)
          targetPiece.setLastMoveWasCastling(true)
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
      if (!this.isInCheck(newRow, newColumn, board)) {
        if (!this.moved) {
          this.movedFirstLastTime = true
        } else {
          this.movedFirstLastTime = false
        }
        this.moveSuccess(board, newRow, newColumn)
        this.lastMoveWasCastling = false
        this.moved = true
        return true
      }
    }
    return false
  }

  canMove(board, newRow, newColumn, ignoreCheck, ignoreSameSide, game, ignoreCastling) {
    if (this.didntMove(newRow, newColumn, board)) {
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
        (!ignoreCastling && !this.isInCheck(this.row, this.column, board))
      ) &&
      (
        !targetPiece.getMoved() &&
        !this.obstaclesInWay(board, newRow, newColumn)
      )
    ) {
      if (Math.abs(colOffset) === 3) {
        if (!this.isInCheck(newRow, newColumn - 2, board) && !this.isInCheck(newRow, newColumn - 1, board)) {
          return true
        }
      } else {
        if (
          (
            !this.isInCheck(newRow, newColumn + 2, board) &&
            !this.isInCheck(newRow, newColumn + 3, board)
          )
        ) {
          return true
        }
      }
    }

    if (!ignoreSameSide && this.sameSide(board, newRow, newColumn)) {
      return false
    }
    if (!ignoreCheck && this.moveResultsInCheck(game, newRow, newColumn)) {
      return false
    }

    if (
      (
        (Math.abs(colOffset) === 1 && Math.abs(rowOffset) === 0) ||
        (Math.abs(rowOffset) === 1 && Math.abs(colOffset) === 0) ||
        (Math.abs(rowOffset) === 1 && Math.abs(colOffset) === 1)
      )
    ) {
      if (!ignoreCheck && !this.isInCheck(newRow, newColumn, board, true)) {
        /* console.log("king would be in check", newRow, newColumn) */
        return true
      }
    }

    return false
  }
}

module.exports = King