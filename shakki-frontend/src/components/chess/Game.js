import React from "react"
import { useGame, useUser } from "../../utils/stateHooks"
import { Button } from "@material-ui/core"
import Board from "./Board"

const Game = () => {
  const {game, gameLoading, gameError, makeMove, promote} = useGame()
  const { user, userLoading } = useUser()

  if (gameLoading || userLoading) {
    return "loading..."
  }

  if (!game) {
    return gameError.toString()
  }

  const {
    board,
    whitePlayer,
    currentPlayer,
    gameOver,
    winner,
    promotionPlayerID,
  } = game

  return (
    <div>
      <div>
        Olet {user.id === whitePlayer
          ? "valkoiset"
          : "mustat"}. {user.id === currentPlayer
          ? "On sinun vuorosi." : "Odotetaan vastustajan siirtoa."}
      </div>
      <Board
        board={board}
        boardAlignment={user.id === whitePlayer ? "white" : "black"}
        makeMove={makeMove}
      />
      <div>
        {
          user.id === promotionPlayerID
            ?
            <div>
              Valitse nappula, joksi haluat muuttaa sotilaan
              <Button onClick={() => promote("queen")}>
                Kuningatar
              </Button>
              <Button onClick={() => promote("knight")}>
                Ratsu
              </Button>
            </div>
            :
            null
        }
      </div>
      <div>
        {
          gameOver
            ? winner === user.id
              ? "Voitit pelin! Onneksi olkoon!"
              : "Ootko paska ku hävisit :D"
            : null
        }
      </div>
    </div>
  )
}

export default Game