import React from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"
import introspectionQueryResultData from "../../fragmentTypes.json"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"
import moment from "moment"
import Moment from "react-moment"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import ToggleIcon from "material-ui-toggle-icon"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class AuthDialog extends React.Component {
  state = {
    authSnackOpen: false,
    authDialogOpen: false,
    tokenName: "",
    password: "",
    token: "",
    tokenError: "",
  }

  deletePermanentToken = tokenID => {
    this.props["DeletePermanentAccesToken"]({
      variables: {
        id: tokenID,
      },
      optimisticResponse: {
        __typename: "Mutation",
        DeletePermanentAccesToken: {
          id: tokenID,
        },
      },
    })
  }

  openAuthDialog = () => {
    this.setState({ authDialogOpen: true })
    this.props.handleAuthDialogClose()
  }

  closeAuthDialog = () => {
    this.setState({ authDialogOpen: false })
  }

  async createToken() {
    try {
      this.setState({ showLoading: true })

      let createTokenMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($tokenType: TokenType!, $password: String!) {
            createToken(tokenType: $tokenType, password: $password)
          }
        `,
        variables: {
          tokenType: "GENERATE_PERMANENT_TOKEN",
          password: this.state.password,
        },
      })

      this.props.handleAuthDialogClose()

      this.setState({
        token: createTokenMutation.data.createToken,
        authDialogOpen: true,
      })
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ passwordError: "Wrong password" })
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.setState({ passwordError: "This account doesn't exist" })
      } else {
        this.setState({
          passwordError: "Unexpected error",
        })
      }
    }
    this.setState({ showLoading: false })
  }

  async getPermanentToken() {
    const wsLink = new WebSocketLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server")
          ? "wss://" +
            localStorage
              .getItem("server")
              .replace("https://", "")
              .replace("http://", "") +
            "/subscriptions"
          : `wss://igloo-production.herokuapp.com/subscriptions`,
      options: {
        reconnect: true,
        connectionParams: {
          Authorization: "Bearer " + this.state.token,
        },
      },
    })

    const httpLink = new HttpLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
          ? localStorage.getItem("server") + "/graphql"
          : `http://igloo-production.herokuapp.com/graphql`,
      headers: {
        Authorization: "Bearer " + this.state.token,
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

    try {
      const tokenMutation = await this.client.mutate({
        mutation: gql`
          mutation GeneratePermanentAccessToken($name: String!) {
            createPermanentAccessToken(name: $name) {
              id
              token
            }
          }
        `,
        variables: {
          name: this.state.tokenName,
        },
      })

      this.setState({
        tokenId: tokenMutation.data.createPermanentAccessToken.id,
        generatedToken: tokenMutation.data.createPermanentAccessToken.token,
        nameOpen: false,
        authDialogOpen: true,
        tokenName: "",
      })
    } catch (e) {
      this.setState({
        tokenError: "Unexpected error",
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.confirmationDialogOpen !== nextProps.confirmationDialogOpen &&
      nextProps.confirmationDialogOpen
    ) {
      this.setState({
        isPasswordEmpty: false,
        passwordError: false,
        password: "",
      })
    }
  }

  componentDidMount() {
    const tokenSubscriptionQuery = gql`
      subscription {
        permanentTokenCreated {
          id
          name
          lastUsed
        }
      }
    `

    this.props.tokenData.subscribeToMore({
      document: tokenSubscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newTokens = [
          ...prev.user.permanentTokens,
          subscriptionData.data.permanentTokenCreated,
        ]

        return {
          user: {
            ...prev.user,
            permanentTokens: newTokens,
          },
        }
      },
    })

    const subscribeToTokensDeletes = gql`
      subscription {
        permanentTokenDeleted
      }
    `

    this.props.tokenData.subscribeToMore({
      document: subscribeToTokensDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newTokens = prev.user.permanentTokens.filter(
          token => token.id !== subscriptionData.data.permanentTokenDeleted
        )

        return {
          user: {
            ...prev.user,
            permanentTokens: newTokens,
          },
        }
      },
    })
  }

  render() {
    let tokenList = ""

    if (this.props.tokenData.error) tokenList = "Unexpected error"

    if (
      this.props.tokenData.loading ||
      (this.props.tokenData.user && !this.props.tokenData.user.permanentTokens)
    )
      tokenList = <CenteredSpinner />

    if (this.props.tokenData.user && this.props.tokenData.user.permanentTokens)
      tokenList = (
        <List>
          {this.props.tokenData.user.permanentTokens.map(token => (
            <ListItem button>
              <ListItemIcon>
                <Icon>vpn_key</Icon>
              </ListItemIcon>
              <ListItemText
                primary={token.name}
                secondary={
                  this.state.tokenId !== token.id ? (
                    token.lastUsed ? (
                      <React.Fragment>
                        Last used{" "}
                        <Moment fromNow>
                          {moment.utc(
                            token.lastUsed.split(".")[0],
                            "YYYY-MM-DDTh:mm:ss"
                          )}
                        </Moment>
                      </React.Fragment>
                    ) : (
                      "Never used"
                    )
                  ) : (
                    "Just created"
                  )
                }
              />
              <ListItemSecondaryAction>
                {this.state.tokenId === token.id ? (
                  <IconButton
                    onClick={() => this.deletePermanentToken(token.id)}
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <Icon>copy</Icon>
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => this.deletePermanentToken(token.id)}
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <Icon>delete</Icon>
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem
            button
            onClick={() =>
              this.setState({ nameOpen: true, authDialogOpen: false })
            }
          >
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary="Get a new permanent token" />
          </ListItem>
        </List>
      )

    return (
      <React.Fragment>
        <Dialog
          open={this.props.confirmationDialogOpen}
          onClose={this.props.handleAuthDialogClose}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Type your password</DialogTitle>
          <div
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
              height: "100%",
            }}
          >
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-password-login"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                placeholder="Password"
                onChange={event =>
                  this.setState({
                    password: event.target.value,
                    passwordError: "",
                    isPasswordEmpty: event.target.value === "",
                  })
                }
                error={
                  this.state.passwordError || this.state.isPasswordEmpty
                    ? true
                    : false
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.createToken()
                }}
                endAdornment={
                  this.state.password ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          this.setState(oldState => ({
                            showPassword: !oldState.showPassword,
                          }))
                        }
                        tabIndex="-1"
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        {/* fix for ToggleIcon glitch on Edge */}
                        {document.documentMode ||
                        /Edge/.test(navigator.userAgent) ? (
                          this.state.showPassword ? (
                            <Icon>visibility_off</Icon>
                          ) : (
                            <Icon>visibility</Icon>
                          )
                        ) : (
                          <ToggleIcon
                            on={this.state.showPassword || false}
                            onIcon={<Icon>visibility_off</Icon>}
                            offIcon={<Icon>visibility</Icon>}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
              <FormHelperText
                style={
                  this.state.passwordError || this.state.isPasswordEmpty
                    ? { color: "#f44336" }
                    : {}
                }
              >
                {this.state.isPasswordEmpty
                  ? "This field is required"
                  : this.state.passwordError}
              </FormHelperText>
            </FormControl>
          </div>
          <DialogActions>
            <Button
              onClick={this.props.handleAuthDialogClose}
              style={{ marginRight: "4px" }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.createToken()}
              disabled={!this.state.password || this.state.showLoading}
            >
              Proceed
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.authDialogOpen}
          onClose={this.closeAuthDialog}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Manage authorizations</DialogTitle>
          <div
            style={{
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingBottom: "0px",
              height: "100%",
            }}
          >
            {tokenList}
          </div>
          <DialogActions>
            <Button onClick={this.closeAuthDialog}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.nameOpen}
          onClose={() => this.setState({ nameOpen: false })}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Choose a token name</DialogTitle>
          <div
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
              height: "100%",
            }}
          >
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-password-login"
                value={this.state.tokenName}
                placeholder="Token"
                onChange={event =>
                  this.setState({
                    tokenName: event.target.value,
                    tokenError: "",
                    isTokenEmpty: event.target.value === "",
                  })
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.getPermanentToken()
                }}
                error={
                  this.state.tokenError || this.state.isTokenEmpty
                    ? true
                    : false
                }
                endAdornment={
                  this.state.tokenName ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => this.setState({ tokenName: "" })}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
              <FormHelperText
                style={
                  this.state.tokenName || this.state.isTokenEmpty
                    ? { color: "#f44336" }
                    : {}
                }
              >
                {this.state.isTokenEmpty
                  ? "This field is required"
                  : this.state.tokenError}
              </FormHelperText>
            </FormControl>
          </div>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({ nameOpen: false, authDialogOpen: true })
              }
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.tokenName}
              onClick={() => {
                this.getPermanentToken()
              }}
            >
              Get token
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        id
        permanentTokens {
          id
          name
          lastUsed
        }
      }
    }
  `,
  { name: "tokenData" }
)(
  graphql(
    gql`
      mutation DeletePermanentAccesToken($id: ID!) {
        deletePermanentAccesToken(id: $id)
      }
    `,
    {
      name: "DeletePermanentAccesToken",
    }
  )(AuthDialog)
)
