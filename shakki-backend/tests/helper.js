const { initialUsers } = require("./data")
const server = require("../src/gqlServer")
const { createTestClient } = require("apollo-server-testing")
const {
  LOGIN,
} = require("./queries")

const { mutate } = createTestClient(server)

const getValidTokenFor = async (tag) => {
  const user = initialUsers.find(user => user.tag === tag)
  console.log("user in init users:", user)
  const res = await mutate({ mutation: LOGIN, variables: {
    username: user.username,
    password: user.password,
  } })
  console.log("and token is", res.data.login.token)
  return res.data.login.token
}

module.exports = {
  getValidTokenFor,
}