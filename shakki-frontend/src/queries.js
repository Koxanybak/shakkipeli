import { gql } from "@apollo/client"


// fragments
const GAME_STATE_DETAILS = gql`
  fragment gameStateDetails on Game {
    board {
        type
        side
        id
        location {
          row
          column
        }
        availableMoves {
          newLocation {
            row
            column
          }
        }
      }
      id
      currentPlayer
      whitePlayer
      blackPlayer
      winner
      gameOver
      promotionPlayerID
      check {
        threatenedPlayer
        movesAvailable {
          piece {
            type
            side
            id
          }
          newLocation {
            row
            column
          }
        }
      }
  }
`

/* const USER_DETAILS = gql`
  fragment userDetails on User {
    username
    tag
    friends {
      tag
    }
    guest
    id
  }
` */


// mutations and queries

// game related
export const GET_GAME = gql`
  query getGame($gameId: String!) {
    getGame(
      gameId: $gameId
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const MOVE_MADE = gql`
  subscription moveMade($gameId: String!) {
    moveMade(
      gameId: $gameId
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const JOIN_GAME = gql`
  mutation joinGame($gameId: String!) {
    joinGame(
      gameId: $gameId
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const PROMOTE = gql`
  mutation promote($gameId: String!, $pieceType: String!) {
    promote(
      gameId: $gameId,
      pieceType: $pieceType
    ) {
      ...gameStateDetails
    }
  }
  ${GAME_STATE_DETAILS}
`

export const MAKE_MOVE = gql`
  mutation makeMove($move: MoveInput!) {
    makeMove(
      move: $move
    ) {
      lastMove {
        success
        message
      }
    }
  }
`

export const CREATE_GAME = gql`
  mutation createGame {
    createGame {
      board {
        type
        side
      }
      id
    }
  }
`

// user related
export const GET_LOGGED_USER = gql`
  query getLoggedUser($token: String) {
    getLoggedUser(
      token: $token
    ) {
      username
      tag
      friends {
        tag
      }
      id
      token
      guest
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      username
      tag
      friends {
        tag
      }
      token
      guest
      id
    }
  }
`

export const ADD_USER = gql`
  mutation addUser($user: NewUserInput!) {
    addUser(
      user: $user
    ) {
      username
      tag
      id
      friends {
        tag
      }
    }
  }
`