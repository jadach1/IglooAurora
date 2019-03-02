import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import gql from "graphql-tag"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Fingerprint from "@material-ui/icons/Fingerprint"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Visibility from "@material-ui/icons/Visibility"
import CenteredSpinner from "../CenteredSpinner"
import InputAdornment from "@material-ui/core/InputAdornment"
import ToggleIcon from "material-ui-toggle-icon"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import SvgIcon from "@material-ui/core/SvgIcon"
import MoreVert from "@material-ui/icons/MoreVert"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Create from "@material-ui/icons/Create"
import Close from "@material-ui/icons/Close"
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
import Query from "react-apollo/Query"
import Link from "@material-ui/core/Link"
import Clear from "@material-ui/icons/Clear"

function str2ab(str) {
  return Uint8Array.from(str, c => c.charCodeAt(0))
}

function ab2str(ab) {
  return Array.from(new Int8Array(ab))
}

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

let primaryAuthenticationMethods = []
let secondaryAuthenticationMethods = []

class AuthenticationOptions extends React.Component {
  state = { selectAuthTypeOpen: false }

  createToken = async () => {
    try {
      this.setState({ showLoading: true })

      let createTokenMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($tokenType: TokenType!, $password: String!) {
            createToken(tokenType: $tokenType, password: $password)
          }
        `,
        variables: {
          tokenType: "CHANGE_AUTHENTICATION",
          password: this.state.password,
        },
      })

      this.setState({
        token: createTokenMutation.data.createToken,
        selectAuthTypeOpen: true,
        showDeleteLoading: false,
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

  changePassword = async () => {
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

  enableWebAuthn = async () => {
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

    const {
      data: { getWebAuthnEnableChallenge },
    } = await this.client.query({
      query: gql`
        query getWebauthnSignUpChallenge {
          getWebAuthnEnableChallenge {
            publicKeyOptions
            jwtChallenge
          }
        }
      `,
    })

    const publicKeyOptions = JSON.parse(
      getWebAuthnEnableChallenge.publicKeyOptions
    )

    publicKeyOptions.challenge = str2ab(publicKeyOptions.challenge)
    publicKeyOptions.user.id = str2ab(publicKeyOptions.user.id)

    let sendResponse = async res => {
      let payload = { response: {} }
      payload.rawId = ab2str(res.rawId)
      payload.response.attestationObject = ab2str(
        res.response.attestationObject
      )
      payload.response.clientDataJSON = ab2str(res.response.clientDataJSON)

      await this.client.mutate({
        mutation: gql`
          mutation($jwtChallenge: String!, $challengeResponse: String!) {
            enableWebauthn(
              jwtChallenge: $jwtChallenge
              challengeResponse: $challengeResponse
            ) {
              token
              user {
                id
                email
                name
                profileIconColor
              }
            }
          }
        `,
        variables: {
          challengeResponse: JSON.stringify(payload),
          jwtChallenge: getWebAuthnEnableChallenge.jwtChallenge,
        },
      })
    }

    navigator.credentials
      .create({ publicKey: publicKeyOptions })
      .then(sendResponse)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({
        isPasswordEmpty: false,
        passwordError: false,
        password: "",
        showPassword: false,
      })
    }
  }

  changeAuthenticationMethods = async (
    primaryAuthenticationMethods,
    secondaryAuthenticationMethods
  ) => {
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

    this.client.mutate({
      mutation: gql`
        mutation changeAuthenticationSettings(
          $primaryAuthenticationMethods: [PrimaryAuthenticationMethod!]!
          $secondaryAuthenticationMethods: [SecondaryAuthenticationMethod!]!
        ) {
          changeAuthenticationSettings(
            primaryAuthenticationMethods: $primaryAuthenticationMethods
            secondaryAuthenticationMethods: $secondaryAuthenticationMethods
          ) {
            id
            primaryAuthenticationMethods
            secondaryAuthenticationMethods
          }
        }
      `,
      variables: {
        primaryAuthenticationMethods,
        secondaryAuthenticationMethods,
      },
    })
  }

  render() {
    const { user } = this.props

    let webAuthnListItem = (
      <ListItem>
        <ListItemIcon>
          <Fingerprint />
        </ListItemIcon>
        <ListItemText
          primary={
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : {}
              }
            >
              Fingerprint, face or security key
            </font>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={event =>
              this.setState({
                menuTarget: "WEBAUTHN",
                anchorEl: event.currentTarget,
              })
            }
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    color: "white",
                  }
                : { color: "black" }
            }
          >
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )

    let totpListItem = (
      <ListItem>
        <ListItemIcon>
          <SvgIcon>
            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
              <path d="M7,1A2,2 0 0,0 5,3V7H7V4H17V20H7V17H5V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3A2,2 0 0,0 17,1H7M6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C7.31,15 8.42,14.17 8.83,13H11V15H13V13H14V11H8.83C8.42,9.83 7.31,9 6,9M6,11A1,1 0 0,1 7,12A1,1 0 0,1 6,13A1,1 0 0,1 5,12A1,1 0 0,1 6,11Z" />{" "}
            </svg>
          </SvgIcon>
        </ListItemIcon>
        <ListItemText
          primary={
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : {}
              }
            >
              One-time password
            </font>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={event =>
              this.setState({
                menuTarget: "TOTP",
                anchorEl: event.currentTarget,
              })
            }
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    color: "white",
                  }
                : { color: "black" }
            }
          >
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )

    let passwordListItem = (
      <ListItem>
        <ListItemIcon>
          <SvgIcon>
            <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
              <path d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20M8.5,12A1.5,1.5 0 0,0 7,10.5A1.5,1.5 0 0,0 5.5,12A1.5,1.5 0 0,0 7,13.5A1.5,1.5 0 0,0 8.5,12M13,10.89C12.39,10.33 11.44,10.38 10.88,11C10.32,11.6 10.37,12.55 11,13.11C11.55,13.63 12.43,13.63 13,13.11V10.89Z" />
            </svg>
          </SvgIcon>
        </ListItemIcon>
        <ListItemText
          primary={
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : {}
              }
            >
              Password
            </font>
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            onClick={event =>
              this.setState({
                menuTarget: "PASSWORD",
                anchorEl: event.currentTarget,
              })
            }
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    color: "white",
                  }
                : { color: "black" }
            }
          >
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open && !this.state.selectAuthTypeOpen}
          onClose={() => this.props.close()}
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
              id="passwordless-authentication-password"
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
              onClick={this.createToken}
              disabled={!this.state.password || this.state.showLoading}
            >
              Proceed
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={
            this.state.selectAuthTypeOpen &&
            !this.state.newPasswordDialogOpen &&
            !this.state.configureTotpOpen
          }
          onClose={() => {
            this.setState({ selectAuthTypeOpen: false })
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
          <DialogTitle
            style={
              this.props.fullScreen
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { width: "calc(100% - 48px)", background: "#2f333d" }
                  : { width: "calc(100% - 48px)", background: "#fff" }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                ? { background: "#2f333d" }
                : { background: "#fff" }
            }
          >
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "#fff" }
                  : {}
              }
            >
              Authentication methods
            </font>
          </DialogTitle>
          <Query
            query={gql`
              query {
                user {
                  id
                  primaryAuthenticationMethods
                  secondaryAuthenticationMethods
                }
              }
            `}
            skip={!this.props.open}
          >
            {({ loading, error, data }) => {
              if (loading) return <CenteredSpinner />
              if (error) return "Unexpected error"

              if (data) {
                primaryAuthenticationMethods =
                  data.user.primaryAuthenticationMethods
                secondaryAuthenticationMethods =
                  data.user.secondaryAuthenticationMethods
              }

              return (
                <div
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? {
                          height: "100%",
                          background: "#2f333d",
                        }
                      : {
                          height: "100%",
                        }
                  }
                >
                  <List>
                    {(primaryAuthenticationMethods.includes("WEBAUTHN") ||
                      primaryAuthenticationMethods.includes("PASSWORD")) && (
                      <li key="primaryAuth">
                        <ul style={{ padding: "0" }}>
                          <ListSubheader
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? {
                                    color: "white",
                                    backgroundColor: "#2f333d",
                                  }
                                : { color: "black", backgroundColor: "white" }
                            }
                          >
                            Primary methods
                          </ListSubheader>
                          {primaryAuthenticationMethods.includes("WEBAUTHN") &&
                            webAuthnListItem}
                          {primaryAuthenticationMethods.includes("PASSWORD") &&
                            passwordListItem}
                        </ul>
                      </li>
                    )}
                    {(secondaryAuthenticationMethods.includes("WEBAUTHN") ||
                      secondaryAuthenticationMethods.includes("PASSWORD") ||
                      secondaryAuthenticationMethods.includes("TOTP")) && (
                      <li key="secondaryAuth">
                        <ul style={{ padding: "0" }}>
                          <ListSubheader
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? {
                                    color: "white",
                                    backgroundColor: "#2f333d",
                                  }
                                : { color: "black", backgroundColor: "white" }
                            }
                          >
                            Secondary methods
                          </ListSubheader>
                          {secondaryAuthenticationMethods.includes(
                            "WEBAUTHN"
                          ) && webAuthnListItem}
                          {secondaryAuthenticationMethods.includes(
                            "PASSWORD"
                          ) && passwordListItem}
                          {secondaryAuthenticationMethods.includes("TOTP") &&
                            totpListItem}
                        </ul>
                      </li>
                    )}
                    {!(
                      (secondaryAuthenticationMethods.includes("WEBAUTHN") ||
                        primaryAuthenticationMethods.includes("WEBAUTHN")) &&
                      (secondaryAuthenticationMethods.includes("PASSWORD") ||
                        primaryAuthenticationMethods.includes("PASSWORD")) &&
                      secondaryAuthenticationMethods.includes("TOTP")
                    ) && (
                      <li key="disabledAuth">
                        <ul style={{ padding: "0" }}>
                          <ListSubheader
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? {
                                    color: "white",
                                    backgroundColor: "#2f333d",
                                  }
                                : { color: "black", backgroundColor: "white" }
                            }
                          >
                            Disabled
                          </ListSubheader>
                          {!secondaryAuthenticationMethods.includes(
                            "WEBAUTHN"
                          ) &&
                            !primaryAuthenticationMethods.includes(
                              "WEBAUTHN"
                            ) &&
                            webAuthnListItem}
                          {!secondaryAuthenticationMethods.includes(
                            "PASSWORD"
                          ) &&
                            !primaryAuthenticationMethods.includes(
                              "PASSWORD"
                            ) &&
                            passwordListItem}
                          {!secondaryAuthenticationMethods.includes("TOTP") &&
                            !primaryAuthenticationMethods.includes("TOTP") &&
                            totpListItem}
                        </ul>
                      </li>
                    )}
                  </List>
                </div>
              )
            }}
          </Query>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ selectAuthTypeOpen: false })
                this.props.close()
              }}
            >
              <font
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : {}
                }
              >
                Close
              </font>
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.newPasswordDialogOpen}
          onClose={() => {
            this.props.close()
            this.setState({ newPasswordDialogOpen: false })
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
          <DialogTitle disableTypography>Change password</DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            <TextField
              id="change-new-password"
              label="New password"
              type={this.state.showNewPassword ? "text" : "password"}
              value={this.state.newPassword}
              variant="outlined"
              error={this.state.newPasswordEmpty || this.state.newPasswordError}
              helperText={
                this.state.newPasswordEmpty
                  ? "This field is required"
                  : this.state.newPasswordError || " "
              }
              onChange={event =>
                this.setState({
                  newPassword: event.target.value,
                  newPasswordEmpty: event.target.value === "",
                  newPasswordError: "",
                })
              }
              onKeyPress={event => {
                if (
                  event.key === "Enter" &&
                  this.state.newPassword !== "" &&
                  user
                )
                  this.createToken()
              }}
              style={{
                width: "100%",
              }}
              InputLabelProps={this.state.newPassword && { shrink: true }}
              InputProps={{
                endAdornment: this.state.newPassword && (
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
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                    >
                      {/* fix for ToggleIcon glitch on Edge */}
                      {document.documentMode ||
                      /Edge/.test(navigator.userAgent) ? (
                        this.state.showNewPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )
                      ) : (
                        <ToggleIcon
                          on={this.state.showNewPassword || false}
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
            <Button
              onClick={() => {
                this.setState({ newPasswordDialogOpen: false })
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
        <Dialog
          open={this.state.configureTotpOpen}
          onClose={() => this.props.close()}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            style={
              this.props.fullScreen
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { width: "calc(100% - 48px)", background: "#2f333d" }
                  : { width: "calc(100% - 48px)", background: "#fff" }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                ? { background: "#2f333d" }
                : { background: "#fff" }
            }
          >
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "#fff" }
                  : {}
              }
            >
              Configure one-time password
            </font>
          </DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              Scan this QR code with an application such as{" "}
              <Link style={{ cursor: "pointer" }}>1Password</Link>,{" "}
              <Link style={{ cursor: "pointer" }}>Authy</Link>, or{" "}
              <Link style={{ cursor: "pointer" }}>LastPass Authenticator</Link>
            </div>
            <div style={{ marginBottom: "24px" }}>
              Unable to scan this code? Use this one instead:{" "}
              <b>aaaa-bbbb-cccc-dddd</b>
            </div>
            <TextField
              id="totp-code"
              label="Six-digit code"
              value={this.state.code}
              variant="outlined"
              error={this.state.codeEmpty || this.state.codeError}
              helperText={
                this.state.codeEmpty
                  ? "This field is required"
                  : this.state.codeError
                  ? this.state.codeError
                  : " "
              }
              onChange={event =>
                this.setState({
                  code: event.target.value,
                  codeEmpty: event.target.value === "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && !this.state.codeEmpty)
                  this.setState({ manualCodeOpen: false })
              }}
              style={{
                width: "100%",
              }}
              InputLabelProps={this.state.cpde && { shrink: true }}
              InputProps={{
                endAdornment: this.state.code && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        this.setState({ code: "", codeEmpty: true })
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
                this.setState({ configureTotpOpen: false })
              }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.code || this.state.showTotpLoading}
            >
              Confirm code
              {this.state.showTotpLoading && <CenteredSpinner isInButton />}
            </Button>
          </DialogActions>
        </Dialog>
        <Menu
          id="authentication-menu-target"
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
              this.state.menuTarget === "PASSWORD"
                ? () =>
                    this.setState({
                      anchorEl: false,
                      newPasswordDialogOpen: true,
                      isPasswordEmpty: false,
                      passwordError: false,
                      password: "",
                      showPassword: false,
                    })
                : this.state.menuTarget === "WEBAUTHN"
                ? () => {
                    this.enableWebAuthn()
                    this.setState({
                      anchorEl: false,
                    })
                  }
                : () => {
                    this.setState({
                      configureTotpOpen: true,
                      anchorEl: false,
                    })
                  }
            }
          >
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText
              inset
              primary={
                <font
                  style={
                    !this.props.unauthenticated &&
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Change
                </font>
              }
            />
          </MenuItem>
          {!primaryAuthenticationMethods.includes(this.state.menuTarget) &&
            this.state.menuTarget !== "TOTP" && (
              <MenuItem
                onClick={() => {
                  this.setState({ anchorEl: false })

                  primaryAuthenticationMethods.push(this.state.menuTarget)

                  secondaryAuthenticationMethods = secondaryAuthenticationMethods.filter(
                    authMethod => authMethod !== this.state.menuTarget
                  )

                  this.changeAuthenticationMethods(
                    primaryAuthenticationMethods,
                    secondaryAuthenticationMethods
                  )
                }}
              >
                <ListItemIcon>
                  <SvgIcon>
                    <path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,17H14V7H10V9H12" />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText inset>
                  <font
                    style={
                      !this.props.unauthenticated &&
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    Set as primary
                  </font>
                </ListItemText>
              </MenuItem>
            )}
          {!secondaryAuthenticationMethods.includes(this.state.menuTarget) && (
            <MenuItem
              onClick={() => {
                this.setState({ anchorEl: false })

                secondaryAuthenticationMethods.push(this.state.menuTarget)

                primaryAuthenticationMethods = primaryAuthenticationMethods.filter(
                  authMethod => authMethod !== this.state.menuTarget
                )

                this.changeAuthenticationMethods(
                  primaryAuthenticationMethods,
                  secondaryAuthenticationMethods
                )
              }}
              disabled={!primaryAuthenticationMethods[1]}
            >
              <ListItemIcon>
                <SvgIcon>
                  <path d="M15,15H11V13H13A2,2 0 0,0 15,11V9C15,7.89 14.1,7 13,7H9V9H13V11H11A2,2 0 0,0 9,13V17H15M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText inset>
                <font
                  style={
                    !this.props.unauthenticated &&
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Set as secondary
                </font>
              </ListItemText>
            </MenuItem>
          )}
          {(primaryAuthenticationMethods.includes(this.state.menuTarget) ||
            secondaryAuthenticationMethods.includes(this.state.menuTarget)) && (
            <MenuItem
              onClick={() => {
                this.setState({ anchorEl: false })

                primaryAuthenticationMethods = primaryAuthenticationMethods.filter(
                  authMethod => authMethod !== this.state.menuTarget
                )

                secondaryAuthenticationMethods = secondaryAuthenticationMethods.filter(
                  authMethod => authMethod !== this.state.menuTarget
                )

                this.changeAuthenticationMethods(
                  primaryAuthenticationMethods,
                  secondaryAuthenticationMethods
                )
              }}
              disabled={
                !user.emailIsVerified &&
                !primaryAuthenticationMethods[1] &&
                primaryAuthenticationMethods.includes(this.state.menuTarget)
              }
            >
              <ListItemIcon>
                <Close />
              </ListItemIcon>
              <ListItemText inset>
                <font
                  style={
                    !this.props.unauthenticated &&
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Disable
                </font>
              </ListItemText>
            </MenuItem>
          )}
        </Menu>
      </React.Fragment>
    )
  }
}

export default withMobileDialog({ breakpoint: "xs" })(AuthenticationOptions)
