const server = require("../src/gqlServer")
const { createTestClient } = require("apollo-server-testing")
const mongoose = require("mongoose")
const User = require("../data/models/user")
const FriendRequest = require("../data/models/friendRequest")
const { initialUsers } = require("./data")
const {
  ADD_USER,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  LOGIN,
} = require("./queries")
const { getValidTokenFor } = require("./helper")

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
  describe("when users are not friends", () => {
    test.only("can be sent", async () => {
      const tag = "Koxanybak"
      const /* { data: { sendFriendRequest } } */res = await mutate({
        mutation: SEND_FRIEND_REQUEST,
        variables: { tag },
        http: { headers: { authorization: `bearer ${getValidTokenFor("testi")}`} },
      })
      console.log({...res})
  
      const friendInDb = await User.findOne({ tag })
      const userInDb = await User.findOne({ tag: "testi" })
      const reqInDb = await FriendRequest.findOne({ to: friendInDb._id })
  
      expect(sendFriendRequest.to.tag).toBe(tag)
      expect(friendInDb.receivedRequests).toContainEqual(reqInDb._id)
      expect(userInDb.sentRequests).toContainEqual(reqInDb._id)
    })

    test("can't be sent to one self", async () => {
      const tag = "testi"
      const { errors } = await mutate({
        mutation: SEND_FRIEND_REQUEST,
        variables: { tag },
        http: { headers: { authorization: `bearer ${getValidTokenFor("testi")}`} },
      })
      const userInDb = await User.findOne({ tag })

      expect(errors.length).toBeGreaterThan(0)
      expect(userInDb.sentRequests).toHaveLength(0)
      expect(userInDb.receivedRequests).toHaveLength(0)
    })

    describe("when a request has been sent", () => {
      beforeEach(async () => {
        await FriendRequest.deleteMany({})
        const tag = "Koxanybak"
        await mutate({
          mutation: SEND_FRIEND_REQUEST,
          variables: { tag },
          http: { headers: { authorization: `bearer ${getValidTokenFor("testi")}`} },
        })
      })

      test("can not be sent", async () => {
        const tag = "Koxanybak"
        const { data: { sendFriendRequest } } = await mutate({
          mutation: SEND_FRIEND_REQUEST,
          variables: { tag },
          http: { headers: { authorization: `bearer ${getValidTokenFor("testi")}`} },
        })

        const friendInDb = await User.findOne({ tag })
        const userInDb = await User.findOne({ tag: "testi" })
    
        expect(sendFriendRequest.to.tag).not.toBe(tag)
        expect(friendInDb.receivedRequests).toHaveLength(1)
        expect(userInDb.sentRequests).toHaveLength(1)
      })
      
      test("can be accepted", async () => {
        const userInDb = await User.findOne({ tag: "Koxanybak" })
        const friendInDb = await User.findOne({ tag: "testi" })
        const reqInDb = await FriendRequest.findOne({ to: userInDb._id })
        const { data: { acceptFriendRequest }, errors } = await mutate({
          mutation: ACCEPT_FRIEND_REQUEST,
          variables: { requestId: reqInDb._id.toString() },
          http: { headers: { authorization: `bearer ${getValidTokenFor("Koxanybak")}`} },
        })

        expect(errors).toBeNull
        expect(acceptFriendRequest.to.tag).toBe("Koxanybak")
        expect(await FriendRequest.find({})).toHaveLength(0)
        expect(userInDb.receivedRequests).toHaveLength(0)
        expect(friendInDb.sentRequests).toHaveLength(0)
        expect(userInDb.friends).toContainEqual(friendInDb._id)
        expect(friendInDb.friends).toContainEqual(userInDb._id)
      })

      test("can be declined", async () => {
        const userInDb = await User.findOne({ tag: "Koxanybak" })
        const friendInDb = await User.findOne({ tag: "testi" })
        const reqInDb = await FriendRequest.findOne({ to: userInDb._id })
        const { data: { declineFriendRequest }, errors } = await mutate({
          mutation: DECLINE_FRIEND_REQUEST,
          variables: { requestId: reqInDb._id.toString() },
          http: { headers: { authorization: `bearer ${getValidTokenFor("Koxanybak")}`} },
        })

        expect(errors).toBeNull
        expect(declineFriendRequest.to.tag).toBe("Koxanybak")
        expect(await FriendRequest.find({})).toHaveLength(0)
        expect(userInDb.receivedRequests).toHaveLength(0)
        expect(friendInDb.sentRequests).toHaveLength(0)
        expect(userInDb.friends).toHaveLength(0)
        expect(friendInDb.friends).toHaveLength(0)
      })
    })
  })

  /* describe("when users are friends", async () => {
    test("can not be sent", async () => {

    })
  }) */
})

afterAll(async () => {
  await mongoose.connection.close()
})