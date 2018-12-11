import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Icon from "@material-ui/core/Icon"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import IconButton from "@material-ui/core/IconButton"
import ToggleIcon from "material-ui-toggle-icon"
import gql from "graphql-tag"
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
import CenteredSpinner from "../CenteredSpinner"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ChangePasswordDialog extends React.Component {
  state = {
    showPassword: false,
    showNewPassword: false,
    token: "",
    password: "",
    newPasswordDialogOpen: false,
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
          tokenType: "CHANGE_PASSWORD",
          password: this.state.password,
        },
      })

      this.setState({
        token: createTokenMutation.data.createToken,
        newPasswordDialogOpen: true,
        showDeleteLoading: false,
      })

      this.props.handlePasswordDialogClose()
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ passwordError: "Wrong password" })
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `SignupUser` to create one"
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

  async changePassword() {
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
      this.client.mutate({
        mutation: gql`
          mutation($newPassword: String!) {
            changePassword(newPassword: $newPassword) {
              token
            }
          }
        `,
        variables: {
          newPassword: this.state.newPassword,
        },
      })

      this.setState({
        newPasswordDialogOpen: false,
      })
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ emailError: "Wrong password" })
      } else if (
        e.message === "GraphQL error: A user with this email already exists"
      ) {
        this.setState({ emailError: "Email already taken" })
      } else {
        this.setState({
          emailError: "Unexpected error",
        })
      }

      this.setState({ showLoading: false })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.props.open && this.props.open)
      this.setState({
        password: "",
        isPasswordEmpty: false,
        passwordError: "",
        newPasswordError: "",
        isNewPasswordEmpty: false,
        newPassword: "",
      })
  }

  render() {
    const {
      userData: { user },
    } = this.props

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open && !this.state.newPasswordDialogOpen}
          onClose={() => this.props.close()}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Type your password</DialogTitle>
          <div
            style={{
              height: "100%",
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            <FormControl
              style={{
                width: "100%",
              }}
            >
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
            <Button onClick={this.props.close}>Never mind</Button>
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
          open={this.state.newPasswordDialogOpen}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Change password</DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-email-login"
                placeholder="New password"
                value={this.state.newPassword}
                onChange={event =>
                  this.setState({
                    newPassword: event.target.value,
                    isNewPasswordEmpty: event.target.value === "",
                  })
                }
                onKeyPress={event => {
                  if (event.key === "Enter")
                    this.changePassword(this.state.newPassword)
                }}
                error={
                  this.state.newPasswordError || this.state.isNewPasswordEmpty
                    ? true
                    : false
                }
                endAdornment={
                  this.state.newPassword ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          this.setState(oldState => ({
                            showNewPassword: !oldState.showNewPassword,
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
                          this.state.showNewPassword ? (
                            <Icon>visibility_off</Icon>
                          ) : (
                            <Icon>visibility</Icon>
                          )
                        ) : (
                          <ToggleIcon
                            on={this.state.showNewPassword || false}
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
                  this.state.emailError || this.state.isNewPasswordEmpty
                    ? { color: "#f44336" }
                    : {}
                }
              >
                {this.state.isNewPasswordEmpty
                  ? "This field is required"
                  : this.state.newPasswordError}
              </FormHelperText>
            </FormControl>
          </div>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ newPasswordDialogOpen: false })
                this.props.close()
              }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.changePassword(this.state.newPassword)}
              disabled={this.state.newPassword === "" || !user}
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
