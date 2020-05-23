import React, { useState } from "react"
import { useGame, useUser } from "../../utils/stateHooks"
import { handleApolloError } from "../../utils/errorHandlers"
import Board from "./Board"
import GameText from "./GameText"
import MoveHistory from "./MoveHistory"
import { isNotValid, isValidPiece } from "./gameUtils"
import { Grid } from "@material-ui/core"

const Game = () => {
  const {game, gameLoading, gameError, makeMove, promote} = useGame()
  const { user, userLoading } = useUser()
  const [pieceToMove, setPieceToMove] = useState(null)

  if (gameLoading || userLoading) {
    return "loading..."
  }
  if (!game) {
    return gameError.toString()
  }
  const {
    board,
    whitePlayer,
    moveHistory,
  } = game

  // handles a click on a piece or a square
  const handleClick = async event => {
    event.preventDefault()

    let clickedElem = event.target

    // the user clicked on a piece
    if (clickedElem.className === "piece") {
      const clickedPiece = board[Math.floor(Number(clickedElem.id) / 8)][Number(clickedElem.id) % 8]

      if (pieceToMove) {
        if (isNotValid({
          squareNode: clickedElem.parentNode,
          pieceToMove,
          clickedPiece,
          user,
          game,
        })) {
          setPieceToMove(null)
          return
        }

        const piece = { type: pieceToMove.type, side: pieceToMove.side }
        const oldLocation = { row: pieceToMove.location.row, column: pieceToMove.location.column }
        const newLocation = { row: clickedPiece.location.row, column: clickedPiece.location.column }

        try {
          const res = await makeMove({ piece, oldLocation, newLocation })
          if (!res.data.makeMove.lastMove.success) {
            console.log(res.data.makeMove.lastMove.message)
          }
        } catch (exception) {
          handleApolloError(exception)
        }
        setPieceToMove(null)
      } else if (isValidPiece({ clickedPiece, game, user })){
        /* console.log("clickedPiece:", clickedPiece) */
        setPieceToMove(clickedPiece)
      }

      // the user clicked on a square
    } else if (clickedElem.className === "square") {
      const clickedPieceElem = clickedElem.firstChild
      let clickedPiece
      if (clickedPieceElem) {
        clickedPiece = board[Math.floor(Number(clickedPieceElem.id) / 8)][Number(clickedPieceElem.id) % 8]
      }

      if (pieceToMove) {
        //console.log(clickedElem)
        if (isNotValid({
          squareNode: clickedElem,
          pieceToMove,
          clickedPiece,
          user,
          game,
        })) {
          setPieceToMove(null)
          return
        }

        const piece = { type: pieceToMove.type, side: pieceToMove.side }
        const oldLocation = { row: pieceToMove.location.row, column: pieceToMove.location.column }
        const newLocation = { row: Math.floor(Number(clickedElem.id) / 8), column: Number(clickedElem.id) % 8 }

        try {
          const res = await makeMove({ piece, oldLocation, newLocation })
          if (!res.data.makeMove.lastMove.success) {
            console.log(res.data.makeMove.lastMove.message)
          }
        } catch (exception) {
          handleApolloError(exception)
        }
        setPieceToMove(null)
      } else if (clickedPiece && isValidPiece({ clickedPiece, game, user })) {
        setPieceToMove(clickedPiece)
      }

    } else {
      setPieceToMove(null)
    }
  }

  /* console.log("game rendered with board being:", board) */


  return (
    <div className="game">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid
          container
          direction="row"
          justify="center"
        >
          <Board
            board={board}
            boardAlignment={user.id === whitePlayer ? "white" : "black"}
            makeMove={makeMove}
            handleClick={handleClick}
            chosenPiece={pieceToMove}
          />
          <MoveHistory moveHistory={moveHistory} />
        </Grid>
        <GameText game={game} promote={promote} />
      </Grid>
    </div>
  )
}

export default Game