import React, { useState, useEffect } from "react"
import { Button, Link, Paper, Typography } from "@material-ui/core"
import { useMutation } from "@apollo/client"
import { CREATE_GAME } from "../queries"
import { useUser } from "../utils/stateHooks"
import { WHITESQUARE_COLOR, BLACKSQUARE_COLOR } from "../utils/constants"

const GameMenu = () => {
  const [link, setLink] = useState(null)
  const { user } = useUser()
  const [createGame, createResult] = useMutation(CREATE_GAME, {
    onError: err => {
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
    }
  })

  const newGame = () => {
    if (!user) {
      console.log("Sinun täytyy kirjautua ennen kuin pelaat")
    } else {
      createGame()
    }
  }

  useEffect(() => {
    if (createResult.data) {
      const { id } = createResult.data.createGame
      setLink(`${window.location}/${id}`)
    }
  }, [createResult.data])

  return (
    <div>
      <Paper style={{
        background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
        padding: 10,}}
      >
        {link
          ?
          <React.Fragment>
            <Paper style={{
              background: `linear-gradient(135deg, rgb(${WHITESQUARE_COLOR}), rgb(${BLACKSQUARE_COLOR}))`,
              padding: 10,}}
            >
              Jaa tämä linkki kaverillesi. Sen kautta pääset pelaamaan.{"  "}
              <Link href={link}>
                {link}
              </Link>
            </Paper>
            <Typography variant="subtitle2">
              voit myös kirjautua sisään ja kutsua kaverisi peliin profiilivalikosta.
            </Typography>
          </React.Fragment>
          :
          <React.Fragment>
            <Button variant="contained" onClick={newGame}>
              Peli linkin kautta
            </Button>
            <Typography variant="subtitle2">
              tai kirjaudu sisään ja kutsu kaverisi peliin profiilivalikosta.
            </Typography>
          </React.Fragment>
        }
      </Paper>
    </div>
  )
}

export default GameMenu