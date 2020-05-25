import React from "react"
import Square from "./Square"
import { SQUARE_SIZE } from "../../utils/constants"

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

  const boardStyle = {
    height: SQUARE_SIZE * 8,
    width: SQUARE_SIZE * 8,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "2px",
    background: "cyan",
  }

  //conschece)osenol.log(ePi

  return (
    <table
      className="board"
      onClick={handleClick}
      cellSpacing="0"
      style={boardStyle}
    >
      <tbody>
        {boardAlignment === "white" ? board.map((row, i) => {
          return (
            <tr key={i}>
              <td>{8 - i}</td>
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
              <td>{i + 1}</td>
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
        {boardAlignment === "white" 
          ?
          <tr>
            <td></td>
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
            <td>H</td>
          </tr>
          :
          <tr>
            <td></td>
            <td>H</td>
            <td>G</td>
            <td>F</td>
            <td>E</td>
            <td>D</td>
            <td>C</td>
            <td>B</td>
            <td>A</td>
          </tr>
        }
      </tbody>
    </table>
  )
}

export default Board