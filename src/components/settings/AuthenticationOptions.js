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
import MailOutline from "@material-ui/icons/MailOutline"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import Visibility from "@material-ui/icons/Visibility"
import CenteredSpinner from "../CenteredSpinner"
import InputAdornment from "@material-ui/core/InputAdornment"
import ToggleIcon from "material-ui-toggle-icon"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"

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

class AuthenticationOptions extends React.Component {
  state = { selectAuthTypeOpen: false }

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
          tokenType: "ENABLE_WEBAUTHN",
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

  enableddWebAuthn = async () => {
    const {
      data: { getWebauthnSubscribeChallenge },
    } = await this.props.client.query({
      query: gql`
        query getWebauthnSignUpChallenge($email: String!) {
          getWebauthnSubscribeChallenge(email: $email) {
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
      getWebauthnSubscribeChallenge.publicKeyOptions
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

      await this.props.client.mutate({
        mutation: gql`
          mutation($jwtChallenge: String!, $challengeResponse: String!) {
            enableWebauthn(
              jwtChallenge: $jwtChallenge
              challengeResponse: $challengeResponse
            )
          }
        `,
        variables: {
          challengeResponse: JSON.stringify(payload),
          jwtChallenge: getWebauthnSubscribeChallenge.jwtChallenge,
        },
      })
    }

    navigator.credentials
      .create({ publicKey: publicKeyOptions })
      .then(sendResponse)
  }

  render() {
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
              onClick={() => this.setState({ selectAuthTypeOpen: true })}
              disabled={!this.state.password || this.state.showLoading}
            >
              Proceed
              {this.state.showLoading && <CenteredSpinner isInButton />}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.selectAuthTypeOpen}
          onClose={() => this.setState({ selectAuthTypeOpen: false })}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          titleClassName="defaultCursor"
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
              Passwordless authentication
            </font>
          </DialogTitle>
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
              <li key="yourEnvironments">
                <ul style={{ padding: "0" }}>
                  <ListSubheader>Enabled</ListSubheader>
                  <ListItem onClick={this.enableddWebAuthn} button>
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
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <MailOutline />
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
                          Email authentication
                        </font>
                      }
                    />
                  </ListItem>
                </ul>
              </li>
              <li key="yourEnvironments">
                <ul style={{ padding: "0" }}>
                  <ListSubheader>Disabled</ListSubheader>
                </ul>
              </li>
            </List>
          </div>
          <DialogActions>
            <Button onClick={this.props.close}>
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
      </React.Fragment>
    )
  }
}

export default withMobileDialog({ breakpoint: "xs" })(AuthenticationOptions)
