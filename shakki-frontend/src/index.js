import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import Container from "@material-ui/core/Container"

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

let loc = window.location, newUri
if (loc.protocol === "https:") {
  newUri = "wss:"
} else {
  newUri = "ws:"
}
newUri += "//" + loc.host
console.log(`${newUri}/graphql`)

const httpLink = new HttpLink({
  uri: "/graphql"
})

const wsLink = new WebSocketLink({
  uri: `${newUri}/graphql`,
  options: {
    reconnect: true
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
    <Container>
      <Router>
        <App />
      </Router>
    </Container>
  </ApolloProvider>,
  document.getElementById("root")
)
