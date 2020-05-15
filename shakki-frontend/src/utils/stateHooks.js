import { useEffect, useCallback } from "react"
import { useQuery, useMutation, useSubscription, useApolloClient, useLazyQuery } from "@apollo/client"
import { GET_GAME, MAKE_MOVE, MOVE_MADE, JOIN_GAME, PROMOTE, GET_LOGGED_USER } from "../queries"
import { useParams } from "react-router-dom"


export const useGame = () => {
  const client = useApolloClient()
  const { id } = useParams()

  const setGame = newGameData => {
    let gameDataInStore = client.readQuery({ query: GET_GAME, variables: { gameId: id } })
    gameDataInStore = { getGame: newGameData.moveMade }
  
    /* console.log("newGameData:", newGameData) */
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
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
    },
  })
  const [makeMove] = useMutation(MAKE_MOVE)
  const [promote] = useMutation(PROMOTE)
  const [joinGame] = useMutation(JOIN_GAME, {
    variables: { gameId: id },
    onError: err => {
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
    },
    onCompleted: data => {
      setGame(data)
    }
  })

  useSubscription(MOVE_MADE, {
    onSubscriptionData: ({ subscriptionData }) => {
      setGame(subscriptionData.data)
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
    game: initialResult.loading ? null : initialResult.data.getGame,
    gameLoading: initialResult.loading,
    gameError: initialResult.error,
    promote: sendPromotedType,
    makeMove: ({ piece, oldLocation, newLocation }) => makeMove({
      variables: { move: { piece, oldLocation, newLocation, gameId: id } }
    })
  }
}

export const useUser = () => {
  const client = useApolloClient()

  // lazy user query
  const [getUser] = useLazyQuery(GET_LOGGED_USER, {
    variables: {
      token: window.localStorage.getItem("loggedChessUser")
        ? window.sessionStorage.getItem("loggedChessUser")
        : window.localStorage.getItem("loggedChessUser")
    },
    onCompleted: data => {
      setUser(data.getLoggedUser)
    },
    onError: err => {
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
    },
  })
  
  // user query
  const userResult = useQuery(GET_LOGGED_USER, {
    variables: {
      token: window.localStorage.getItem("loggedChessUser")
        ? window.sessionStorage.getItem("loggedChessUser")
        : window.localStorage.getItem("loggedChessUser")
    },
    onError: err => {
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
    },
  })

  const setUser = useCallback((user, remember) => {
    if (user === null) {
      console.log("logged out")
      window.localStorage.removeItem("loggedChessUser")
      window.sessionStorage.removeItem("loggedChessUser")
      getUser()
      return
    }
    let newUserData = { getLoggedUser: user }

    const previousToken = window.sessionStorage.getItem("loggedChessUser")

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

  }, [client, getUser])

  useEffect(() => {
    if (userResult.data) {
      setUser(userResult.data.getLoggedUser)
    }
  }, [userResult.data, setUser])

  console.log(userResult)

  return {
    user: !userResult.loading ? userResult.data.getLoggedUser : null,
    userLoading: userResult.loading,
    userError: userResult.error,
    setUser,
  }
}