import React from "react"
import { useUser } from "../../utils/stateHooks"
import { Button } from "@material-ui/core"

const GameText = ({game: { check, currentPlayer, gameOver, promotionPlayerID, winner }, promote }) => {
  const { user, userLoading } = useUser()

  if (userLoading) {
    return "loading..."
  }

  return (
    <div className="gameText">
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

export default GameText