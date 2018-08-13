import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#f44336" },
  },
})

class DeleteBoard extends React.Component {
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
          buttonStyle={{ backgroundColor: "#f44336" }}
          onClick={this.deleteBoardMutation}
        >
          Delete
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Delete board"
        actions={deleteBoardActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable defaultCursor"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        Be careful, this board will be deleted permanently.
        <br />
        <br />
        Note that by deleting a board, you won't delete any of its devices.
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation DeleteBoard($id: ID!) {
      deleteBoard(id: $id)
    }
  `,
  {
    name: "DeleteBoard",
  }
)(DeleteBoard)
