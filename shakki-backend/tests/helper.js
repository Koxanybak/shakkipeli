const { initialUsers } = require("./data")
const {
  LOGIN,
} = require("./queries")

const validTokenForTesti = async (mutate) => {
  const res = await mutate({ mutation: LOGIN, variables: {
    username: initialUsers[1].username,
    password: "testitesti",
  } })
  return res.data.login.token
}

module.exports = {
  validTokenForTesti,
}