const Piece = require("./piece")

class King extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
    this.moved = false
  }

  getType() {
    return "king"
  }

  getMoved() {
    return this.moved
  }

  // check if the given location would place the king in check
  isInCheck(row, column) {
    let result = false
    this.board.forEach(row => {
      row.forEach(piece => {
        if (piece && (piece.side !== this.side && piece.canMove(this.board, row, column))) {
          //console.log("the king would be in check")
          //console.log("and the piece that can eat him is:", piece)
          result = true
        }
      })
    })

    return result
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
        targetPiece.getType() === "rook" &&
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
      if (!this.isInCheck(newRow, newColumn - 1)) {
        this.moved = true
        targetPiece.moved = true
        this.moveSuccess(board, newRow, newColumn - 1)
        targetPiece.moveSuccess(board, newRow, newColumn - 2)
        return true
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
      //console.log(this.isInCheck(board, newRow, newColumn))
      if (!this.isInCheck(newRow, newColumn)) {
        //console.log("this shouldnt be logged")
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