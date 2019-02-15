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
  passwordChangeEmailMutation = passwordChangeEmail => {
    this.props.PasswordChangeEmail({
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

  pendingOwnerChangeReceivedEmailMutation = pendingOwnerChangeReceivedEmail => {
    this.props.PendingOwnerChangeReceivedEmail({
      variables: {
        pendingOwnerChangeReceivedEmail,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          pendingOwnerChangeReceivedEmail,
        },
      },
    })
  }

  pendingEnvironmentShareReceivedEmailMutation = pendingEnvironmentShareReceivedEmail => {
    this.props.PendingEnvironmentShareReceivedEmail({
      variables: {
        pendingEnvironmentShareReceivedEmail,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          pendingEnvironmentShareReceivedEmail,
        },
      },
    })
  }

  pendingOwnerChangeAcceptedEmailMutation = pendingOwnerChangeAcceptedEmail => {
    this.props.PendingOwnerChangeAcceptedEmail({
      variables: {
        pendingOwnerChangeAcceptedEmail,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          pendingOwnerChangeAcceptedEmail,
        },
      },
    })
  }

  pendingEnvironmentShareAcceptedEmailMutation = pendingEnvironmentShareAcceptedEmail => {
    this.props.PendingEnvironmentShareAcceptedEmail({
      variables: {
        pendingEnvironmentShareAcceptedEmail,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          pendingEnvironmentShareAcceptedEmail,
        },
      },
    })
  }

  permanentTokenCreatedEmailMutation = permanentTokenCreatedEmail => {
    this.props.PermanentTokenCreatedEmail({
      variables: {
        permanentTokenCreatedEmail,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          permanentTokenCreatedEmail,
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
                          this.passwordChangeEmailMutation(event.target.checked)
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
                        checked={settings.permanentTokenCreatedEmail}
                        onChange={event =>
                          this.permanentTokenCreatedEmailMutation(
                            event.target.checked
                          )
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
                          this.pendingEnvironmentShareReceivedEmailMutation(
                            event.target.checked
                          )
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
                          this.pendingOwnerChangeAcceptedEmailMutation(
                            event.target.checked
                          )
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
                          this.pendingEnvironmentShareAcceptedEmailMutation(
                            event.target.checked
                          )
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
                          this.permanentTokenCreatedEmailMutation(
                            event.target.checked
                          )
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
    mutation settings($pendingOwnerChangeAcceptedEmail: Boolean) {
      settings(pendingOwnerChangeAcceptedEmail: $pendingOwnerChangeAcceptedEmail) {
        pendingOwnerChangeAcceptedEmail
      }
    }
  `,
  {
    name: "PendingOwnerChangeAcceptedEmail",
  }
)(graphql(
  gql`
    mutation settings($pendingEnvironmentShareReceivedEmail: Boolean) {
      settings(pendingEnvironmentShareReceivedEmail: $pendingEnvironmentShareReceivedEmail) {
        pendingEnvironmentShareReceivedEmail
      }
    }
  `,
  {
    name: "PendingEnvironmentShareReceivedEmail",
  }
)(graphql(
  gql`
    mutation settings($pendingOwnerChangeReceivedEmail: Boolean) {
      settings(pendingOwnerChangeReceivedEmail: $pendingOwnerChangeReceivedEmail) {
        pendingOwnerChangeReceivedEmail
      }
    }
  `,
  {
    name: "PendingOwnerChangeReceivedEmail",
  }
)(graphql(
  gql`
    mutation settings($passwordChangeEmail: Boolean) {
      settings(passwordChangeEmail: $passwordChangeEmail) {
        passwordChangeEmail
      }
    }
  `,
  {
    name: "PasswordChangeEmail",
  }
)(
  graphql(
    gql`
      mutation settings($permanentTokenCreatedEmail: Boolean) {
        settings(permanentTokenCreatedEmail: $permanentTokenCreatedEmail) {
          permanentTokenCreatedEmail
        }
      }
    `,
    {
      name: "PermanentTokenCreatedEmail",
    }
  )(withMobileDialog({ breakpoint: "xs" })(MailingOptions))
))
))