import React, { Component } from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import withMobileDialog from "@material-ui/core/withMobileDialog"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class RevokeInvite extends Component {
  revokeInvite = () => {
    this.props.RevokeInvite({
      variables: {
        pendingEnvironmentShareId: this.props.menuTarget.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        revokePendingEnvironmentShare: {
          pendingEnvironmentShareId: this.props.menuTarget.id,
          __typename: "PendingEnvironmentShare",
        },
      },
    })
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Revoke invite</DialogTitle>
        <div
          style={{
            paddingLeft: "24px",
            paddingRight: "24px",
            height: "100%",
            marginBottom: "16px",
          }}
        >
          Are you sure you want to revoke{" "}
          {this.props.menuTarget &&
            this.props.menuTarget.receiver &&
            this.props.menuTarget.receiver.name}
          's invite?
        </div>
        <DialogActions>
          <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
            Never mind
          </Button>
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#f44336" },
              },
            })}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.revokeInvite()
                this.props.close()
              }}
              style={{
                margin: "0 4px",
              }}
            >
              Revoke
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation RevokeInvite($pendingEnvironmentShareId: ID!) {
      revokePendingEnvironmentShare(
        pendingEnvironmentShareId: $pendingEnvironmentShareId
      )
    }
  `,
  {
    name: "RevokeInvite",
  }
)(withMobileDialog({ breakpoint: "xs" })(RevokeInvite))
