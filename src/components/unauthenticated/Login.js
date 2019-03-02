import React, { Component } from "react"
import gql from "graphql-tag"
import InputAdornment from "@material-ui/core/InputAdornment"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import ForgotPassword from "./ForgotPassword"
import ToggleIcon from "material-ui-toggle-icon"
import CenteredSpinner from "../CenteredSpinner"
import { Link, Redirect } from "react-router-dom"
import MUILink from "@material-ui/core/Link"
import Clear from "@material-ui/icons/Clear"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Visibility from "@material-ui/icons/Visibility"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import querystringify from "querystringify"
import logo from "../../styles/assets/logo.svg"
import TextField from "@material-ui/core/TextField"
import Fingerprint from "@material-ui/icons/Fingerprint"
import Avatar from "@material-ui/core/Avatar"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import isemail from "isemail"

function str2ab(str) {
  return Uint8Array.from(str, c => c.charCodeAt(0))
}

function ab2str(ab) {
  return Array.from(new Int8Array(ab))
}

const sharedStyles = {
  MuiButton: {
    containedPrimary: {
      backgroundColor: "#0083ff",
    },
  },
  MuiInputLabel: {
    cursor: "default",
    webkitTouchCallout: "none",
    webkitUserSelect: "none",
    khtmlUserSelect: "none",
    mozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  },
}

const desktopTheme = createMuiTheme({
  palette: {
    default: { main: "#fff" },
    primary: { light: "#0083ff", main: "#0057cb" },
    secondary: { main: "#ff4081" },
    error: { main: "#f44336" },
  },
  overrides: {
    MuiInput: {
      root: {
        color: "black",
      },
    },
    MuiListItemIcon: {
      root: {
        color: "black",
      },
    },
    MuiCheckbox: {
      colorPrimary: {
        "&$checked": { color: "#0083ff" },
      },
    },
    ...sharedStyles,
  },
})

const mobileTheme = createMuiTheme({
  palette: {
    default: { main: "#fff" },
    primary: { light: "#0083ff", main: "#0057cb" },
    secondary: { main: "#ff4081" },
    error: { main: "#f44336" },
  },
  overrides: {
    MuiInput: {
      root: {
        color: "white",
      },
    },
    MuiCheckbox: {
      colorPrimary: { color: "white", "&$checked": { color: "white" } },
    },
    MuiFormControlLabel: {
      label: {
        color: "white",
      },
    },
    MuiFormLabel: {
      root: {
        color: "white",
        opacity: 0.8,
        "&$focused": {
          color: "white",
          opacity: 0.8,
        },
      },
    },
    MuiListItemIcon: {
      root: {
        color: "white",
      },
    },
    MuiInputBase: { root: { color: "white" } },
    ...sharedStyles,
  },
})

