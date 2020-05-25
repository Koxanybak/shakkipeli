import { useEffect, useCallback, useState } from "react"
import { useQuery, useMutation, useSubscription, useApolloClient, useLazyQuery } from "@apollo/client"
import {
  GET_GAME,
  MAKE_MOVE,
  GAME_STATE_UPDATED,
  JOIN_GAME, PROMOTE,
  GET_LOGGED_USER,
  SKIP_TURN,
} from "../queries"
import { useParams } from "react-router-dom"
import { handleApolloError } from "./errorHandlers"

// hook that gets the game state
export const useGame = () => {
  const client = useApolloClient()
  const { id } = useParams()

  const setGame = newGameData => {
    let gameDataInStore = client.readQuery({ query: GET_GAME, variables: { gameId: id } })
    gameDataInStore = { getGame: newGameData.gameStateUpdated }
  
    /* console.log("newGameData:", newGameData)
    console.log("gameState tobe:", gameDataInStore) */
    client.writeQuery({
      query: GET_GAME,
      data: gameDataInStore,
      variables: { id }
    })
    /* console.log("Game state updated with:", client.readQuery({
      query: GET_GAME,
      variables: { id }
    })) */
  }

  const initialResult = useQuery(GET_GAME, {
    variables: { gameId: id },
    onError: err => {
      handleApolloError(err)
    },
  })
  const [makeMove] = useMutation(MAKE_MOVE)
  const [promote] = useMutation(PROMOTE)
  const [skipTurn] = useMutation(SKIP_TURN, {
    variables: { gameId: id },
    onError: err => {
      handleApolloError(err)
    }
  })
  const [joinGame] = useMutation(JOIN_GAME, {
    variables: { gameId: id },
    onError: err => {
      handleApolloError(err)
    },
    onCompleted: data => {
      setGame(data)
    }
  })

  useSubscription(GAME_STATE_UPDATED, {
    onSubscriptionData: ({ subscriptionData }) => {
      setGame(subscriptionData.data)
      /* console.log("subscriptionBoard",subscriptionData.data.gameStateUpdated.board) */
      /* console.log(subscriptionData.data.gameStateUpdated.moveHistory) */
    },
    variables: { gameId: id }
  })

  useEffect(() => {
    joinGame()
  }, [joinGame])

  const sendPromotedType = type => {
    promote({ variables: { gameId: id, pieceType: type } })
  }

  return {
    game: initialResult.loading || initialResult.error ? null : initialResult.data.getGame,
    gameLoading: initialResult.loading,
    gameError: initialResult.error,
    promote: sendPromotedType,
    makeMove: ({ piece, oldLocation, newLocation }) => makeMove({
      variables: { move: { piece, oldLocation, newLocation, gameId: id } }
    }),
    skipTurn,
  }
}



// hook that gets the user
export const useUser = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)

  // lazy user query
  const [getUser] = useLazyQuery(GET_LOGGED_USER, {
    variables: {
      token: window.localStorage.getItem("loggedChessUser")
        ? window.localStorage.getItem("loggedChessUser")
        : window.sessionStorage.getItem("loggedChessUser")
    },
    onCompleted: data => {
      setUser(data.getLoggedUser)
    },
    onError: err => {
      handleApolloError(err)
    },
  })
  
  // user query
  const { loading, data, error } = useQuery(GET_LOGGED_USER, {
    variables: {
      token: window.localStorage.getItem("loggedChessUser")
        ? window.localStorage.getItem("loggedChessUser")
        : window.sessionStorage.getItem("loggedChessUser")
    },
    onError: err => {
      handleApolloError(err)
    },
  })

  const removeUser = useCallback(() => {
    console.log("logged out")
    window.localStorage.removeItem("loggedChessUser")
    window.sessionStorage.removeItem("loggedChessUser")
    setToken(null)
    getUser()
    return
  }, [getUser])

  const setUser = useCallback((user, remember) => {
    let newUserData = { getLoggedUser: user }

    if (remember) {
      console.log("localStorageen meni")
      window.localStorage.setItem("loggedChessUser", user.token)
    }
    window.sessionStorage.setItem("loggedChessUser", user.token)

    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token }
    })

  }, [client])

  useEffect(() => {
    if (data) {
      setUser(data.getLoggedUser)
      setToken(data.getLoggedUser.token)
    }
  }, [data, setUser])

  let userDataInStore = null

  if ((!loading && !error) && token) {
    /* console.log(token) */
    userDataInStore = client.readQuery({
      query: GET_LOGGED_USER,
      variables: { token }
    })
  }


  return {
    user: (!loading && !error) && token ? userDataInStore.getLoggedUser : null,
    userLoading: loading,
    userError: error,
    setUser,
    removeUser,
  }
}