import React, { useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { useQuery, useMutation, useSubscription, useApolloClient } from "@apollo/client"
import { GET_GAME, MAKE_MOVE, MOVE_MADE, JOIN_GAME, PROMOTE } from "../../queries"
import Square from "./Square"
import { updateGameState } from "../../utils/cacheUpdaters"
import { GameContext, UserContext } from "../../utils/context"
import { Button } from "@material-ui/core"
//import { Queen, Rook, Bishop, Knight, } from "./pieces"


// Chessboard

const Board = () => {
  const client = useApolloClient()
  const { id } = useParams()
  const { setGameId } = useContext(GameContext)
  const { user } = useContext(UserContext)
  const initialResult = useQuery(GET_GAME, {
    variables: { gameId: id },
    onError: err => {
      if (!err.graphQLErrors || !err.graphQLErrors[0]) {
        console.log(err.message)
      } else {
        console.log(err.graphQLErrors[0].message)
      }
    },
    onCompleted: data => {
      setGameId(data.getGame.id)
    }
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
      updateGameState(data, client, id)
    }
  })

  useSubscription(MOVE_MADE, {
    onSubscriptionData: ({ subscriptionData }) => {
      updateGameState(subscriptionData.data, client, id)
    },
    variables: { gameId: id }
  })

  useEffect(() => {
    joinGame()
  }, [joinGame])

  const sendPromotedType = type => {
    promote({ variables: { gameId: id, pieceType: type } })
  }

  if (initialResult.loading) {
    return "loading..."
  }

  if (!initialResult.data) {
    return initialResult.error.toString()
  }

  const {
    board,
    whitePlayer,
    currentPlayer,
    gameOver,
    winner,
    promotionPlayerID,
  } = initialResult.data.getGame

  const dragHelperMap = new Map()
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      dragHelperMap.set(8 * i + j, piece)
    })
  })

  const squares = Array.from(Array(8), (e, i) => {
    const row = new Array(8)

    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0) {
        row[j] = { piece: null, color: "white"}
      } else {
        row[j] = { piece: null, color: "black"}
      }
    }

    return row
  })

  //console.log("board renderöidään")

  return (
    <div>
      <div>
        Olet {user.id === whitePlayer
          ? "valkoiset"
          : "mustat"}. {user.id === currentPlayer
          ? "On sinun vuorosi." : "Odotetaan vastustajan siirtoa."}
      </div>
      <table>
        <tbody>
          {board.map((row, i) => {
            return (
              <tr key={i}>
                {
                  row.map((piece, j) => {
                    return <Square
                      key={8 * i + j}
                      color={squares[i][j].color}
                      makeMove={makeMove}
                      location={{ row: i, column: j }}
                      piece={piece}
                      dragHelperMap={dragHelperMap}
                    />
                  })
                }
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        {
          user.id === promotionPlayerID
            ?
            <div>
              Valitse nappula, joksi haluat muuttaa sotilaan
              <Button onClick={() => sendPromotedType("queen")}>
                Kuningatar
              </Button>
              <Button onClick={() => sendPromotedType("rook")}>
                Torni
              </Button>
              <Button onClick={() => sendPromotedType("knight")}>
                Ratsu
              </Button>
              <Button onClick={() => sendPromotedType("bishop")}>
                Lähetti
              </Button>
            </div>
            :
            null
        }
      </div>
      <div>
        {
          gameOver
            ? winner === user.id
              ? "Voitit pelin! Onneksi olkoon!"
              : "Ootko paska ku hävisit :D"
            : null
        }
      </div>
    </div>
  )
}

export default Board