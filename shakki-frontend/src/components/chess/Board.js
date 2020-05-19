import React from "react"
import Square from "./Square"

// Chessboard

const Board = ({ boardAlignment, board, makeMove, handleClick, chosenPiece }) => {

  const dragHelperMap = new Map()
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      dragHelperMap.set(8 * i + j, piece)
    })
  })

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

  //console.log(chosenPiece)

  return (
    <table className="board" onClick={handleClick}>
      <tbody>
        {boardAlignment === "white" ? board.map((row, i) => {
          return (
            <tr key={i}>
              {
                row.map((piece, j) => {
                  let highlight = false
                  if (chosenPiece) {
                    chosenPiece.availableMoves.forEach(move => {
                      if (move.newLocation.row === i && move.newLocation.column === j) {
                        highlight = true
                      }
                    })
                    if (chosenPiece.location.row === i && chosenPiece.location.column === j) {
                      highlight = true
                    }
                  }
                  return <Square
                    key={8 * i + j}
                    id={8 * i + j}
                    color={squares[i][j].color}
                    makeMove={makeMove}
                    location={{ row: i, column: j }}
                    piece={piece}
                    dragHelperMap={dragHelperMap}
                    highlight={highlight}
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
                  let highlight = false
                  if (chosenPiece) {
                    chosenPiece.availableMoves.forEach(move => {
                      if (move.newLocation.row === 7 - i && move.newLocation.column === 7 - j) {
                        highlight = true
                      }
                    })
                    if (chosenPiece.location.row === 7 - i && chosenPiece.location.column === 7 - j) {
                      highlight = true
                    }
                  }
                  return <Square
                    key={8 * (7 - i) + (7 - j)}
                    id={8 * (7 - i) + (7 - j)}
                    color={squares[7 - i][7 - j].color}
                    makeMove={makeMove}
                    location={{ row: (7 - i), column: (7 - j) }}
                    piece={board[7 - i][7 - j]}
                    dragHelperMap={dragHelperMap}
                    highlight={highlight}
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