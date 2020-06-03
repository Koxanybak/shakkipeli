const server = require("../src/gqlServer")
const { createTestClient } = require("apollo-server-testing")
const mongoose = require("mongoose")
const User = require("../data/models/user")
const { initialUsers } = require("./data")
const {
  ADD_USER,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  LOGIN,
} = require("./queries")
const { validTokenForTesti } = require("./helper")

const { query, mutate } = createTestClient(server)

beforeEach(async () => {
  await User.deleteMany({})
  const usersToDb = initialUsers.map(user => new User(user))
  await User.insertMany(usersToDb)
  //console.log(await User.find({}))
})

describe("user", () => {
  test("can be added when valid", async () => {
    const newUser = {
      username: "username",
      password: "password",
      tag: "tag",
    }
    const res = await mutate({ mutation: ADD_USER, variables: { user: newUser } })
    expect(res.data.addUser.username).toBe("username")
    expect(await User.find({})).toHaveLength(initialUsers.length + 1)
  })

  test("can not be added when invalid", async () => {
    const invalidUsers = [
      {
        username: "pogSCyOfiZKQmA6iXkt9dn9Dd1fqL4hLAXia2Z3Kf",
        password: "password",
        tag: "tag",
      },
      {
        username: "username",
        password: "passwor",
        tag: "tag",
      },
      {
        username: "u",
        password: "password",
        tag: "tag",
      },
      {
        username: "username",
        password: "password",
        tag: "pogSCyOfiZKQmA6iXkt9dn9Dd1fqL4hLAXia2Z3Kf",
      },
      {
        username: "username",
        password: "pogSCyOfiZKQmA6iXkt9dn9Dd1fqL4hLAXia2Z3Kf",
        tag: "tag",
      },
      {
        username: "username",
        password: "password",
        tag: "t",
      },
    ]
    const usersToServer = invalidUsers.map(user => {
      return mutate({ mutation: ADD_USER, variables: { user } })
    })
    const responses = await Promise.all(usersToServer)
    responses.forEach(res => {
      expect(res.errors).toBeDefined()
    })
    expect(await User.find({})).toHaveLength(initialUsers.length)
  })

  test("can login", async () => {
    const res = await mutate({ mutation: LOGIN, variables: {
      username: initialUsers[1].username,
      password: "testitesti",
    } })
    expect(res.data.login.username).toBe(initialUsers[1].username)
    expect(res.data.login.token).not.toBeNull()
  })
})

describe("friendRequest", () => {
  beforeEach(async () => {

  })

  test("can be sent", async () => {
    const res = await mutate({ mutation: SEND_FRIEND_REQUEST, variables: { tag:  8} })
  })

  test("can not be sent when invalid", async () => {

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})