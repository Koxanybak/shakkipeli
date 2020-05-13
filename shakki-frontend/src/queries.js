import { gql } from "@apollo/client"

export const GET_GAME = gql`
  query getGame($gameId: String!) {
    getGame(
      gameId: $gameId
    ) {
      board {
        type
        side
      }
      id
      currentPlayer
      whitePlayer
      blackPlayer
      winner
      gameOver
      promotionPlayerID
      check {
        threatenedSide
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
  }
`

export const MOVE_MADE = gql`
  subscription moveMade($gameId: String!) {
    moveMade(
      gameId: $gameId
    ) {
      board {
        type
        side
      }
      id
      lastMove {
        success
      }
      currentPlayer
      whitePlayer
      blackPlayer
      winner
      gameOver
      promotionPlayerID
      check {
        threatenedSide
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
  }
`

export const JOIN_GAME = gql`
  mutation joinGame($gameId: String!) {
    joinGame(
      gameId: $gameId
    ) {
      board {
        type
        side
      }
      id
      currentPlayer
      whitePlayer
      blackPlayer
      winner
      gameOver
      promotionPlayerID
      check {
        threatenedSide
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
  }
`

export const PROMOTE = gql`
  mutation promote($gameId: String!, $pieceType: String!) {
    promote(
      gameId: $gameId,
      pieceType: $pieceType
    ) {
      board {
        type
        side
      }
      id
      currentPlayer
      whitePlayer
      blackPlayer
      winner
      gameOver
      promotionPlayerID
      check {
        threatenedSide
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
  }
`

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