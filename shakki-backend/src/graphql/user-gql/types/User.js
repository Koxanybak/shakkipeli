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
    receivedInvites: [GameInvite!]
    sentInvites: [GameInvite!]
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
    receivedInvites: [GameInvite!]
    sentInvites: [GameInvite!]
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