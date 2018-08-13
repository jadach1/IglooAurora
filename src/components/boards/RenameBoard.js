import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class RenameBoard extends React.Component {
  state = { customName: null }

  rename = () => {
    this.props["Rename"]({
      variables: {
        id: this.props.board.id,
        customName: this.state.customName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        board: {
          __typename: this.props.board.__typename,
          id: this.props.board.id,
          customName: this.state.customName,
        },
      },
    })
    this.props.close()
  }

  render() {
    const renameBoardActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.rename}
          disabled={!this.state.customName}
        >
          Rename
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Rename board"
        actions={renameBoardActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        <TextField
          floatingLabelText="Board name"
          defaultValue={this.props.board.customName}
          floatingLabelShrinkStyle={{ color: "#0083ff" }}
          underlineFocusStyle={{ borderColor: "#0083ff" }}
          style={{ width: "100%" }}
          onChange={event => this.setState({ customName: event.target.value })}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.rename()
            }
          }}
        />
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation Rename($id: ID!, $customName: String) {
      board(id: $id, customName: $customName) {
        id
        customName
      }
    }
  `,
  {
    name: "Rename",
  }
)(RenameBoard)
