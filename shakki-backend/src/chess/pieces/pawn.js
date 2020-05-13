const Piece = require("./piece")

class Pawn extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
    this.moved = false
    this.vulnerableToEnPassant = false
    this.movedFirstLastTime = false
  }

  getType() {
    return "pawn"
  }

  move(board, newRow, newColumn) {
    if (this.didntMove(newRow, newColumn)) {
      return false
    }
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
          this.movedFirstLastTime = false
          this.vulnerableToEnPassant = false
          return true
        }
        
        if (
          (newRow === this.row - 1 &&
            (newColumn === this.column - 1 || newColumn === this.column + 1)
          ) &&
          board[newRow][newColumn]
        ) {
          this.moveSuccess(board, newRow, newColumn)
          this.movedFirstLastTime = false
          this.vulnerableToEnPassant = false
          return true
        }

        // en passant
        if (this.enPassantSuccessfulW(newRow, newColumn, board)) {
          this.movedFirstLastTime = false
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
        this.movedFirstLastTime = false
        this.vulnerableToEnPassant = false
        return true
      }
      
      if (
        (newRow === this.row + 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        ) &&
        board[newRow][newColumn]
      ) {
        this.moveSuccess(board, newRow, newColumn)
        this.movedFirstLastTime = false
        this.vulnerableToEnPassant = false
        return true
      }

      // en passant
      if (this.enPassantSuccessfulB(newRow, newColumn, board)) {
        this.movedFirstLastTime = false
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
          if (newRow === this.row - 2) {
            this.vulnerableToEnPassant = true
          }
          this.moveSuccess(board, newRow, newColumn)
          this.movedFirstLastTime = true
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
        this.movedFirstLastTime = true
        this.moved = true
        return true
      }

      // en passant
      if (this.enPassantSuccessfulW(newRow, newColumn, board)) {
        this.movedFirstLastTime = true
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
        if (newRow === this.row + 2) {
          this.vulnerableToEnPassant = true
        }
        this.movedFirstLastTime = true
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
      this.movedFirstLastTime = true
      this.moveSuccess(board, newRow, newColumn)
      this.moved = true
      return true
    }

    // en passant
    if (this.enPassantSuccessfulB(newRow, newColumn, board)) {
      this.movedFirstLastTime = true
      return true
    }
    return false
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


  enPassantSuccessfulW(newRow, newColumn, board) {
    
    if (
      (
        (newRow === this.row - 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        ) &&
        (!board[newRow][newColumn] && board[this.row][newColumn])
      ) && ((board[this.row][newColumn].getType() === "pawn" &&
        board[this.row][newColumn].vulnerableToEnPassant) &&
          this.side !== board[this.row][newColumn].side)
    ) {
      board[this.row][newColumn] = null
      this.moveSuccess(board, newRow, newColumn)
      this.vulnerableToEnPassant = false
      this.moved = true
      return true
    }
  }
  enPassantSuccessfulB(newRow, newColumn, board) {
    /* console.log("uusi siirto")
    console.log("newRow === this.row - 1", newRow === this.row - 1)
    console.log("newColumn === this.column - 1 || newColumn === this.column + 1", newColumn === this.column - 1 || newColumn === this.column + 1)
    console.log("!board[newRow][newColumn]", !board[newRow][newColumn])
    console.log("board[this.row][newColumn]", board[this.row][newColumn])
    console.log("board[this.row][newColumn].getType() === pawn", board[this.row][newColumn].getType() === "pawn")
    console.log("board[this.row][newColumn].vulnerableToEnPassant", board[this.row][newColumn].vulnerableToEnPassant)
    console.log("this.side !== board[this.row][newColumn].side", this.side !== board[this.row][newColumn].side)
     */
    
    if (
      (
        (newRow === this.row + 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        ) &&
        (!board[newRow][newColumn] && board[this.row][newColumn])
      ) && ((board[this.row][newColumn].getType() === "pawn" &&
        board[this.row][newColumn].vulnerableToEnPassant) &&
          this.side !== board[this.row][newColumn].side)
    ) {
      board[this.row][newColumn] = null
      this.moveSuccess(board, newRow, newColumn)
      this.vulnerableToEnPassant = false
      this.moved = true
      return true
    }
  }



  moveSuccess(board, newRow, newColumn) {
    this.moved = true
    this.lastRow = this.row
    this.lastColumn = this.column
    board[this.row][this.column] = null
    this.row = newRow
    this.column = newColumn
    board[newRow][newColumn] = this
  }

  canMove(board, newRow, newColumn) {
    if (this.didntMove(newRow, newColumn)) {
      return false
    }
    if (this.sameSide(board, newRow, newColumn)) {
      return false
    }

    if (this.moved) {
      //piece has been moved
      if (this.side === "white") {
        // side is white
        
        if (
          (newRow === this.row - 1 &&
            (newColumn === this.column - 1 || newColumn === this.column + 1)
          )
        ) {
          return true
        }
      }

      // side is black
      if (
        (newRow === this.row + 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        )
      ) {
        //console.log("this should be logged")
        return true
      }

      return false
    }

    // piece has not been moved
    if (this.side === "white") {
      // side is white
      
      if (
        (newRow === this.row - 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        )
      ) {
        return true
      }
    }

    // side is black
    
    if (
      (newRow === this.row + 1 &&
        (newColumn === this.column - 1 || newColumn === this.column + 1)
      )
    ) {
      return true
    }

    return false
  }
}

module.exports = Pawn