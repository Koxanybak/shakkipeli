import { gql } from "@apollo/client"

/*const TYPE_DEFS = gql`
  input PieceInput {
    type: String!
    side: Side!
  }
 
  input LocationInput {
    row: Int!
    column: Int!
  }

  input MoveInput {
    piece: PieceInput
    oldLocation: LocationInput
    newLocation: LocationInput
  }
`*/

export const GET_GAME = gql`
  query getGame {
    getGame {
      board {
        type
        side
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

export const MOVE_MADE = gql`
  subscription moveMade {
    moveMade {
      board {
        type
        side
      }
      lastMove {
        success
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