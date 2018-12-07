import React from "react"
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

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

const MOBILE_WIDTH = 600

class LeaveBoard extends React.Component {
  deleteBoardMutation = () => {
    this.props["DeleteBoard"]({
      variables: {
        id: this.props.board.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteBoard: {
          id: this.props.board.id,
        },
      },
    })
    this.props.close()
  }

  stopSharing = () => {
    this.props.StopSharing({
      variables: {
        boardId: this.props.board.id,
        email: this.props.userData.user.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stopSharing: {
          id: this.props.board.id,
          email: this.props.userData.user.email,
          __typename: "Board",
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
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Leave board</DialogTitle>
        <div style={{ paddingLeft: "24px", height: "100%" }}>
          Are you sure you want to leave {this.props.board.name}?
        </div>
        <br />
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
                this.stopSharing()
                this.props.close()
              }}
              style={{ margin: "0 4px" }}
            >
              Leave board
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation StopSharing($email: String!, $boardId: ID!) {
      stopSharingBoard(email: $email, boardId: $boardId) {
        id
      }
    }
  `,
  {
    name: "StopSharing",
  }
)(
  graphql(
    gql`
      mutation DeleteBoard($id: ID!) {
        deleteBoard(id: $id)
      }
    `,
    {
      name: "DeleteBoard",
    }
  )(LeaveBoard)
)
