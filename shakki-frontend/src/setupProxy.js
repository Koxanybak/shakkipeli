/* eslint-disable no-undef */
const { createProxyMiddleware } = require("http-proxy-middleware")
const express = require("express")

// no idea why this code works but it will suffice
// also console.logs aren't working in this file for some reason

if (process.env.NODE_ENV === "production") {
  const server = process.env.SERVER || "localhost"

  const apiProxy = createProxyMiddleware("/graphql", {
    target: "http://"+server+":4000",
    pathRewrite: { "^/graphql" : "graphql" }
  })
  const wsProxy = createProxyMiddleware("/graphql", {
    ws: true,
    target: "http://"+server+":4000"
  })

  const app = express()

  app.use(apiProxy)
  app.use(wsProxy)
  app.use(express.static("./"))

  app.listen(9000, function () {
  })
} else {
  const URI = process.env.REVERSE_PROXY_URI || "http://localhost:4000"

  module.exports = function(app) {
    const apiProxy = createProxyMiddleware("/graphql", {
      target: URI
    })
    const wsProxy = createProxyMiddleware("/graphql", {
      ws: true,
      target: URI
    })
    app.use(apiProxy)
    app.use(wsProxy)
  }
}