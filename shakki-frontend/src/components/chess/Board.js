import React from "react"
import Square from "./Square"

// Chessboard

const Board = ({ boardAlignment, board, makeMove }) => {

  const dragHelperMap = new Map()
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      dragHelperMap.set(8 * i + j, piece)
    })
  })

  console.log(board)

  const squares = Array.from(Array(8), (e, i) => {
    const row = new Array(8)

    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        row[j] = { piece: null, color: "white"}
      } else {
        row[j] = { piece: null, color: "black"}
      }
    }

    return row
  })

  console.log("squares:", squares)

  return (
    <table onDragStartCapture={e => console.log("why is this dragged:", e.target)}>
      <tbody>
        {boardAlignment === "white" ? board.map((row, i) => {
          return (
            <tr key={i}>
              {
                row.map((piece, j) => {
                  return <Square
                    key={8 * i + j}
                    color={squares[i][j].color}
                    makeMove={makeMove}
                    location={{ row: i, column: j }}
                    piece={piece}
                    dragHelperMap={dragHelperMap}
                  />
                })
              }
            </tr>
          )
        }) : board.map((row, i) => {
          return (
            <tr key={i}>
              {
                row.map((piece, j) => {
                  return <Square
                    key={8 * (7 - i) + (7 - j)}
                    color={squares[7 - i][7 - j].color}
                    makeMove={makeMove}
                    location={{ row: (7 - i), column: (7 - j) }}
                    piece={board[7 - i][7 - j]}
                    dragHelperMap={dragHelperMap}
                  />
                })
              }
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Board