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
import TextField from "@material-ui/core/TextField"
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
import InputAdornment from "@material-ui/core/InputAdornment"
import ToggleIcon from "material-ui-toggle-icon"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import clipboardCopy from "clipboard-copy"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class AuthDialog extends React.Component {
  constructor() {
    super()
    this.state = {
      authSnackOpen: false,
      authDialogOpen: false,
      tokenName: "",
      password: "",
      token: "",
      tokenError: "",
      tokenEmpty: false,
    }
  }

  openAuthDialog = () => {
    this.setState({ authDialogOpen: true })
    this.props.handleAuthDialogClose()
  }

  closeAuthDialog = () => {
    this.setState({ authDialogOpen: false })
    this.props.handleAuthDialogClose()
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
          tokenType: "MANAGE_PERMANENT_TOKENS",
          password: this.state.password,
        },
      })

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
      } else if (
        (e.message = "GraphQL error: This user doesn't exist anymore")
      ) {
        this.props.logOut()
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
          : `wss://bering.igloo.ooo/subscriptions`,
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
          : `https://bering.igloo.ooo/graphql`,
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
          mutation GeneratePermanentToken($name: String!) {
            createPermanentToken(name: $name) {
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
        tokenId: tokenMutation.data.createPermanentToken.id,
        generatedToken: tokenMutation.data.createPermanentToken.token,
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

  async deletePermanentToken(tokenId) {
    const wsLink = new WebSocketLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server")
          ? "wss://" +
            localStorage
              .getItem("server")
              .replace("https://", "")
              .replace("http://", "") +
            "/subscriptions"
          : `wss://bering.igloo.ooo/subscriptions`,
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
          : `https://bering.igloo.ooo/graphql`,
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

    await this.client.mutate({
      mutation: gql`
        mutation DeletePermanentToken($id: ID!) {
          deletePermanentToken(id: $id)
        }
      `,
      variables: {
        id: tokenId,
      },
    })
  }

  async regeneratePermanentToken(tokenId) {
    const wsLink = new WebSocketLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server")
          ? "wss://" +
            localStorage
              .getItem("server")
              .replace("https://", "")
              .replace("http://", "") +
            "/subscriptions"
          : `wss://bering.igloo.ooo/subscriptions`,
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
          : `https://bering.igloo.ooo/graphql`,
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

    const regenerateTokenMutation = await this.client.mutate({
      mutation: gql`
        mutation RegeneratePermanentToken($id: ID!) {
          regeneratePermanentToken(id: $id)
        }
      `,
      variables: {
        id: tokenId,
      },
    })

    this.setState({
      copyToken: regenerateTokenMutation.data.regeneratePermanentToken,
      anchorEl: null,
    })

    clipboardCopy(this.state.copyToken)
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
        showPassword: false,
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

    if (this.props.tokenData.error) {
      tokenList = "Unexpected error"

      if (
        this.props.tokenData.error.message ===
        "GraphQL error: This user doesn't exist anymore"
      ) {
        this.props.logOut()
      }
    }

    if (
      this.props.tokenData.loading ||
      (this.props.tokenData.user && !this.props.tokenData.user.permanentTokens)
    )
      tokenList = <CenteredSpinner />

    if (this.props.tokenData.user && this.props.tokenData.user.permanentTokens)
      tokenList = (
        <List
          style={{
            padding: "0",
          }}
        >
          {this.props.tokenData.user.permanentTokens.map(token => (
            <ListItem>
              <ListItemIcon>
                <Icon>vpn_key</Icon>
              </ListItemIcon>
              <ListItemText
                primary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    {token.name}
                  </font>
                }
                secondary={
                  <font
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "#c1c2c5" }
                        : { color: "#7a7a7a" }
                    }
                  >
                    {this.state.tokenId !== token.id ? (
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
                    )}
                  </font>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={event =>
                    this.setState({
                      menuTarget: token.id,
                      anchorEl: event.currentTarget,
                    })
                  }
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  <Icon>more_vert</Icon>
                </IconButton>
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
            <ListItemText
              primary={
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Get a new permanent token
                </font>
              }
            />
          </ListItem>
        </List>
      )

    return (
      <React.Fragment>
        <Dialog
          open={
            this.props.confirmationDialogOpen &&
            !this.state.authDialogOpen &&
            !this.state.nameOpen &&
            !this.state.deleteOpen
          }
          onClose={this.props.handleAuthDialogClose}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
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
            <TextField
              id="auth-password"
              label="Password"
              type={this.state.showPassword ? "text" : "password"}
              value={this.state.password}
              variant="outlined"
              error={this.state.passwordEmpty || this.state.passwordError}
              helperText={
                this.state.passwordEmpty
                  ? "This field is required"
                  : this.state.passwordError || " "
              }
              onChange={event =>
                this.setState({
                  password: event.target.value,
                  passwordEmpty: event.target.value === "",
                  passwordError: "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && this.state.password !== "")
                  this.createToken()
              }}
              style={{
                width: "100%",
              }}
              InputLabelProps={this.state.password && { shrink: true }}
              InputProps={{
                endAdornment: this.state.password && (
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
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
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
                ),
              }}
            />
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
          open={
            this.state.authDialogOpen &&
            !this.state.nameOpen &&
            !this.state.deleteOpen
          }
          onClose={this.closeAuthDialog}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Manage authorizations</DialogTitle>
          <div
            style={{
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
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
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
            <TextField
              id="token-name"
              label="Token name"
              value={this.state.tokenName}
              variant="outlined"
              error={this.state.tokenEmpty || this.state.tokenError}
              helperText={
                this.state.tokenEmpty
                  ? "This field is required"
                  : this.state.tokenError || " "
              }
              onChange={event =>
                this.setState({
                  tokenName: event.target.value,
                  tokenEmpty: event.target.value === "",
                  tokenError: "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && this.state.tokenName !== "") {
                  this.getPermanentToken()
                }
              }}
              style={{
                marginTop: "16px",
                width: "100%",
              }}
              InputLabelProps={this.state.tokenName && { shrink: true }}
              InputProps={{
                endAdornment: this.state.tokenName && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        this.setState({ tokenName: "" })
                      }}
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                      tabIndex="-1"
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
        <Dialog
          open={this.state.deleteOpen}
          onClose={() => this.setState({ deleteOpen: false })}
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          className="notSelectable defaultCursor"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Delete token</DialogTitle>
          <font
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            Be careful,{" "}
            {this.props.tokenData.user &&
              this.props.tokenData.user.permanentTokens.filter(
                token => token.id === this.state.menuTarget
              )[0] &&
              this.props.tokenData.user.permanentTokens.filter(
                token => token.id === this.state.menuTarget
              )[0].name}{" "}
            will be deleted permanently.
          </font>
          <DialogActions>
            <Button
              onClick={() => this.setState({ deleteOpen: false })}
              style={{ marginRight: "4px" }}
            >
              Never mind
            </Button>
            <MuiThemeProvider
              theme={createMuiTheme({
                palette: {
                  primary: { main: "#f44336" },
                },
              })}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  this.setState({ deleteOpen: false })
                  this.deletePermanentToken(this.state.menuTarget)
                }}
                style={{ margin: "0 4px" }}
              >
                Delete
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Menu
          id="auth-menu-target"
          anchorEl={this.state.anchorEl}
          open={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={
              this.state.tokenId === this.state.menuTarget
                ? () => {
                    clipboardCopy(this.state.generatedToken)
                    this.setState({ menuTarget: null })
                  }
                : () => this.regeneratePermanentToken(this.state.menuTarget)
            }
          >
            <ListItemIcon>
              <Icon>content_copy</Icon>
            </ListItemIcon>
            <ListItemText inset>Copy</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.setState({ anchorEl: false, deleteOpen: true })
            }}
          >
            <ListItemIcon>
              <Icon style={{ color: "#f44336" }}>delete</Icon>
            </ListItemIcon>
            <ListItemText inset>
              <span style={{ color: "#f44336" }}>Delete</span>
            </ListItemText>
          </MenuItem>
        </Menu>
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
)(withMobileDialog({ breakpoint: "xs" })(AuthDialog))
