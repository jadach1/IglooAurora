import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"
import { graphql } from "react-apollo"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

let settings = []

class MailingOptions extends React.Component {
  settingsMutation(passwordChangeEmail) {
    this.props.MutateSettings({
      variables: {
        passwordChangeEmail,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          passwordChangeEmail,
        },
      },
    })
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
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Mailing options</DialogTitle>
          <Query
            query={gql`
              {
                user {
                  id
                  settings {
                    passwordChangeEmail
                    pendingOwnerChangeReceivedEmail
                    pendingEnvironmentShareReceivedEmail
                    pendingOwnerChangeAcceptedEmail
                    pendingEnvironmentShareAcceptedEmail
                    permanentTokenCreatedEmail
                  }
                }
              }
            `}
            skip={!this.props.open}
          >
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <div
                    style={{
                      height: "100%",
                    }}
                  >
                    <CenteredSpinner />
                  </div>
                )

              if (error) return "Unexpected error"

              if (data) {
                settings = data.user.settings
              }

              return (
                <div
                  style={{
                    paddingRight: "24px",
                    paddingLeft: "24px",
                    height: "100%",
                  }}
                >
                  You'll receive an email when:
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.passwordChangeEmail}
                        onChange={event =>
                          this.settingsMutation(event.target.checked)
                        }
                        color="primary"
                        style={{ marginRight: "8px" }}
                      />
                    }
                    style={{ marginTop: "8px" }}
                    label="You change your password"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.pendingOwnerChangeReceivedEmail}
                        onChange={event =>
                          this.setState({
                            tokenGenerated: event.target.checked,
                          })
                        }
                        color="primary"
                        style={{ marginRight: "8px" }}
                      />
                    }
                    label="You generate a token"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.pendingEnvironmentShareReceivedEmail}
                        onChange={event =>
                          this.setState({
                            transferReceived: event.target.checked,
                          })
                        }
                        color="primary"
                        style={{ marginRight: "8px" }}
                      />
                    }
                    label="You receive a transfer request"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.pendingOwnerChangeAcceptedEmail}
                        onChange={event =>
                          this.setState({
                            transferAccepted: event.target.checked,
                          })
                        }
                        color="primary"
                        style={{ marginRight: "8px" }}
                      />
                    }
                    label="Someone accepts your transfer request"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.pendingEnvironmentShareAcceptedEmail}
                        onChange={event =>
                          this.setState({
                            sharingAccepted: event.target.checked,
                          })
                        }
                        color="primary"
                        style={{ marginRight: "8px" }}
                      />
                    }
                    label="You receive a sharing request"
                  />
                  <br />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={settings.permanentTokenCreatedEmail}
                        onChange={event =>
                          this.setState({
                            sharingReceived: event.target.checked,
                          })
                        }
                        color="primary"
                        style={{ marginRight: "8px" }}
                      />
                    }
                    label="Someone accepts your sharing request"
                  />
                </div>
              )
            }}
          </Query>
          <DialogActions>
            <Button onClick={this.props.close}>Close</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation settings($passwordChangeEmail: Boolean) {
      claimDevice(passwordChangeEmail: $passwordChangeEmail) {
        id
        passwordChangeEmail
      }
    }
  `,
  {
    name: "MutateSettings",
  }
)(withMobileDialog({ breakpoint: "xs" })(MailingOptions))
