import React from "react"
import { useUser } from "../../utils/stateHooks"
import { Button, Paper, makeStyles } from "@material-ui/core"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../../utils/constants"

const useStyles = makeStyles({
  turnText: {
    background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
    padding: 10,
    height: "8vh",
    width: "40vh",
    textAlign: "center"
  }
})

const GameText = ({game: { check, currentPlayer, gameOver, promotionPlayerID, winner }, promote }) => {
  const { user, userLoading } = useUser()
  const classes = useStyles()

  if (userLoading) {
    return "loading..."
  }

  return (
    <div className="gameText">
      {user.id === currentPlayer && !gameOver
        ? 
        <Paper className={classes.turnText}>
          <h2>
            On sinun vuorosi. {check && check.threatenedPlayer === user.id
              ? "Shakki!"
              : null}
          </h2>
        </Paper>
        :
        <Paper className={classes.turnText}>
          Odotetaan vastustajan siirtoa. {check && check.threatenedPlayer !== user.id
            ? "Shakki!"
            : null}
        </Paper>}
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