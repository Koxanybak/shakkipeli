const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type Game {
    board: [[Piece]!]!
    blackPlayer: String
    whitePlayer: String
    currentPlayer: String
    winner: String
    promotionPlayerID: String
    gameOver: Boolean!
    lastMove: Move
    check: Check
    id: ID!
  }
  type Check {
    threatenedPlayer: String!,
    movesAvailable: [Move!]!
  }
  type Piece {
    type: String!
    side: Side!
    availableMoves: [Move!]!
    id: String!
  }
  enum Side {
    white
    black
  }
  type Location {
    row: Int!
    column: Int!
  }
  type Move {
    piece: Piece
    oldLocation: Location
    newLocation: Location
    success: Boolean
    message: String
  }


  # inputs
  input PieceInput {
    type: String!
    side: Side!
  }
  input LocationInput {
    row: Int!
    column: Int!
  }
  input MoveInput {
    piece: PieceInput!
    oldLocation: LocationInput!
    newLocation: LocationInput!
    gameId: String!
  }
`

const resolvers = {
  Game: {
    board: (root) => {
      return root.getBoard()
    },
    lastMove: (root) => {
      return root.lastMove
    },
    check: (root) => {
      return root.check
    }
  },
}

module.exports = {
  typeDefs,
  resolvers,
}