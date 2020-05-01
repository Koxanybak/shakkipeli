import React from "react"
import { useQuery, useMutation, useSubscription, useApolloClient } from "@apollo/client"
import { GET_GAME, MAKE_MOVE, MOVE_MADE } from "../../queries"
import Square from "./Square"

const BOARD_WIDTH = 8


// Chessboard

const Board = () => {
  const client = useApolloClient()
  const initialResult = useQuery(GET_GAME)
  const [makeMove] = useMutation(MAKE_MOVE)

  const updateInitialGame = (newGameData) => {
    let gameInStore = client.readQuery({ query: GET_GAME })
    gameInStore = { getGame: newGameData.moveMade }

    console.log("newGameData:", newGameData)
    client.writeQuery({
      query: GET_GAME,
      data: gameInStore
    })
    console.log(client.readQuery({
      query: GET_GAME
    }))
  }

  useSubscription(MOVE_MADE, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("subscriptionData:", subscriptionData)
      console.log("board:", subscriptionData.data.moveMade.board)
      updateInitialGame(subscriptionData.data)
    }
  })

  if (initialResult.loading) {
    return "loading"
  }

  const board = initialResult.data.getGame.board

  const dragHelperMap = new Map()
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      dragHelperMap.set(BOARD_WIDTH * i + j, piece)
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

  console.log("board renderöidään")
  // board on shakkinappulat sisältävä matriisi
  // squares on ruutujen värijäen matriisi

  return (
    <div>
      <table>
        <tbody>
          {board.map((row, i) => {
            return (
              <tr key={i}>
                {
                  row.map((piece, j) => {
                    return <Square
                      key={BOARD_WIDTH * i + j}
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
    </div>
  )
}

/*<tr>
            <td>a</td>
            <td>b</td>
            <td>c</td>
            <td>d</td>
            <td>e</td>
            <td>f</td>
            <td>g</td>
            <td>h</td>
          </tr>*/

export default Board