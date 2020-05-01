import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import Container from "@material-ui/core/Container"

import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client"
import { getMainDefinition } from "@apollo/client/utilities"
import { WebSocketLink } from "@apollo/link-ws"

const httpLink = new HttpLink({
  uri: "http://localhost:4000/"
})

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
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
  httpLink,
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
