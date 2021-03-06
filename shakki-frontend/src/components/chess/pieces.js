import React, { useState } from "react"
//import { SQUARE_HEIGHT, SQUARE_WIDTH } from "../globals"
import blackKing from "../../sprites/blackking.svg"
import blackQueen from "../../sprites/blackqueen.svg"
import blackRook from "../../sprites/blackrook.svg"
import blackBishop from "../../sprites/blackbishop.svg"
import blackKnight from "../../sprites/blackknight.svg"
import blackPawn from "../../sprites/blackpawn.svg"
import whiteKing from "../../sprites/whiteking.svg"
import whiteQueen from "../../sprites/whitequeen.svg"
import whiteRook from "../../sprites/whiterook.svg"
import whiteBishop from "../../sprites/whitebishop.svg"
import whiteKnight from "../../sprites/whiteknight.svg"
import whitePawn from "../../sprites/whitepawn.svg"

/* const BLACK_COLOR = "#000000"
const WHITE_COLOR = "#ffffff" */

const pieceStyle = {
  width: 65,
  height: 65,
  //display: "table-cell",
  verticalAlign: "middle",
}
export const getImgSrc = (type, side) => {
  if (type === "king" && side === "black") {
    return blackKing
  } else if (type === "queen" && side === "black") {
    return blackQueen
  } else if (type === "bishop" && side === "black") {
    return blackBishop
  } else if (type === "rook" && side === "black") {
    return blackRook
  } else if (type === "knight" && side === "black") {
    return blackKnight
  } else if (type === "pawn" && side === "black") {
    return blackPawn
  } else if (type === "king" && side === "white") {
    return whiteKing
  } else if (type === "queen" && side === "white") {
    return whiteQueen
  } else if (type === "bishop" && side === "white") {
    return whiteBishop
  } else if (type === "rook" && side === "white") {
    return whiteRook
  } else if (type === "knight" && side === "white") {
    return whiteKnight
  } else if (type === "pawn" && side === "white") {
    return whitePawn
  }
}

let dragged



// functionality of a piece

const Piece = ({ style, id, side, type }) => {
  const [opacity,/*  setOpacity */] = useState(1)

  /* const handleDragStart = event => {
    // dragged määritellään
    dragged = event.target
    setOpacity(0.5)
    console.log("dragged:", dragged)
  }

  const handleDragEnd = event => {
    setOpacity(1)
  } */


  return (
    <img
      style={{ ...style, opacity }}
      className="piece"
      draggable="false"
      /* onDragStart={handleDragStart}
      onDragEnd={handleDragEnd} */
      type={id}
      side={side}
      id={id}
      src={getImgSrc(type, side)}
      alt="sprite"
    >
    </img>
  )
}




// pieces

const King = ({ side, id }) => {
  const kingStyle = { ...pieceStyle }

  return (
    <Piece style={kingStyle} id={id} side={side} type="king">
      K
    </Piece>
  )
}

const Queen = ({ side, id }) => {
  const queenStyle = { ...pieceStyle }

  return (
    <Piece style={queenStyle} id={id} side={side} type="queen">
      D
    </Piece>
  )
}

const Rook = ({ side, id }) => {
  const rookStyle = { ...pieceStyle }

  return (
    <Piece style={rookStyle} id={id} side={side} type="rook">
      T
    </Piece>
  )
}

const Knight = ({ side, id }) => {
  const knightStyle = { ...pieceStyle }

  return (
    <Piece style={knightStyle} id={id} side={side} type="knight">
      R
    </Piece>
  )
}

const Bishop = ({ side, id }) => {
  const bishopStyle = { ...pieceStyle }

  return (
    <Piece style={bishopStyle} id={id} side={side} type="bishop">
      L
    </Piece>
  )
}

const Pawn = ({ side, id }) => {
  const pawnStyle = { ...pieceStyle }

  return (
    <Piece style={pawnStyle} id={id} side={side} type="pawn">
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