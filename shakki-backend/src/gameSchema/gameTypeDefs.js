const {
  gql,
} = require("apollo-server-express")

const gameTypeDefs = gql`
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
    id: String!
  }
  enum Side {
    white
    black
  }
  type Location {
    row: Int
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


  # queries
  type Query {
    getGame(gameId: String!): Game!
  }


  # mutations
  type Mutation {
    createGame: Game!
    makeMove(move: MoveInput!): Game!
    joinGame(gameId: String!): Game!
    promote(gameId: String!, pieceType: String!): Game!
  }



  # subscriptions
  type Subscription {
    moveMade(gameId: String!): Game!
  }
`

module.exports = gameTypeDefs