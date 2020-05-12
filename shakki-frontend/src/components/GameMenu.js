import React, { useState, useContext, useEffect } from "react"
import { Button, Link } from "@material-ui/core"
import { UserContext } from "../utils/context"
//import { baseUrl } from "../utils/constants"
import { useMutation } from "@apollo/client"
import { CREATE_GAME } from "../queries"

const GameMenu = () => {
  const [link, setLink] = useState(null)
  const { user } = useContext(UserContext)
  //const { setGame } = useContext(GameContext)
  const [createGame, createResult] = useMutation(CREATE_GAME, {
    onError: err => {
      //console.log(err.graphQlErrors[0].message)
      console.log(err.message)
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
      <Button onClick={newGame}>
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