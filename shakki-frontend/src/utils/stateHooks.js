import { useEffect, useCallback, useState, useContext } from "react"
import { useQuery, useMutation, useSubscription, useApolloClient, useLazyQuery, } from "@apollo/client"
import {
  GET_GAME,
  MAKE_MOVE,
  GAME_STATE_UPDATED,
  JOIN_GAME, PROMOTE,
  GET_LOGGED_USER,
  SKIP_TURN,
  REQUEST_RECEIVED,
  REQUEST_ACCEPTED,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  REMOVE_FRIEND,
  DECLINE_FRIEND_REQUEST,
  INVITE_RECEIVED,
  INVITE_RESOLVED,
  SEND_GAME_INVITE,
  RESOLVE_GAME_INVITE,
} from "../queries"
import { useParams, useHistory } from "react-router-dom"
import { handleApolloError } from "./errorHandlers"
import { FeedbackContext } from "./context"

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
  const [makeMove] = useMutation(MAKE_MOVE, {
    onError: err => {
      handleApolloError(err)
    }
  })
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

  const removeUser = useCallback(async () => {
    console.log("logged out")
    window.localStorage.removeItem("loggedChessUser")
    window.sessionStorage.removeItem("loggedChessUser")
    /* console.log(window.localStorage.getItem("loggedChessUser"))
    console.log(window.sessionStorage.getItem("loggedChessUser")) */
    setToken(null)
    await client.cache.reset()
    return
  }, [])

  const setUser = useCallback((user, remember,) => {
    let newUserData = { getLoggedUser: user }

    if (remember) {
      window.localStorage.setItem("loggedChessUser", user.token)
    }
    window.sessionStorage.setItem("loggedChessUser", user.token)

    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token }
    })
    setToken(user.token)

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
  //console.log((!loading && !error) && token ? userDataInStore.getLoggedUser : null)


  return {
    user: (!loading && !error) && token ? userDataInStore.getLoggedUser : null,
    userLoading: loading,
    userError: error,
    setUser,
    removeUser,
  }
}

