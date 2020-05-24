import React, { useState, useEffect, useMemo } from "react"
import {
  SQUARE_SIZE,
  BLACKSQUARE_COLOR,
  WHITESQUARE_COLOR,
  HIGHLIGHTED_COLOR,
} from "../../utils/constants"
import { King, Queen, Rook, Knight, Bishop, Pawn } from "./pieces"

// a single chess square

const Square = ({ color, makeMove, location, piece, dragHelperMap, id, highlight }) => {
  const specificColor = useMemo(() => `rgb(${color === "white" ? WHITESQUARE_COLOR : BLACKSQUARE_COLOR})`, [color])
  const [squareColor, setSquareColor] = useState(specificColor)
  useEffect(() => {
    if (highlight) {
      setSquareColor(`rgb(${HIGHLIGHTED_COLOR})`)
    } else {
      setSquareColor(specificColor)
    }
  }, [highlight, specificColor])

  //squarestyles
  const squareStyle = {
    height: SQUARE_SIZE,
    width: SQUARE_SIZE,
    backgroundColor: squareColor,
    textAlign: "center",
    background: `radial-gradient(${squareColor}, ${specificColor})`,
  }
  //console.log(squareStyle)


  // drop handlers

  /* const handleDrop = async event => {
    event.preventDefault()

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
      setSquareColor(specificColor)
    } else if (event.target.className === "piece") {
      setSquareColor(specificColor)
    }

    try {
      const res = await makeMove({ piece, oldLocation, newLocation })
      if (!res.data.makeMove.lastMove.success) {
        console.log(res.data.makeMove.lastMove.message)
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }

  const handleDragEnter = event => {
    if (event.target.className === "square") {
      setSquareColor(HIGHLIGHTED_COLOR)
    } else if (event.target.className === "piece") {
      setSquareColor(HIGHLIGHTED_COLOR)
    }
  }

  const handleDragLeave = event => {
    if (event.target.className === "square" && event.relatedTarget.className !== "piece") {
      if (event.target.id === "white") {
        setSquareColor(specificColor)
      } else {
        setSquareColor(specificColor)
      }
    } else if (event.target.className === "piece" && event.relatedTarget.className !== "square") {
      if (event.target.parentNode.id === "white") {
        setSquareColor(specificColor)
      } else {
        setSquareColor(specificColor)
      }
    }
  } */

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
  if (pieceToRender) {
    return (
      <td
        id={id}
        style={squareStyle}
        className="square"
        /* onDragLeave={handleDragLeave} */
        /* onDragOver={event => {event.preventDefault()}} */
        /* onDrop={handleDrop}
        onDragEnter={handleDragEnter} */
      >
        {pieceToRender}
      </td>
    )
  }
  return (
    <td
      id={id}
      style={squareStyle}
      className="square"
      /* onDragLeave={handleDragLeave}
      onDragOver={event => {event.preventDefault()}} */
      /* onDrop={handleDrop}
      onDragEnter={handleDragEnter} */
    />
  )
}

export default Square