const Piece = require("./piece")

class Pawn extends Piece {
  constructor(side, location) {
    super(side, location)
    this.moved = false
  }

  getType() {
    return "pawn"
  }

  move(board, newRow, newColumn) {
    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (this.moved) {
      //piece has been moved
      if (this.side === "white") {
        // side is white
        if (
          (newRow === this.row - 1 && newColumn === this.column) &&
          !board[newRow][newColumn]
        ) {
          this.moveSuccess(board, newRow, newColumn)
          return true
        }
        
        if (
          (newRow === this.row - 1 &&
            (newColumn === this.column - 1 || newColumn === this.column + 1)
          ) &&
          board[newRow][newColumn]
        ) {
          this.moveSuccess(board, newRow, newColumn)
          return true
        }

        return false
      }

      // side is black
      if (
        (newRow === this.row + 1 && newColumn === this.column) &&
        !board[newRow][newColumn]
      ) {
        this.moveSuccess(board, newRow, newColumn)
        return true
      }
      
      if (
        (newRow === this.row + 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        ) &&
        board[newRow][newColumn]
      ) {
        this.moveSuccess(board, newRow, newColumn)
        return true
      }

      return false
    }

    // piece has not been moved
    if (this.side === "white") {
      // side is white
      if (
        ((newRow === this.row - 2 || newRow === this.row - 1) && newColumn === this.column) &&
        !board[newRow][newColumn]
      ) {
        if (!this.obstaclesInWay(board, newRow, newColumn)) {
          this.moveSuccess(board, newRow, newColumn)
          this.moved = true
          return true
        }
      }
      
      if (
        (newRow === this.row - 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        ) &&
        board[newRow][newColumn]
      ) {
        this.moveSuccess(board, newRow, newColumn)
        this.moved = true
        return true
      }

      return false
    }

    // side is black
    if (
      ((newRow === this.row + 2 || newRow === this.row + 1) && newColumn === this.column) &&
      !board[newRow][newColumn]
    ) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        this.moveSuccess(board, newRow, newColumn)
        this.moved = true
        return true
      }
    }
    
    if (
      (newRow === this.row + 1 &&
        (newColumn === this.column - 1 || newColumn === this.column + 1)
      ) &&
      board[newRow][newColumn]
    ) {
      this.moveSuccess(board, newRow, newColumn)
      this.moved = true
      return true
    }

    return false
  }
}

module.exports = Pawn