class Login extends Component {
  constructor(props) {

    super(props)

    // reset the email and name fields for login whenever the page loads
    this.props.changeEmail("")
    this.props.changePassword("")
    

    this.state = {
      recoveryError: "",
      forgotPasswordOpen: false,
      isMailEmpty: false,
      isPasswordEmpty: false,
      showLoading: false,
      redirect: false,
      counter: 0,

      showPasswordScreen: !!querystringify.parse(
        "?" + window.location.href.split("?")[1]
      ).user,
    }

    this.signIn = this.signIn.bind(this)
    this.signInWebauthn = this.signInWebauthn.bind(this)
    this.recover = this.recover.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener("resize", this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ height: window.innerHeight })
  }

  goToPassword = async () => {
    try {
      this.props.client.query({
        query: gql`
          query getUser($email: String) {
            user(email: $email) {
              id
              email
              profileIconColor
              name
            }
          }
        `,
        variables: {
          email: this.props.email,
        },
      })

      this.setState({ redirectToPassword: true })
    } catch (e) {
      if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.props.changeEmailError("This account doesn't exist")
      } else {
        this.props.changeEmailError("Unexpected error")
      }
    }
  }

  async signIn() {
    try {
      this.props.changePasswordError("")
      this.props.changeEmailError("")
      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            logIn(email: $email, password: $password) {
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
          email: this.props.email,
          password: this.props.password,
        },
      })

      if (querystringify.parse("?" + window.location.href.split("?")[1]).to) {
        window.location.href =
          querystringify.parse("?" + window.location.href.split("?")[1]).to +
          "?token=" +
          loginMutation.data.logIn.token
      } else {
        this.props.signIn(
          loginMutation.data.logIn.token,
          loginMutation.data.logIn.user
        )

        this.props.changePassword("")
      }
    } catch (e) {
      this.setState({ showLoading: false })

      if (e.message === "GraphQL error: Wrong password") {
        this.props.changePasswordError("Wrong password")
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.props.changeEmailError("This account doesn't exist")
        this.props.changeSignupEmail(this.props.email)
      } else {
        this.props.changeEmailError("Unexpected error")
      }
    }
  }

  signInWebauthn = async () => {
    const {
      data: { getWebAuthnLogInChallenge },
    } = await this.props.client.query({
      query: gql`
        query getWebAuthnLogInChallenge($email: String!) {
          getWebAuthnLogInChallenge(email: $email) {
            publicKeyOptions
            jwtChallenge
          }
        }
      `,
      variables: {
        email: this.props.email,
      },
    })

    const publicKeyOptions = JSON.parse(
      getWebAuthnLogInChallenge.publicKeyOptions
    )

    const jwtChallenge = getWebAuthnLogInChallenge.jwtChallenge

    publicKeyOptions.challenge = str2ab(publicKeyOptions.challenge)
    publicKeyOptions.allowCredentials = publicKeyOptions.allowCredentials.map(
      cred => ({
        ...cred,
        id: str2ab(cred.id),
      })
    )

    let sendResponse = async res => {
      let payload = { response: {} }
      payload.rawId = ab2str(res.rawId)
      payload.response.authenticatorData = ab2str(
        res.response.authenticatorData
      )
      payload.response.clientDataJSON = ab2str(res.response.clientDataJSON)
      payload.response.signature = ab2str(res.response.signature)

      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($jwtChallenge: String!, $challengeResponse: String!) {
            logInWithWebAuthn(
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
          jwtChallenge: jwtChallenge,
        },
      })

      this.props.signIn(
        loginMutation.data.logInWithWebAuthn.token,
        loginMutation.data.logInWithWebAuthn.user
      )

      this.props.changePassword("")
    }

    navigator.credentials
      .get({ publicKey: publicKeyOptions })
      .then(sendResponse)
  }

  recover = async recoveryEmail => {
    try {
      this.setState({ recoveryError: "" })
      await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!) {
            sendPasswordRecoveryEmail(email: $email)
          }
        `,
        variables: {
          email: recoveryEmail,
        },
      })
    } catch (e) {
      if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.setState({
          recoveryError: "This account does not exist",
        })
      }
    }
  }

  componentWillMount() {
    //gets the user field from the query parameters
    if (
      querystringify.parse("?" + window.location.href.split("?")[1]).user &&
      localStorage.getItem("accountList")
    ) {
      if (
        JSON.parse(localStorage.getItem("accountList")).some(
          account =>
            account.id ===
            querystringify.parse("?" + window.location.href.split("?")[1]).user
        )
      ) {
        this.props.changeEmail(
          JSON.parse(localStorage.getItem("accountList")).filter(
            account =>
              account.id ===
              querystringify.parse("?" + window.location.href.split("?")[1])
                .user
          )[0].email
        )
      } else {
        this.setState({ redirect: true })
      }
    }
  }

  getInitials = string => {
    if (string) {
      var names = string.trim().split(" "),
        initials = names[0].substring(0, 1).toUpperCase()

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    }
  }

  render() {
    if (this.props.mobile && this.state.counter === 7) {
      this.setState({ counter: 0 })
      this.props.openChangeServer()
    }

    if (this.state.redirect) {
      this.setState({ redirect: false })
      return querystringify.parse("?" + window.location.href.split("?")[1])
        .from ? (
          <Redirect to="/login?from=accounts" />
        ) : (
          <Redirect to="/login" />
        )
    }

    return (
      <MuiThemeProvider theme={this.props.mobile ? mobileTheme : desktopTheme}>
        <div
          className="rightSide notSelectable"
          style={
            this.props.mobile
              ? {
                overflowY: "hidden",
                maxWidth: "400px",
                margin: "0 auto",
                padding: "0 32px",
              }
              : { overflowY: "hidden", margin: "0 32px" }
          }
        >
          {this.props.mobile && (
            <img
              src={logo}
              alt="Igloo logo"
              className="notSelectable nonDraggable"
              draggable="false"
              style={
                this.state.height >= 690
                  ? {
                    width: "192px",
                    paddingTop: "72px",
                    marginBottom: "72px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }
                  : {
                    width: "144px",
                    paddingTop: "48px",
                    marginBottom: "48px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }
              }
              onClick={() =>
                this.setState(oldState => ({ counter: oldState.counter + 1 }))
              }
            />
          )}
          <div style={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              gutterBottom
              className="defaultCursor"
              style={
                this.props.mobile
                  ? {
                    color: "white",
                    marginTop: "32px",
                    marginBottom: "32px",
                  }
                  : {
                    color: "#0083ff",
                    marginTop: "32px",
                    marginBottom: "32px",
                  }
              }
            >
              Log in
            </Typography>
            {!querystringify.parse("?" + window.location.href.split("?")[1])
              .user ? (
                <React.Fragment>
                  <TextField
                    variant="outlined"
                    id="desktop-login-email"
                    label="Email"
                    value={this.props.email}
                    helperText={
                      (this.state.isMailEmpty
                        ? "This field is required"
                        : this.props.emailError) || " "
                    }
                    style={{
                      color: "black",
                      width: "100%",
                      marginBottom: "257px",
                    }}
                    onChange={event => {
                      this.props.changeEmail(event.target.value)
                      this.setState({
                        isMailEmpty: event.target.value === "",
                      })
                    }}
                    onKeyPress={event => {
                      if (event.key === "Enter") {
                        if (
                          isemail.validate(this.props.email, {
                            errorLevel: true,
                          }) === 0 &&
                          this.props.password
                        ) {
                          this.signIn()
                          this.setState({ showLoading: true })
                        }
                      }
                    }}
                    error={
                      this.props.emailError || this.state.isMailEmpty
                        ? true
                        : false
                    }
                    InputLabelProps={this.props.email && { shrink: true }}
                    InputProps={{
                      endAdornment: this.props.email ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              this.props.changeEmail("")
                              this.setState({ isMailEmpty: true })
                            }}
                            tabIndex="-1"
                            style={{ color: "black" }}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                  <div style={{ textAlign: "right" }}>
                    <MuiThemeProvider
                      theme={
                        this.props.mobile
                          ? createMuiTheme({
                            palette: {
                              primary: { main: "#fff" },
                            },
                          })
                          : ""
                      }
                    >
                      <Button
                        variant={this.props.mobile ? "outlined" : "contained"}
                        primary={true}
                        fullWidth={true}
                        onClick={this.goToPassword}
                        style={{ margin: "8px 0" }}
                        color="primary"
                        disabled={
                          isemail.validate(this.props.email, {
                            errorLevel: true,
                          }) !== 0 || this.state.showLoading
                        }
                      >
                        Next
                      {this.state.showLoading && (
                          <MuiThemeProvider
                            theme={createMuiTheme(
                              this.props.mobile
                                ? {
                                  overrides: {
                                    MuiCircularProgress: {
                                      colorPrimary: { color: "#fff" },
                                    },
                                  },
                                }
                                : {
                                  overrides: {
                                    MuiCircularProgress: {
                                      colorPrimary: { color: "#0083ff" },
                                    },
                                  },
                                }
                            )}
                          >
                            <CenteredSpinner isInButton />
                          </MuiThemeProvider>
                        )}
                      </Button>
                    </MuiThemeProvider>
                    {querystringify.parse(
                      "?" + window.location.href.split("?")[1]
                    ).from === "accounts" &&
                      JSON.parse(localStorage.getItem("accountList"))[0] ? (
                        <MuiThemeProvider
                          theme={createMuiTheme(
                            this.props.mobile
                              ? {
                                palette: {
                                  primary: { main: "#fff" },
                                },
                              }
                              : {
                                palette: {
                                  primary: { main: "#0083ff" },
                                },
                              }
                          )}
                        >
                          <Button
                            fullWidth={true}
                            color="primary"
                            disabled={this.state.showLoading}
                            component={Link}
                            to="/accounts"
                          >
                            Go back
                      </Button>
                        </MuiThemeProvider>
                      ) : (
                        <MuiThemeProvider
                          theme={createMuiTheme(
                            this.props.mobile
                              ? {
                                palette: {
                                  primary: { main: "#fff" },
                                },
                              }
                              : {
                                palette: {
                                  primary: { main: "#0083ff" },
                                },
                              }
                          )}
                        >
                          <Button
                            fullWidth
                            color="primary"
                            disabled={this.state.showLoading}
                            component={Link}
                            to="/signup"
                          >
                            Sign up instead
                      </Button>
                        </MuiThemeProvider>
                      )}
                  </div>
                </React.Fragment>
              ) : (
                <div>
                  <ListItem style={{ padding: "0", marginBottom: "24px" }}>
                    <Avatar
                      style={{
                        background: JSON.parse(
                          localStorage.getItem("accountList")
                        ).find(
                          user =>
                            user.id ===
                            querystringify.parse(
                              "?" + window.location.href.split("?")[1]
                            ).user
                        ).profileIconColor,
                      }}
                    >
                      {this.getInitials(
                        JSON.parse(localStorage.getItem("accountList")).find(
                          user =>
                            user.id ===
                            querystringify.parse(
                              "?" + window.location.href.split("?")[1]
                            ).user
                        ).name
                      )}
                    </Avatar>
                    <ListItemText
                      primary={
                        <font
                          style={
                            this.props.mobile
                              ? { color: "white" }
                              : { color: "black" }
                          }
                        >
                          {
                            JSON.parse(localStorage.getItem("accountList")).find(
                              user =>
                                user.id ===
                                querystringify.parse(
                                  "?" + window.location.href.split("?")[1]
                                ).user
                            ).name
                          }
                        </font>
                      }
                      secondary={
                        <font
                          style={
                            this.props.mobile
                              ? { color: "white", opacity: 0.72 }
                              : { color: "black", opacity: 0.72 }
                          }
                        >
                          {
                            JSON.parse(localStorage.getItem("accountList")).find(
                              user =>
                                user.id ===
                                querystringify.parse(
                                  "?" + window.location.href.split("?")[1]
                                ).user
                            ).email
                          }
                        </font>
                      }
                    />
                  </ListItem>
                  <TextField
                    variant="outlined"
                    id="desktop-password-login"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.props.password}
                    label="Password"
                    style={{
                      color: "black",
                      width: "100%",
                      marginBottom: "16px",
                    }}
                    onChange={event => {
                      this.props.changePassword(event.target.value)
                      this.props.changePasswordError("")
                      this.setState({
                        isPasswordEmpty: event.target.value === "",
                      })
                    }}
                    error={
                      this.props.passwordError || this.state.isPasswordEmpty
                        ? true
                        : false
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter") {
                        if (
                          isemail.validate(this.props.email, {
                            errorLevel: true,
                          }) === 0 &&
                          this.props.password
                        ) {
                          this.signIn()
                          this.setState({ showLoading: true })
                        }
                      }
                    }}
                    helperText={
                      (this.state.isPasswordEmpty
                        ? "This field is required"
                        : this.props.passwordError) || " "
                    }
                    InputLabelProps={this.state.name && { shrink: true }}
                    InputProps={{
                      endAdornment: this.props.password ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              this.setState({
                                showPassword: !this.state.showPassword,
                              })
                            }
                            onMouseDown={this.handleMouseDownPassword}
                            tabIndex="-1"
                            style={{ color: "black" }}
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
                      ) : null,
                    }}
                  />
                  {navigator.credentials && (
                    <IconButton
                      onClick={this.signInWebauthn}
                      disabled={
                        isemail.validate(this.props.email, {
                          errorLevel: true,
                        }) !== 0 || this.state.showLoading
                      }
                      style={
                        isemail.validate(this.props.email, {
                          errorLevel: true,
                        }) === 0 && !this.state.showLoading
                          ? this.props.mobile
                            ? { color: "white" }
                            : { color: "black" }
                          : this.props.mobile
                            ? {
                              color: "white",
                              opacity: 0.54,
                            }
                            : {
                              color: "black",
                              opacity: 0.54,
                            }
                      }
                    >
                      <Fingerprint
                        style={
                          this.props.email
                            ? this.props.mobile
                              ? { height: "48px", width: "48px" }
                              : { height: "48px", width: "48px" }
                            : this.props.mobile
                              ? {
                                height: "48px",
                                width: "48px",
                              }
                              : {
                                height: "48px",
                                width: "48px",
                                color: "black",
                                opacity: 0.54,
                              }
                        }
                      />
                    </IconButton>
                  )}
                  <div style={{ textAlign: "right" }}>
                    <MUILink
                      component="button"
                      variant="subtitle1"
                      style={
                        this.props.mobile
                          ? { color: "white" }
                          : {
                            color: "#0083ff",
                          }
                      }
                      onClick={() => {
                        this.setState({ forgotPasswordOpen: true })
                      }}
                    >
                      Forgot password?
                  </MUILink>
                    <MuiThemeProvider
                      theme={
                        this.props.mobile
                          ? createMuiTheme({
                            palette: {
                              primary: { main: "#fff" },
                            },
                          })
                          : ""
                      }
                    >
                      <Button
                        variant={this.props.mobile ? "outlined" : "contained"}
                        primary={true}
                        fullWidth={true}
                        onClick={() => {
                          this.setState({ showLoading: true })
                          this.signIn()
                        }}
                        style={{ margin: "8px 0" }}
                        color="primary"
                        disabled={
                          !(
                            isemail.validate(this.props.email, {
                              errorLevel: true,
                            }) === 0 && this.props.password
                          ) || this.state.showLoading
                        }
                      >
                        Log in
                      {this.state.showLoading && (
                          <MuiThemeProvider
                            theme={createMuiTheme(
                              this.props.mobile
                                ? {
                                  overrides: {
                                    MuiCircularProgress: {
                                      colorPrimary: { color: "#fff" },
                                    },
                                  },
                                }
                                : {
                                  overrides: {
                                    MuiCircularProgress: {
                                      colorPrimary: { color: "#0083ff" },
                                    },
                                  },
                                }
                            )}
                          >
                            <CenteredSpinner isInButton />
                          </MuiThemeProvider>
                        )}
                      </Button>
                    </MuiThemeProvider>
                    <MuiThemeProvider
                      theme={createMuiTheme(
                        this.props.mobile
                          ? {
                            palette: {
                              primary: { main: "#fff" },
                            },
                          }
                          : {
                            palette: {
                              primary: { main: "#0083ff" },
                            },
                          }
                      )}
                    >
                      <Button
                        fullWidth={true}
                        color="primary"
                        disabled={this.state.showLoading}
                        component={Link}
                        to={
                          querystringify.parse(
                            "?" + window.location.href.split("?")[1]
                          ).from
                            ? "/login?from=accounts"
                            : "/login"
                        }
                      >
                        Go back
                    </Button>
                    </MuiThemeProvider>
                  </div>
                </div>
              )}
          </div>
        </div>
        <ForgotPassword
          recover={email => this.recover(email)}
          open={this.state.forgotPasswordOpen}
          close={() => this.setState({ forgotPasswordOpen: false })}
          email={this.props.email}
        />
      </MuiThemeProvider>
    )
  }
}

export default Login
