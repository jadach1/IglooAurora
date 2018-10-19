import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#f44336" },
  },
})

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

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
    return (
      <Dialog
        open={this.props.deleteTileOpen}
        onRequestClose={this.props.handleDeleteTileDialogClose}
        className="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle>Delete card</DialogTitle>
        <div
          style={{ paddingRight: "24px", paddingLeft: "24px", height: "100%" }}
        >
          Be careful, this card will be deleted permanently
          <br /> <br />
        </div>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button
              onClick={this.props.handleDeleteTileDialogClose}
              style={{ marginRight: "4px" }}
            >
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
          </MuiThemeProvider>
        </DialogActions>
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
