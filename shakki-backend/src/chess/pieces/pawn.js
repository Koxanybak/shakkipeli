const Piece = require("./piece")

class Pawn extends Piece {
  constructor(side, location, id, board) {
    super(side, location, id, board)
    this.moved = false
    this.vulnerableToEnPassant = false
    this.movedFirstLastTime = false
    this.movedTwoLastTime = false
    this.enPassantedLastTime = false
  }
  getType() {
    return "pawn"
  }
  setVulnerableToEnPassant(bool) {
    this.vulnerableToEnPassant = bool
  }

  move(board, newRow, newColumn) {
    if (this.didntMove(newRow, newColumn, board)) {
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
          this.movedTwoLastTime = false
          this.vulnerableToEnPassant = false
          this.enPassantedLastTime = false
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
          this.movedTwoLastTime = false
          this.vulnerableToEnPassant = false
          this.enPassantedLastTime = false
          return true
        }

        // en passant
        if (this.enPassantSuccessfulW(newRow, newColumn, board)) {
          this.performEnPassant(newRow, newColumn, board)
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
        this.movedTwoLastTime = false
        this.vulnerableToEnPassant = false
        this.enPassantedLastTime = false
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
        this.movedTwoLastTime = false
        this.vulnerableToEnPassant = false
        this.enPassantedLastTime = false
        return true
      }

      // en passant
      if (this.enPassantSuccessfulB(newRow, newColumn, board)) {
        this.performEnPassant(newRow, newColumn, board)
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
            this.movedTwoLastTime = true
          }
          this.moveSuccess(board, newRow, newColumn)
          this.movedFirstLastTime = true
          this.moved = true
          this.enPassantedLastTime = false
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
        this.movedTwoLastTime = false
        this.moved = true
        this.enPassantedLastTime = false
        return true
      }

      // en passant
      if (this.enPassantSuccessfulW(newRow, newColumn, board)) {
        this.performEnPassant(newRow, newColumn, board)
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
          this.movedTwoLastTime = true
        }
        this.movedFirstLastTime = true
        this.moveSuccess(board, newRow, newColumn)
        this.moved = true
        this.enPassantedLastTime = false
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
      this.movedTwoLastTime = false
      this.moveSuccess(board, newRow, newColumn)
      this.moved = true
      this.enPassantedLastTime = false
      return true
    }

    // en passant
    if (this.enPassantSuccessfulB(newRow, newColumn, board)) {
      this.performEnPassant(newRow, newColumn, board)
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
    if (this.movedTwoLastTime) {
      this.movedTwoLastTime = false
      this.vulnerableToEnPassant = false
    }

    this.board[this.lastRow][this.lastColumn] = this
    if (this.enPassantedLastTime) {
      this.enPassantedLastTime = false

      if (this.getSide() === "white") {
        this.board[this.row + 1][this.column] = pieceEaten
      } else {
        this.board[this.row - 1][this.column] = pieceEaten
      }
      this.board[this.row][this.column] = null
    } else {
      this.board[this.row][this.column] = pieceEaten
    }

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
      return true
    }
  }

  performEnPassant(newRow, newColumn, board) {
    board[this.row][newColumn] = null
    this.moveSuccess(board, newRow, newColumn)
    this.vulnerableToEnPassant = false
    this.moved = true
    this.movedTwoLastTime = false
    this.enPassantedLastTime = true
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
    if (ignoreCheck) {
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
          return false
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
        return false
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
          ) &&
          board[newRow][newColumn]
        ) {
          return true
        }

        // en passant
        if (this.enPassantSuccessfulW(newRow, newColumn, board)) {
          return true
        }
        return false
      }

      // side is black
      if (
        (newRow === this.row + 1 && newColumn === this.column) &&
        !board[newRow][newColumn]
      ) {
        return true
      }
      
      if (
        (newRow === this.row + 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        ) &&
        board[newRow][newColumn]
      ) {
        return true
      }

      // en passant
      if (this.enPassantSuccessfulB(newRow, newColumn, board)) {
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
          return true
        }
      }
      
      if (
        (newRow === this.row - 1 &&
          (newColumn === this.column - 1 || newColumn === this.column + 1)
        ) &&
        board[newRow][newColumn]
      ) {
        return true
      }

      // en passant
      if (this.enPassantSuccessfulW(newRow, newColumn, board)) {
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
        return true
      }
    }
    
    if (
      (newRow === this.row + 1 &&
        (newColumn === this.column - 1 || newColumn === this.column + 1)
      ) &&
      board[newRow][newColumn]
    ) {
      return true
    }

    // en passant
    if (this.enPassantSuccessfulB(newRow, newColumn, board)) {
      return true
    }
    return false
  }
}

module.exports = Pawn