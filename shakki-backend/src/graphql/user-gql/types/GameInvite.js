const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type GameInvite {
    from: String!
    to: String!
    resolveStatus: String
    game: Game
  }
`

const resolvers = {
  GameInvite: {
    game: (root) => {
      return root.game
    }
  }
}

module.exports = {
  typeDefs,
  resolvers,
}