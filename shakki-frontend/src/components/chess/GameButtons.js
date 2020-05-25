import React, { useState } from "react"
import { Paper, Button, Typography } from "@material-ui/core"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../../utils/constants"

const GameButtons = ({ skipTurn, disabled }) => {
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)

  const style = {
    background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
    padding: "20px",
  }

  return (
    <Paper style={style}>
      {showSkipConfirm
        ?
        <div>
          <Typography variant="subtitle2">
            Vahvista ohitus?
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              skipTurn()
              setShowSkipConfirm(false)
            }}
            disabled={disabled}
          >
            Ohita
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setShowSkipConfirm(false)
            }}
          >
            Peruuta
          </Button>
        </div>
        :
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowSkipConfirm(true)}
          disabled={disabled}
        >
          Ohita vuoro
        </Button>
      }
    </Paper>
  )
}

export default GameButtons