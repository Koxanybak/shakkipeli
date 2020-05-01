import { gql } from "@apollo/client"

const TYPE_DEFS = gql`
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
`

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