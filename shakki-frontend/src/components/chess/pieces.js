import React from "react"
//import { SQUARE_HEIGHT, SQUARE_WIDTH } from "../globals"

const BLACK_COLOR = "#000000"
const WHITE_COLOR = "#ffffff"

const pieceStyle = {
  width: 45,
  height: 45,
  display: "table-cell",
  verticalAlign: "middle",
}

let dragged



// functionality of a piece

const Piece = ({ style, children, id, side }) => {
  const handleDragStart = event => {
    // dragged määritellään
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
      type={id}
      side={side}
      id={id}
    >
      {children}
    </div>
  )
}




// pieces

const King = ({ side, id }) => {
  const kingStyle = { ...pieceStyle }
  kingStyle.backgroundColor = side === "black" ? BLACK_COLOR : WHITE_COLOR
  kingStyle.color = side === "white" ? BLACK_COLOR : WHITE_COLOR

  return (
    <Piece style={kingStyle} id={id} side={side}>
      K
    </Piece>
  )
}

const Queen = ({ side, id }) => {
  const queenStyle = { ...pieceStyle }
  queenStyle.backgroundColor = side === "black" ? BLACK_COLOR : WHITE_COLOR
  queenStyle.color = side === "white" ? BLACK_COLOR : WHITE_COLOR

  return (
    <Piece style={queenStyle} id={id} side={side}>
      D
    </Piece>
  )
}

const Rook = ({ side, id }) => {
  const rookStyle = { ...pieceStyle }
  rookStyle.backgroundColor = side === "black" ? BLACK_COLOR : WHITE_COLOR
  rookStyle.color = side === "white" ? BLACK_COLOR : WHITE_COLOR

  return (
    <Piece style={rookStyle} id={id} side={side}>
      T
    </Piece>
  )
}

const Knight = ({ side, id }) => {
  const knightStyle = { ...pieceStyle }
  knightStyle.backgroundColor = side === "black" ? BLACK_COLOR : WHITE_COLOR
  knightStyle.color = side === "white" ? BLACK_COLOR : WHITE_COLOR

  return (
    <Piece style={knightStyle} id={id} side={side}>
      R
    </Piece>
  )
}

const Bishop = ({ side, id }) => {
  const bishopStyle = { ...pieceStyle }
  bishopStyle.backgroundColor = side === "black" ? BLACK_COLOR : WHITE_COLOR
  bishopStyle.color = side === "white" ? BLACK_COLOR : WHITE_COLOR

  return (
    <Piece style={bishopStyle} id={id} side={side}>
      L
    </Piece>
  )
}

const Pawn = ({ side, id }) => {
  const pawnStyle = { ...pieceStyle }
  pawnStyle.backgroundColor = side === "black" ? BLACK_COLOR : WHITE_COLOR
  pawnStyle.color = side === "white" ? BLACK_COLOR : WHITE_COLOR

  return (
    <Piece style={pawnStyle} id={id} side={side}>
      S
    </Piece>
  )
}

/*Piece.displayName = "Piece"
King.displayName = "King"
Queen.displayName = "Queen"
Rook.displayName = "Rook"
Knight.displayName = "Knight"
Bishop.displayName = "Bishop"
Pawn.displayName = "Pawn"*/

export { King, Queen, Rook, Knight, Bishop, Pawn, dragged }