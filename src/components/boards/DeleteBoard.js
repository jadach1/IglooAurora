import React from "react"
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  MuiThemeProvider,
  createMuiTheme,
  Grow,
  Slide,
} from "@material-ui/core"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

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
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle>Delete board</DialogTitle>
        <font
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Be careful, this board will be deleted permanently.
          <br />
          <br />
          Note that by deleting a board, you will delete all of its devices.
          <br /> <br />
        </font>
                <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
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
              style={{ marginRight: "4px" }}
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
    mutation DeleteBoard($id: ID!) {
      deleteBoard(id: $id)
    }
  `,
  {
    name: "DeleteBoard",
  }
)(DeleteBoard)
