import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"

import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client"
import { setContext } from "@apollo/link-context"
import { getMainDefinition } from "@apollo/client/utilities"
import { WebSocketLink } from "@apollo/link-ws"

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("loggedChessUser")
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null
    }
  }
})

let loc = window.location, wsUri
if (loc.protocol === "https:") {
  wsUri = "wss:"
} else {
  wsUri = "ws:"
}
wsUri += "//" + loc.host
//console.log(`${wsUri}/graphql`)

const httpLink = new HttpLink({
  uri: "/graphql"
})

const wsLink = new WebSocketLink({
  uri: `${wsUri}/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: sessionStorage.getItem("loggedChessUser")
        ? `bearer ${sessionStorage.getItem("loggedChessUser")}`
        : null
    }
  }
})

const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
  connectToDevTools: true,
})



ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
)
