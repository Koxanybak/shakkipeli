import React, { useState, useEffect } from "react"
import { useUser } from "../../utils/stateHooks"
import { Button, Paper, makeStyles, Typography } from "@material-ui/core"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../../utils/constants"

const useStyles = makeStyles({
  turnText: {
    background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
    padding: 10,
    height: "8vh",
    width: "40vh",
    textAlign: "center",
  }
})

const GameText = ({game: { check, currentPlayer, gameOver, promotionPlayerID, winner, blackPlayer }, promote }) => {
  const { user, userLoading } = useUser()
  const [text, setText] = useState("Odotetaan, että vastustaja liityy peliin.")
  const [emphasize, setEmphasize] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if (user) {
      if (!blackPlayer) {
        setEmphasize(false)
        setText("Odotetaan, että vastustaja liityy peliin.")
      } else if (!gameOver) {
        if (user.id === currentPlayer) {
          if (check && check.threatenedPlayer === user.id) {
            setText("On sinun vuorosi. Shakki!")
          } else {
            setText("On sinun vuorosi.")
          }
          setEmphasize(true)
        } else {
          if (check && check.threatenedPlayer !== user.id) {
            setText("Odotetaan vastustajan siirtoa. Shakki!")
          } else {
            setText("Odotetaan vastustajan siirtoa.")
          }
          setEmphasize(false)
        }
      } else {
        if (winner === user.id) {
          setText("Voitit pelin! Onneksi olkoon!")
        } else {
          setText("Ootko paska ku hävisit :D")
        }
        setEmphasize(true)
      }
    }
  }, [setText, blackPlayer, gameOver, currentPlayer, user, winner, check])

  if (userLoading) {
    return "loading..."
  }

  return (
    <div className="gameText">
      <Paper className={classes.turnText}>
        <Typography variant={emphasize ? "h4" : "subtitle1"}>
          {text}
        </Typography>
      </Paper>
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
    </div>
  )
}

export default GameText