const { gql } = require("apollo-server-express")

const userTypeDefs = gql`
  type User {
    username: String!
    tag: String!
    friends: [User!]
    id: ID!
    currentGameId: String
    guest: Boolean
  }
  type UserWithToken {
    username: String!
    tag: String!
    friends: [User!]
    token: String!
    id: ID!
    guest: Boolean
  }


  # inputs
  input NewUserInput {
    username: String!
    tag: String!
    password: String!
  }

  # queries
  type Query {
    getLoggedUser(token: String): UserWithToken
  }


  # mutations
  type Mutation {
    addUser(user: NewUserInput!): User!
    login(username: String!, password: String!): UserWithToken!
  }
`

module.exports = userTypeDefs