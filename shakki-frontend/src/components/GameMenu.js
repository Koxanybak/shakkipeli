import React, { useState, useEffect } from "react"
import { Button, Link } from "@material-ui/core"
import { useMutation } from "@apollo/client"
import { CREATE_GAME } from "../queries"
import { useUser } from "../utils/stateHooks"

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
      <Button variant="contained" onClick={newGame}>
        Peli linkin kautta
      </Button>
      {link
        ?
        <div>
          Jaa tämä linkki kaverillesi. Sen kautta pääset pelaamaan.{"  "}
          <Link href={link}>
            {link}
          </Link>
        </div>
        :
        null
      }
    </div>
  )
}

export default GameMenu