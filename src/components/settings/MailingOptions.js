import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class MailingOptions extends React.Component {
  state = {
    passwordChange: false,
    tokenGenerated: false,
    transferReceived: false,
    transferAccepted: false,
    sharingAccepted: false,
    sharingReceived: false,
  }

  render() {
    /* const {
      userData: { error, user },
    } = this.props

    if (error) {
      if (error.message === "GraphQL error: This user doesn't exist anymore") {
        this.props.logOut()
      }
    } */

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
          <div
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
              height: "100%",
            }}
          >
            You'll receive an email when:
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.passwordChange}
                  onChange={event =>
                    this.setState({ passwordChange: event.target.checked })
                  }
                  color="primary"
                />
              }
              label="You change your password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.tokenGenerated}
                  onChange={event =>
                    this.setState({ tokenGenerated: event.target.checked })
                  }
                  color="primary"
                />
              }
              label="You generate a token"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.transferReceived}
                  onChange={event =>
                    this.setState({ transferReceived: event.target.checked })
                  }
                  color="primary"
                />
              }
              label="You receive a transfer request"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.transferAccepted}
                  onChange={event =>
                    this.setState({ transferAccepted: event.target.checked })
                  }
                  color="primary"
                />
              }
              label="Someone accepts your transfer request"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.sharingAccepted}
                  onChange={event =>
                    this.setState({ sharingAccepted: event.target.checked })
                  }
                  color="primary"
                />
              }
              label="You receive a sharing request"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.sharingReceived}
                  onChange={event =>
                    this.setState({ sharingReceived: event.target.checked })
                  }
                  color="primary"
                />
              }
              label="Someone accepts your sharing request"
            />
          </div>
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
    query {
      settings {
        passwordChangeEmail

        ADD
        OTHERS
      }
    }
  `,
  { name: "userData" }
)(withMobileDialog({ breakpoint: "xs" })(MailingOptions))
