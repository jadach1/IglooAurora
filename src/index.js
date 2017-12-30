import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import Main from "./Main"
import registerServiceWorker from "./registerServiceWorker"
import {ApolloClient} from "apollo-client"
import {HttpLink} from "apollo-link-http"
import {InMemoryCache} from "apollo-cache-inmemory"
import {ApolloProvider} from "react-apollo"
import {WebSocketLink} from "apollo-link-ws"
import {split} from "apollo-link"
import {getMainDefinition} from "apollo-utilities"

const bearer =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1MTUyNDk2NjksInVzZXJJZCI6IjM2OWIwYjhmLTEwYWQtNDM3MS1iN2RlLWUxNjYyZDJhNTZlMSJ9.b5n-pLyEgjiIQVo8dZ_Yx2pNEzSK8H85U6OVw3XL1j1Kq64uCFg2C1Jyj1wrLF_rvNb1PnLDOo4Eccsn7kX6rQ"

const wsLink = new WebSocketLink({
    uri: `wss://iglooql.herokuapp.com/subscriptions`,
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: "Bearer " + bearer,
        },
    },
})

const httpLink = new HttpLink({
    uri: "https://iglooql.herokuapp.com/graphql",
    headers: {
        Authorization: "Bearer " + bearer,
    },
})

const link = split(
    // split based on operation type
    ({query}) => {
        const {kind, operation} = getMainDefinition(query)
        return kind === "OperationDefinition" && operation === "subscription"
    },
    wsLink,
    httpLink
)

const client = new ApolloClient({
    // By default, this client will send queries to the
    //  `/graphql` endpoint on the same host
    link,
    cache: new InMemoryCache(),
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <Main />
    </ApolloProvider>,
    document.getElementById("root")
)
registerServiceWorker()
