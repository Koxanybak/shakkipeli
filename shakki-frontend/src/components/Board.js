import React from "react"
import { King, Queen, Rook, Knight, Bishop, Pawn, dragged } from "./pieces"
import { SQUARE_HEIGHT, SQUARE_WIDTH, BLACKSQUARE_COLOR, WHITESQUARE_COLOR } from "../globals"

const BOARD_WIDTH = 8
const BOARD_HEIGHT = 8


// a single chess square

const Square = ({ color, children }) => {
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

  const handleDrop = event => {
    event.preventDefault()

    if (event.target.className === "square") {
      event.target.style.backgroundColor = color === "white" ? WHITESQUARE_COLOR : BLACKSQUARE_COLOR
      dragged.parentNode.removeChild(dragged)

      while (event.target.firstChild) {
        event.target.removeChild(event.target.firstChild)
      }

      event.target.appendChild(dragged)
    } else if (event.target.className === "piece") {
      const parent = event.target.parentNode

      parent.style.backgroundColor = parent.id === "white" ? WHITESQUARE_COLOR : BLACKSQUARE_COLOR

      while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
      }

      parent.appendChild(dragged)
    }
  }

  const handleDragEnter = event => {
    if (event.target.className === "square") {
      event.target.style.backgroundColor = "#c948f0"
    } else if (event.target.className === "piece") {
      console.log("isän väri liila")
      event.target.parentNode.style.backgroundColor = "#c948f0"
    }
  }

  const handleDragLeave = event => {
    if (event.target.className === "square") {
      console.log("ruudun väri muuttui normaaliksi")
      if (event.target.id === "white") {
        event.target.style.backgroundColor = WHITESQUARE_COLOR
      } else {
        event.target.style.backgroundColor = BLACKSQUARE_COLOR
      }
    } else if (event.target.className === "piece") {
      if (event.target.parentNode.id === "white") {
        event.target.parentNode.style.backgroundColor = WHITESQUARE_COLOR
      } else {
        event.target.parentNode.style.backgroundColor = BLACKSQUARE_COLOR
      }
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
      {children}
    </td>
  )
}




// Chessboard

const Board = () => {
  const squares = Array.from(Array(BOARD_HEIGHT), (e, i) => {
    const row = new Array(BOARD_WIDTH)

    for (let j = 0; j < BOARD_WIDTH; j++) {
      if ((i + j) % 2 === 0) {
        row[j] = { piece: null, color: "white"}
      } else {
        row[j] = { piece: null, color: "black"}
      }
    }

    return row
  })

  squares[0][0].piece = { type: "rook", side: "black" }
  squares[0][1].piece = { type: "knight", side: "black" }
  squares[0][2].piece = { type: "bishop", side: "black" }
  squares[0][3].piece = { type: "queen", side: "black" }
  squares[0][4].piece = { type: "king", side: "black" }
  squares[0][5].piece = { type: "bishop", side: "black" }
  squares[0][6].piece = { type: "knight", side: "black" }
  squares[0][7].piece = { type: "rook", side: "black" }

  squares[1] = squares[1].map(square => {
    return { ...square, piece: { type: "pawn", side: "black" } }
  })

  squares[7][0].piece = { type: "rook", side: "white" }
  squares[7][1].piece = { type: "knight", side: "white" }
  squares[7][2].piece = { type: "bishop", side: "white" }
  squares[7][3].piece = { type: "queen", side: "white" }
  squares[7][4].piece = { type: "king", side: "white" }
  squares[7][5].piece = { type: "bishop", side: "white" }
  squares[7][6].piece = { type: "knight", side: "white" }
  squares[7][7].piece = { type: "rook", side: "white" }

  squares[6] = squares[6].map(square => {
    return { ...square, piece: { type: "pawn", side: "white" } }
  })

  return (
    <div>
      <table>
        <tbody>
          {squares.map((row, i) => {
            return (
              <tr key={i}>
                {
                  row.map((square, j) => {
                    if (!square.piece) {
                      return <Square key={BOARD_WIDTH * i + j} color={square.color} />
                    }

                    switch(square.piece.type) {
                    case "pawn":
                      return (
                        <Square key={BOARD_WIDTH * i + j} color={square.color}>
                          <Pawn side={square.piece.side} />
                        </Square>
                      )
                    case "rook":
                      return (
                        <Square key={BOARD_WIDTH * i + j} color={square.color}>
                          <Rook side={square.piece.side} />
                        </Square>
                      )
                    case "knight":
                      return (
                        <Square key={BOARD_WIDTH * i + j} color={square.color}>
                          <Knight side={square.piece.side} />
                        </Square>
                      )
                    case "bishop":
                      return (
                        <Square key={BOARD_WIDTH * i + j} color={square.color}>
                          <Bishop side={square.piece.side} />
                        </Square>
                      )
                    case "queen":
                      return (
                        <Square key={BOARD_WIDTH * i + j} color={square.color}>
                          <Queen side={square.piece.side} />
                        </Square>
                      )
                    case "king":
                      return (
                        <Square key={BOARD_WIDTH * i + j} color={square.color}>
                          <King side={square.piece.side} />
                        </Square>
                      )
                    default:
                      return <Square key={BOARD_WIDTH * i + j} color={square.color} />
                    }
                  })
                }
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/*<tr>
            <td>a</td>
            <td>b</td>
            <td>c</td>
            <td>d</td>
            <td>e</td>
            <td>f</td>
            <td>g</td>
            <td>h</td>
          </tr>*/

export default Board