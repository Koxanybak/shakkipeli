import { GET_GAME } from "../queries"
import { useApolloClient } from "@apollo/client"

export const updateGameState = (newGameData, client, gameId) => {
  let gameInStore = client.readQuery({ query: GET_GAME, variables: { gameId } })
  gameInStore = { getGame: newGameData.moveMade }

  console.log("newGameData:", newGameData)
  client.writeQuery({
    query: GET_GAME,
    data: gameInStore,
    variables: { gameId }
  })
  console.log("Game state updated with:",client.readQuery({
    query: GET_GAME,
    variables: { gameId }
  }))
}

export const useGame = (gameId) => {
  const client = useApolloClient()

  return client.readQuery({ query: GET_GAME, variables: { gameId } }).getGame.id
}