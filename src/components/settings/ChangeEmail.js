import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
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

class ChangeMailDialog extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mailDialogOpen: false,
      passwordError: "",
      email: "",
    }
  }

  openMailDialog = () => {
    this.setState({ mailDialogOpen: true })
    this.props.close()
  }

  closeMailDialog = () => {
    this.setState({ mailDialogOpen: false })
  }

  handleMailSnackOpen = () => {
    this.setState({
      mailSnackOpen: true,
    })
    this.closeMailDialog()
  }

  handleMailSnackClose = () => {
    this.setState({
      mailSnackOpen: false,
    })
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
          tokenType: "CHANGE_EMAIL",
          password: this.state.password,
        },
      })

      this.setState({
        token: createTokenMutation.data.createToken,
        mailDialogOpen: true,
        showDeleteLoading: false,
      })

      this.props.close()
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ passwordError: "Wrong password" })
      } else {
        this.setState({
          passwordError: "Unexpected error",
        })
      }
    }

    this.setState({ showLoading: false })
  }

  async changeEmail() {
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
      let changeEmailMutation = await this.client.mutate({
        mutation: gql`
          mutation($newEmail: String!) {
            changeEmail(newEmail: $newEmail)
          }
        `,
        variables: {
          newEmail: this.state.email,
        },
      })

      this.setState({
        token: changeEmailMutation.data.changeEmail,
      })

      this.props.close()

      this.closeMailDialog()

      this.state.email !== "undefined" &&
        typeof Storage !== "undefined" &&
        localStorage.setItem("email", this.state.email)
    } catch (e) {
      if (e.message === "GraphQL error: Wrong password") {
        this.setState({ emailError: "Wrong password" })
      } else if (
        e.message === "GraphQL error: A user with this email already exists"
      ) {
        this.setState({ emailError: "Email already taken" })
      } else if (e.message === "GraphQL error: Invalid email") {
        this.setState({ emailError: "Invalid email" })
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
        emailError: "",
        isEmailEmpty: false,
        email: "",
      })
  }

  render() {
    const {
      userData: { user },
    } = this.props

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open && !this.state.mailDialogOpen}
          onClose={this.props.close}
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
            <br />
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
          open={this.state.mailDialogOpen}
          onClose={() => {
            this.closeMailDialog()
            this.props.close()
            this.setState({ emailError: "", isEmailEmpty: false })
          }}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Change email</DialogTitle>
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
                placeholder="Email"
                value={this.state.email}
                onChange={event =>
                  this.setState({
                    email: event.target.value,
                    isEmailEmpty: event.target.value === "",
                  })
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.changeEmail(this.state.email)
                }}
                error={
                  this.state.emailError || this.state.isEmailEmpty
                    ? true
                    : false
                }
                endAdornment={
                  this.state.email ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickCancelEmail}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        <Icon>clear</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
              <FormHelperText
                style={
                  this.state.emailError || this.state.isEmailEmpty
                    ? { color: "#f44336" }
                    : {}
                }
              >
                {this.state.isEmailEmpty
                  ? "This field is required"
                  : this.state.emailError}
              </FormHelperText>
            </FormControl>
          </div>
          <DialogActions>
            <Button
              onClick={() => {
                this.closeMailDialog()
                this.props.close()
              }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.changeEmail(this.state.email)}
              disabled={this.state.email === "" || !user}
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default ChangeMailDialog