// hook that manages friends
export const useFriends = (user) => {
  const client = useApolloClient()
  const history = useHistory()
  //console.log("used friends with", user)

  // cache update funcs
  const addRecReq = (req) => {
    let newUserData = { getLoggedUser: {
      ...user,
      receivedRequests: user.receivedRequests.find(r => r.id === req.id)
        ? user.receivedRequests
        : user.receivedRequests.concat(req),
    } }
    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token },
    })
  }
  const removeRecReq = req => {
    let newUserData = { getLoggedUser: {
      ...user,
      receivedRequests: user.receivedRequests.filter(r => r.id !== req.id)
    } }
    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token },
    })
  }
  const addSentReq = (req) => {
    let newUserData = { getLoggedUser: {
      ...user,
      sentRequests: user.sentRequests.find(r => r.id === req.id)
        ? user.sentRequests
        : user.sentRequests.concat(req),
    } }
    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token },
    })
  }
  const addFriend = (req, fromMutation) => {
    let newUserData = { getLoggedUser: {
      ...user,
      sentRequests: user.sentRequests.filter(r => r.id !== req.id),
      receivedRequests: user.receivedRequests.filter(r => r.id !== req.id),
      friends: user.friends.find(f => f.tag === req.to.tag)
        ? user.friends
        : user.friends.concat(fromMutation ? { tag: req.from.tag } : { tag: req.to.tag }),
    } }
    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token },
    })
  }
  const setReceivedInvs = (invList) => {
    let newUserData = { getLoggedUser: {
      ...user,
      receivedInvites: invList,
    } }
    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token },
    })
  }
  const setSentInvs = (invList) => {
    let newUserData = { getLoggedUser: {
      ...user,
      sentInvites: invList,
    } }
    client.writeQuery({
      query: GET_LOGGED_USER,
      data: newUserData,
      variables: { token: user.token },
    })
  }

  // subs and mutations
  useSubscription(REQUEST_RECEIVED, {
    variables: { userId: user ? user.id : null },
    onError: err => {
      console.log("virhe")
      handleApolloError(err)
    },
    onSubscriptionComplete: () => {
      console.log("Listening to incoming friend requests")
    },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("Data from req reception:", subscriptionData)
      addRecReq(subscriptionData.data.requestReceived)
    },
  })

  useSubscription(REQUEST_ACCEPTED, {
    variables: { userId: user ? user.id : null },
    onError: err => {
      console.log("virhe")
      handleApolloError(err)
    },
    onSubscriptionComplete: () => {
      console.log("Listening to accepts to the reqs...")
    },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("Data from req acception:", subscriptionData)
      addFriend(subscriptionData.data.requestAccepted)
    },
  })

  const [sendReq, { data: sendReqData }] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted: data => {
      addSentReq(data.sendFriendRequest)
    }
  })
  const [acceptReq, { data: acceptReqData }] = useMutation(ACCEPT_FRIEND_REQUEST, {
    onError: err => {
      handleApolloError(err)
    },
    onCompleted: data => {
      addFriend(data.acceptFriendRequest, true)
    }
  })
  const [declineReq, { data: declineReqData }] = useMutation(DECLINE_FRIEND_REQUEST, {
    onError: err => {
      handleApolloError(err)
    },
    onCompleted: data => {
      removeRecReq(data.declineFriendRequest)
    }
  })
  const [removeFriend] = useMutation(REMOVE_FRIEND, {
    onError: err => {
      handleApolloError(err)
    },
  })

  // game invite stuff
  useSubscription(INVITE_RECEIVED, {
    variables: { tag: user ? user.tag : null },
    onError: err => {
      console.log("virhe")
      handleApolloError(err)
    },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("Data from inv reception:", subscriptionData)
      if (!user.receivedInvites) {
        setReceivedInvs([subscriptionData.data.inviteReceived])
        console.log("were set to", [subscriptionData.data.inviteReceived])
        return
      }
      if (!user.receivedInvites.find(inv => inv.from === subscriptionData.data.inviteReceived.from)) {
        setReceivedInvs(user.receivedInvites.concat(subscriptionData.data.inviteReceived))
      }
    },
  })
  useSubscription(INVITE_RESOLVED, {
    variables: { tag: user ? user.tag : null },
    onError: err => {
      console.log("virhe")
      handleApolloError(err)
    },
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("Data from inv resolving:", subscriptionData)
      if (!user.sentInvites) {
        setSentInvs([])
      } else {
        setSentInvs(user.sentInvites.filter(inv => {
          return inv.to !== subscriptionData.data.inviteResolved.to
        }))
      }
      if (subscriptionData.data.inviteResolved.resolveStatus === "accepted") {
        history.push("/")
        history.push(`play/${subscriptionData.data.inviteResolved.game.id}`)
      }
    },
  })

  const [sendGameInv] = useMutation(SEND_GAME_INVITE, {
    onCompleted: data => {
      console.log("sent inv", data.sendGameInvite)
      if (!user.receivedInvites || !user.receivedInvites.find(inv => inv.from === data.sendGameInvite.to)) {
        if (!user.sentInvites) {
          setSentInvs([data.sendGameInvite])
        } else if (data.sendGameInvite.resolveStatus === null && !user.sentInvites.find(inv => inv.to === data.sendGameInvite.to))
          setSentInvs(user.sentInvites.concat(data.sendGameInvite))
      }
    }
  })
  const [resolveGameInv] = useMutation(RESOLVE_GAME_INVITE, {
    onError: err => {
      handleApolloError(err)
    },
    onCompleted: data => {
      console.log("resolved inv", data.resolveGameInvite)
      if (!user.receivedInvites) {
        setReceivedInvs([])
      } else {
        setReceivedInvs(user.receivedInvites.filter(inv => {
          return inv.from !== data.resolveGameInvite.from
        }))
      }
      if (data.resolveGameInvite.resolveStatus === "accepted") {
        history.push("/")
        history.push(`play/${data.resolveGameInvite.game.id}`)
      }
    }
  })

  //console.log("in friends recinvs", receivedInvs)

  return {
    acceptReq,
    acceptReqData,
    sendReq,
    sendReqData,
    removeFriend,
    declineReq,
    declineReqData,
    sendGameInv,
    resolveGameInv,
  }
}