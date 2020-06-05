import React, { useState } from "react"
import { Paper, Button, Typography, CircularProgress } from "@material-ui/core"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../../utils/constants"
import { useQuery } from "@apollo/client"
import { GET_USER_BY_ID } from "../../queries"
import { handleApolloError } from "../../utils/errorHandlers"

const GameButtons = ({ skipTurn, disabled, opponentId }) => {
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const { data: opponentData, error: opponentError, loading: opponentLoading } = useQuery(GET_USER_BY_ID, {
    variables: { userId: opponentId },
    onError: err => {
      handleApolloError(err)
    }
  })

  const style = {
    background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
    padding: "20px",
    textAlign: "center"
  }

  /* console.log("opponentId:", opponentId)
  console.log("opponentData:", opponentData)
  console.log("opponentError:", opponentError)
  console.log("opponentLoading:", opponentLoading) */

  return (
    <Paper style={style}>
      {opponentId
        ?
        (opponentData && !opponentError && !opponentLoading)
          ?
          <Typography style={{ marginBottom: 20 }}>
            Vastustajana <strong>{opponentData.getUserById.tag}</strong>
          </Typography>
          :
          <CircularProgress />
        :
        <Typography style={{ marginBottom: 20 }}>
          Odotetaan vastustajan liittymistä
        </Typography>
      }
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