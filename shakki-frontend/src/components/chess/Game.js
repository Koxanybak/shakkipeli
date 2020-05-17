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
    check,
  } = game

  return (
    <div>
      <div>
        Olet {user.id === whitePlayer
          ? "valkoiset"
          : "mustat"}.
      </div>
      <Board
        board={board}
        boardAlignment={user.id === whitePlayer ? "white" : "black"}
        makeMove={makeMove}
      />
      {user.id === currentPlayer && !gameOver
        ? 
        <h3>
          On sinun vuorosi. {check && check.threatenedPlayer === user.id
            ? "Shakki!"
            : null}
        </h3>
        :
        <div>
          Odotetaan vastustajan siirtoa. {check && check.threatenedPlayer !== user.id
            ? "Shakki!"
            : null}
        </div>}
      <div>
        {
          user.id === promotionPlayerID
            ?
            <div>
              Valitse nappula, joksi haluat muuttaa sotilaan{" "}
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
      <h3>
        {
          gameOver
            ? winner === user.id
              ? "Voitit pelin! Onneksi olkoon!"
              : "Ootko paska ku hävisit :D"
            : null
        }
      </h3>
    </div>
  )
}

export default Game