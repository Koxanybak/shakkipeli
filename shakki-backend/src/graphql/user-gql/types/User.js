const { gql } = require("apollo-server-express")

const typeDefs = gql`
  type User {
    username: String!
    tag: String!
    friends: [User!]
    matches: [String]
    sentRequests: [FriendRequest!]
    receivedRequests: [FriendRequest!]
    id: ID!
    guest: Boolean
  }
  type UserWithToken {
    username: String!
    tag: String!
    friends: [User!]
    matches: [String]
    token: String!
    id: ID!
    sentRequests: [FriendRequest!]
    receivedRequests: [FriendRequest!]
    guest: Boolean
  }

  input NewUserInput {
    username: String!
    tag: String!
    password: String!
  }
`

module.exports = {
  typeDefs,
}