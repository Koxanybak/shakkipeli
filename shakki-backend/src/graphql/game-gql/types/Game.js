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
    moveHistory: [MoveHistoryEntry!]!
    id: ID!
  }
  type Check {
    threatenedPlayer: String!,
    movesAvailable: [Move!]!
  }
  type Piece {
    type: String!
    side: Side!
    location: Location
    lastLocation: Location
    availableMoves: [Move!]
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
  interface MoveInterface {
    newLocation: Location!
  }
  type Move implements MoveInterface {
    piece: Piece
    oldLocation: Location
    newLocation: Location!
    success: Boolean
    message: String
  }
  interface MoveHistoryEntry {
    leadToCheck: Boolean
    wonTheGame: Boolean
  }

  type OrdinaryMove implements MoveHistoryEntry {
    piece: Piece!
    pieceEaten: Piece
    newLocation: Location!
    leadToCheck: Boolean
    wonTheGame: Boolean
  }
  type CastlingMove implements MoveHistoryEntry {
    piece: Piece!
    castledPiece: Piece!
    leadToCheck: Boolean
    wonTheGame: Boolean
  }
  type PromotionMove implements MoveHistoryEntry {
    promotedPiece: Piece!
    promotedTo: String!
    leadToCheck: Boolean
    wonTheGame: Boolean
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
      /* console.log(root.getBoard()) */
      return root.getBoard()
    },
    lastMove: (root) => {
      return root.lastMove
    },
    check: (root) => {
      return root.check
    },
    moveHistory: (root) => {
      return root.moveHistory
    },
  },
  MoveHistoryEntry: {
    __resolveType(obj) {
      /* console.log("obj:", obj) */
      if (obj.castledPiece) {
        /* console.log("was Castling") */
        return "CastlingMove"
      } else if (obj.promotedTo) {
        return "PromotionMove"
      } else {
        /* console.log("was Ordinary") */
        return "OrdinaryMove"
      }
    },
  }
}

module.exports = {
  typeDefs,
  resolvers,
}