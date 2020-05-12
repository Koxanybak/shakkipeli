const Piece = require("./piece")

class Pawn extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
    this.moved = false
    this.vulnerableToEnPassant = false
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
          this.vulnerableToEnPassant = false
          return true
        }

        // en passant
        return this.enPassantSuccessfulW(newRow, newColumn, board)
      }

      // side is black
      if (
        (newRow === this.row + 1 && newColumn === this.column) &&
        !board[newRow][newColumn]
      ) {
        this.moveSuccess(board, newRow, newColumn)
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
        this.vulnerableToEnPassant = false
        return true
      }

      // en passant
      return this.enPassantSuccessfulB(newRow, newColumn, board)
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

      // en passant
      return this.enPassantSuccessfulW(newRow, newColumn, board)
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

    // en passant
    return this.enPassantSuccessfulB(newRow, newColumn, board)
  }


  enPassantSuccessfulW(newRow, newColumn, board) {
    /*console.log("uusi siirto")
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
    /*console.log("uusi siirto")
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



  moveSuccess(board, newRow, newColumn) {
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
          (newRow === this.row - 1 && newColumn === this.column) &&
          !board[newRow][newColumn]
        ) {
          return true
        }
        
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
        (newRow === this.row + 1 && newColumn === this.column) &&
        !board[newRow][newColumn]
      ) {
        return true
      }
      //console.log("newRow:", newRow)
      //console.log("newColumn:", newColumn)
      if (
        (newRow === this.row + 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        )
      ) {
        //console.log("this should be logged")
        return true
      }
    }

    // piece has not been moved
    if (this.side === "white") {
      // side is white
      if (
        ((newRow === this.row - 2 || newRow === this.row - 1) && newColumn === this.column) &&
        !board[newRow][newColumn]
      ) {
        if (!this.obstaclesInWay(board, newRow, newColumn)) {
          return true
        }
      }
      
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
      ((newRow === this.row + 2 || newRow === this.row + 1) && newColumn === this.column) &&
      !board[newRow][newColumn]
    ) {
      if (!this.obstaclesInWay(board, newRow, newColumn)) {
        return true
      }
    }
    
    if (
      (newRow === this.row + 1 &&
        (newColumn === this.column - 1 || newColumn === this.column + 1)
      )
    ) {
      return true
    }
  }
}

module.exports = Pawn