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

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class RevokeOwnerChange extends Component {
  revokeInvite = () => {
    this.props.RevokePendingOwnerChange({
      variables: {
        pendingOwnerChangeId: this.props.menuTarget.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        revokePendingOwnerChange: {
          pendingOwnerChangeId: this.props.menuTarget.id,
          __typename: "PendingOwnerChange",
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
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
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
          {this.props.menuTarget && this.props.menuTarget.name}'s invite?
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
    mutation RevokePendingOwnerChange($pendingOwnerChangeId: ID!) {
      revokePendingOwnerChange(pendingOwnerChangeId: $pendingOwnerChangeId)
    }
  `,
  {
    name: "RevokePendingOwnerChange",
  }
)(RevokeOwnerChange)
