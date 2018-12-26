import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import gql from "graphql-tag"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import ToggleIcon from "material-ui-toggle-icon"
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
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import CenteredSpinner from "../CenteredSpinner"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class DeleteAccountDialog extends React.Component {
  constructor() {
    super()
    this.state = {
      showPassword: false,
      password: "",
      token: "",
      passwordError: "",
      isPasswordEmpty: false,
      deleteOpen: false,
      timer: 5,
    }

    this.deleteUser = this.deleteUser.bind(this)
  }

  async createToken() {
    this.setState({ showLoading: true })

    try {
      let createTokenMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($tokenType: TokenType!, $password: String!) {
            createToken(tokenType: $tokenType, password: $password)
          }
        `,
        variables: {
          tokenType: "DELETE_USER",
          password: this.state.password,
        },
      })

      this.setState({
        token: createTokenMutation.data.createToken,
        deleteOpen: true,
        showLoading: false,
      })

      this.props.close()

      setTimeout(this.secondsTimer, 1000)
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

      this.setState({ showLoading: false })
    }
  }

  async deleteUser() {
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
          : `https://igloo-production.herokuapp.com/graphql`,
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
        mutation {
          deleteUser
        }
      `,
    })

    this.props.logOut()
  }

  secondsTimer = () => {
    this.setState(({ timer }) => {
      if (timer > 1 && this.state.deleteOpen) {
        setTimeout(this.secondsTimer, 1000)
      }

      return {
        timer: timer - 1,
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({
        isPasswordEmpty: false,
        passwordError: false,
        password: "",
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open && !this.state.deleteOpen}
          onClose={() => {
            this.props.close()
            this.setState({ password: "" })
          }}
          className="notSelectable defaultCursor"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Type your password</DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
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
                  if (event.key === "Enter") {
                    this.createToken()
                  }
                }}
                endAdornment={
                  this.state.password ? (
                    <InputAdornment position="end">
                      <IconButton
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                        onClick={() => this.setState({ showPassword: true })}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
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
              onClick={() => {
                this.props.close()
              }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.password || this.state.showLoading}
              onClick={() => {
                this.createToken()
                this.setState({ showLoading: true })
              }}
            >
              Proceed
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.deleteOpen}
          onClose={() => {
            this.setState({ deleteOpen: false, timer: 5 })
            this.props.close()
          }}
          className="notSelectable defaultCursor"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Delete your account </DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            Be careful, your data will be erased permanently.
          </div>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ deleteOpen: false, timer: 5 })
                this.props.close()
              }}
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
                onClick={this.deleteUser}
                disabled={this.state.timer >= 1}
                style={{
                  width: "120px",
                  margin: "0 4px",
                }}
              >
                {this.state.timer >= 1
                  ? "Delete (" + this.state.timer + ")"
                  : "Delete"}
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
