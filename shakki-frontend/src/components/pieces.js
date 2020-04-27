import React from "react"
//import { SQUARE_HEIGHT, SQUARE_WIDTH } from "../globals"

const BLACK_COLOR = "#8f8c8d"
const WHITE_COLOR = "#ffffff"

let dragged



// functionality of a piece

const Piece = ({ style, children }) => {
  const handleDragStart = event => {
    dragged = event.target
    event.target.style.opacity = 0.5
  }

  const handleDragEnd = event => {
    event.target.style.opacity = 1
  }

  return (
    <div
      style={style}
      className="piece"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </div>
  )
}




// pieces

const King = ({ side }) => {
  const kingStyle = {
    width: "auto",
    height: "auto",
    display: "table-cell",
    verticalAlign: "middle",
    backgroundColor: side === "black" ? BLACK_COLOR : WHITE_COLOR
  }

  return (
    <Piece style={kingStyle}>
      K
    </Piece>
  )
}

const Queen = ({ side }) => {
  const queenStyle = {
    width: "auto",
    height: "auto",
    display: "table-cell",
    verticalAlign: "middle",
    backgroundColor: side === "black" ? BLACK_COLOR : WHITE_COLOR
  }

  return (
    <Piece style={queenStyle}>
      Q
    </Piece>
  )
}

const Rook = ({ side }) => {
  const rookStyle = {
    width: "auto",
    height: "auto",
    display: "table-cell",
    verticalAlign: "middle",
    backgroundColor: side === "black" ? BLACK_COLOR : WHITE_COLOR
  }

  return (
    <Piece style={rookStyle}>
      R
    </Piece>
  )
}

const Knight = ({ side }) => {
  const knightStyle = {
    width: "auto",
    height: "auto",
    display: "table-cell",
    verticalAlign: "middle",
    backgroundColor: side === "black" ? BLACK_COLOR : WHITE_COLOR
  }

  return (
    <Piece style={knightStyle}>
      Kn
    </Piece>
  )
}

const Bishop = ({ side }) => {
  const bishopStyle = {
    width: "auto",
    height: "auto",
    display: "table-cell",
    verticalAlign: "middle",
    backgroundColor: side === "black" ? BLACK_COLOR : WHITE_COLOR
  }

  return (
    <Piece style={bishopStyle}>
      B
    </Piece>
  )
}

const Pawn = ({ side }) => {
  const pawnStyle = {
    width: "auto",
    height: "auto",
    display: "table-cell",
    verticalAlign: "middle",
    backgroundColor: side === "black" ? BLACK_COLOR : WHITE_COLOR
  }

  return (
    <Piece style={pawnStyle}>
      P
    </Piece>
  )
}

Piece.displayName = "Piece"
King.displayName = "King"
Queen.displayName = "Queen"
Rook.displayName = "Rook"
Knight.displayName = "Knight"
Bishop.displayName = "Bishop"
Pawn.displayName = "Pawn"

export { King, Queen, Rook, Knight, Bishop, Pawn, dragged }