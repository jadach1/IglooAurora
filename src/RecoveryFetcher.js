import React, { Component } from "react"
import PasswordRecovery from "./PasswordRecovery"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import introspectionQueryResultData from "./fragmentTypes.json"
import { getMainDefinition } from "apollo-utilities"
import { ApolloProvider } from "react-apollo"

export default class RecoveryFetcher extends Component {
  render() {
    const wsLink = new WebSocketLink({
      uri: `wss://iglooql.herokuapp.com/subscriptions`,
      options: {
        reconnect: true,
        connectionParams: {
          Authorization: "Bearer " + this.props.token,
        },
      },
    })

    const httpLink = new HttpLink({
      uri: "https://iglooql.herokuapp.com/graphql",
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    })

    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === "OperationDefinition" && operation === "subscription"
      },
      wsLink,
      httpLink
    )

    const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData,
    })

    this.client = new ApolloClient({
      // By default, this client will send queries to the
      //  `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache({ fragmentMatcher }),
    })

    return (
      <ApolloProvider client={this.client}>
        <PasswordRecovery />
      </ApolloProvider>
    )
  }
}
