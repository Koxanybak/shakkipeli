import React, { useState } from "react"
import { useGame, useUser } from "../../utils/stateHooks"
import { handleApolloError } from "../../utils/errorHandlers"
import Board from "./Board"
import GameText from "./GameText"
import LastMove from "./LastMove"
import { isNotValid, isValidPiece } from "./gameUtils"
import { Grid, makeStyles, CircularProgress } from "@material-ui/core"
import GameButtons from "./GameButtons"

const useStyles = makeStyles({
  game: {
    //overflowY: "scroll",
  }
})

const Game = () => {
  const {game, gameLoading, gameError, makeMove, promote, skipTurn } = useGame()
  const { user, userLoading } = useUser()
  const [pieceToMove, setPieceToMove] = useState(null)
  const classes = useStyles()

  if (gameLoading || userLoading) {
    return <CircularProgress />
  }
  if (!game) {
    return gameError.toString()
  }
  const {
    board,
    whitePlayer,
    moveHistory,
    currentPlayer,
    promotionPlayerID,
    check,
    blackPlayer,
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
        /* console.log("piece to move set") */
      }

      // the user clicked on a square
    } else if (clickedElem.className === "square") {
      const clickedPieceElem = clickedElem.firstChild
      let clickedPiece
      if (clickedPieceElem) {
        clickedPiece = board[Math.floor(Number(clickedPieceElem.id) / 8)][Number(clickedPieceElem.id) % 8]
      }

      /* console.log("clicked on a square") */

      if (pieceToMove) {
        //console.log(clickedElem)
        if (isNotValid({
          squareNode: clickedElem,
          pieceToMove,
          clickedPiece,
          user,
          game,
        })) {
          /* console.log("was not valid") */
          setPieceToMove(null)
          return
        }

        const piece = { type: pieceToMove.type, side: pieceToMove.side }
        const oldLocation = { row: pieceToMove.location.row, column: pieceToMove.location.column }
        const newLocation = { row: Math.floor(Number(clickedElem.id) / 8), column: Number(clickedElem.id) % 8 }
        /* console.log("trying to make move") */

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
    <Grid
      container
      direction="row"
      //alignItems="baseline"
      justify="center"
      className={classes.game}
      spacing={2}
      wrap="wrap"
    >
      <Grid item xs={3} lg={2}>
        <GameButtons
          skipTurn={skipTurn}
          disabled={
            (user.id !== currentPlayer || promotionPlayerID !== null) || 
            (check !== null || (whitePlayer === null || blackPlayer === null))
          }
        />
      </Grid>
      <Grid
        container
        item
        xs={10}
        lg={6}
        direction="column"
        alignItems="center"
        //wrap="wrap"
      >
        <Board
          board={board}
          boardAlignment={user.id === whitePlayer ? "white" : "black"}
          makeMove={makeMove}
          handleClick={handleClick}
          chosenPiece={pieceToMove}
        />
        <GameText game={game} promote={promote} />
      </Grid>
      <Grid item xs={3} lg={3}>
        <LastMove moveHistory={moveHistory} />
      </Grid>
    </Grid>
  )
}

export default Game