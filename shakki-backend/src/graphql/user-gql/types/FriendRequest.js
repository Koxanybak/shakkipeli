const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type FriendRequest {
    id: ID!
    from: User!
    to: User!
  }
`

module.exports = {
  typeDefs,
}