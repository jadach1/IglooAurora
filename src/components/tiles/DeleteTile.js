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

class DeleteTileDialog extends React.Component {
  deleteValueMutation = () => {
    this.props["DeleteValue"]({
      variables: {
        id: this.props.value.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteValue: {
          id: this.props.value.id,
        },
      },
    })
    this.props.handleDeleteTileDialogClose()
  }

  render() {
    const deleteTileActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.handleDeleteTileDialogClose}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#f44336" }}
          onClick={this.deleteValueMutation}
        >
          Delete
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Delete card"
        actions={deleteTileActions}
        open={this.props.deleteTileOpen}
        onRequestClose={this.props.handleDeleteTileDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
      >
        Be careful, this card will be delete permanently
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation DeleteValue($id: ID!) {
      deleteValue(id: $id)
    }
  `,
  {
    name: "DeleteValue",
  }
)(DeleteTileDialog)
