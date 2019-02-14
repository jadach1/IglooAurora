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
        email: "andrea@igloo.ooo",
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
          open={this.props.open}
          onClose={this.props.close}
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
