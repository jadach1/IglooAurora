import React from "react"
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Grow,
  Slide,
} from "@material-ui/core"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

const MOBILE_WIDTH = 500

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
      >
        <DialogTitle style={{ width: "350px" }}>Leave board</DialogTitle>
        <div style={{ paddingLeft: "24px", height: "100%" }}>
          Are you sure you want to leave {this.props.board.customName}?
        </div>
        <br />
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              onClick={this.stopSharing}
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
