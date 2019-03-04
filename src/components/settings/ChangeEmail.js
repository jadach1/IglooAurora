import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import TextField from "@material-ui/core/TextField"
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
import withMobileDialog from "@material-ui/core/withMobileDialog"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Clear from "@material-ui/icons/Clear"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class ChangeMailDialog extends React.Component {
  state = {
    mailDialogOpen: false,
    password: "",
    passwordEmpty: false,
    passwordError: "",
    passwordemail: "",
    emailError: "",
    emailEmpty: false,
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
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
          ? (localStorage.getItem("serverUnsecure") === "true"
              ? "ws://"
              : "wss://") +
            localStorage.getItem("server") +
            "/subscriptions"
          : `wss://iglooql.herokuapp.com/subscriptions`,
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
          ? (localStorage.getItem("serverUnsecure") === "true"
              ? "http://"
              : "https://") +
            localStorage.getItem("server") +
            "/graphql"
          : `https://iglooql.herokuapp.com/graphql`,
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
        passwordEmpty: false,
        passwordError: "",
        emailError: "",
        emailEmpty: false,
        email: this.props.email,
        showPassword: false,
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
              height: "100%",
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            <TextField
              id="change-email-password"
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
                if (event.key === "Enter" && this.state.password !== "" && user)
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )
                      ) : (
                        <ToggleIcon
                          on={this.state.showPassword || false}
                          onIcon={<VisibilityOff />}
                          offIcon={<Visibility />}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <DialogActions>
            <Button onClick={this.props.close}>Never mind</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.createToken()}
              disabled={!this.state.password || this.state.showLoading}
            >
              Next
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.mailDialogOpen}
          onClose={() => {
            this.setState({ mailDialogOpen: false })
            this.props.close()
          }}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Change email</DialogTitle>
          <div
            style={{
              height: "100%",
              padding: "0 24px",
            }}
          >
            <TextField
              id="new-email"
              label={"New email"}
              value={this.state.email}
              variant="outlined"
              error={this.state.emailEmpty || this.state.emailError}
              helperText={
                this.state.emailEmpty
                  ? "This field is required"
                  : this.state.emailError || " "
              }
              onChange={event =>
                this.setState({
                  email: event.target.value,
                  emailEmpty: event.target.value === "",
                  emailError: "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && this.state.email !== "")
                  this.changeEmail(this.state.email)
              }}
              style={{
                width: "100%",
              }}
              InputLabelProps={this.state.email && { shrink: true }}
              InputProps={{
                endAdornment: this.state.email && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        this.setState({ email: "", emailEmpty: true })
                      }
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
              disabled={this.state.email === ""}
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withMobileDialog({ breakpoint: "xs" })(ChangeMailDialog)
