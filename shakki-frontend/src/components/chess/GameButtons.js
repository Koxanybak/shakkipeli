import React from "react"
import { Paper, Button } from "@material-ui/core"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../../utils/constants"

const GameButtons = ({ skipTurn, disabled }) => {
  const style = {
    background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
    padding: "20px",
  }

  return (
    <Paper style={style}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => skipTurn()}
        disabled={disabled}
      >
        Ohita vuoro
      </Button>
    </Paper>
  )
}

export default GameButtons