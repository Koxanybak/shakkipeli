import React from "react"
import {
  SQUARE_HEIGHT,
  SQUARE_WIDTH,
  BLACKSQUARE_COLOR,
  WHITESQUARE_COLOR,
  HIGHLIGHTED_COLOR,
} from "../../globals"
import { King, Queen, Rook, Knight, Bishop, Pawn, dragged } from "./pieces"

// a single chess square

const Square = ({ color, makeMove, location, piece, dragHelperMap }) => {

  //squarestyles
  const white = {
    height: SQUARE_HEIGHT,
    width: SQUARE_WIDTH,
    backgroundColor: WHITESQUARE_COLOR,
    textAlign: "center",
  }
  const black = {
    height: SQUARE_HEIGHT,
    width: SQUARE_WIDTH,
    backgroundColor: BLACKSQUARE_COLOR,
    textAlign: "center",
  }



  // drop handlers

  const handleDrop = async event => {
    event.preventDefault()

    console.log("dragged:", dragged)

    const piece = {
      type: dragHelperMap.get(Number(dragged.id)).type,
      side: dragHelperMap.get(Number(dragged.id)).side
    }
    const oldLocation = {
      row: Math.floor(Number(dragged.id) / 8),
      column: Number(dragged.id) % 8
    }
    const newLocation = location

    if (event.target.className === "square") {
      event.target.style.backgroundColor = color === "white" ? WHITESQUARE_COLOR : BLACKSQUARE_COLOR
    } else if (event.target.className === "piece") {
      const parent = event.target.parentNode

      parent.style.backgroundColor = parent.id === "white" ? WHITESQUARE_COLOR : BLACKSQUARE_COLOR
    }

    try {
      const res = await makeMove({
        variables: { move: { piece, oldLocation, newLocation } }
      })
      if (!res.data.makeMove.lastMove.success) {
        console.log(res.data.makeMove.lastMove.message)
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }

  const handleDragEnter = event => {
    if (event.target.className === "square") {
      event.target.style.backgroundColor = HIGHLIGHTED_COLOR
    } else if (event.target.className === "piece") {
      event.target.parentNode.style.backgroundColor = HIGHLIGHTED_COLOR
    }
  }

  const handleDragLeave = event => {
    if (event.target.className === "square" && event.relatedTarget.className !== "piece") {
      if (event.target.id === "white") {
        event.target.style.backgroundColor = WHITESQUARE_COLOR
      } else {
        event.target.style.backgroundColor = BLACKSQUARE_COLOR
      }
    } else if (event.target.className === "piece" && event.relatedTarget.className !== "square") {
      if (event.target.parentNode.id === "white") {
        event.target.parentNode.style.backgroundColor = WHITESQUARE_COLOR
      } else {
        event.target.parentNode.style.backgroundColor = BLACKSQUARE_COLOR
      }
    }
  }

  let pieceToRender

  if (piece) {
    switch(piece.type) {

    case "pawn":
      pieceToRender = <Pawn side={piece.side} id={8 * location.row + location.column} />
      break
    case "rook":
      pieceToRender = <Rook side={piece.side} id={8 * location.row + location.column} />
      break
    case "knight":
      pieceToRender = <Knight side={piece.side} id={8 * location.row + location.column} />
      break
    case "bishop":
      pieceToRender = <Bishop side={piece.side} id={8 * location.row + location.column} />
      break
    case "queen":
      pieceToRender = <Queen side={piece.side} id={8 * location.row + location.column} />
      break
    case "king":
      pieceToRender = <King side={piece.side} id={8 * location.row + location.column} />
      break
    default:
      pieceToRender = null
    }
  }


  //---------------------------------

  return (
    <td
      id={color === "white" ? "white" : "black"}
      style={color === "white" ? white : black}
      className="square"
      onDragLeave={handleDragLeave}
      onDragOver={event => {event.preventDefault()}}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
    >
      {pieceToRender}
    </td>
  )
}

export default Square