import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

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
    const deleteBoardActions = [
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
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Leave board"
        actions={deleteBoardActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable defaultCursor"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        Are you sure you want to leave {this.props.board.customName}?
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
