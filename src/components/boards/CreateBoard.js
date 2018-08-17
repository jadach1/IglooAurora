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

class CreateBoard extends React.Component {
  state = { customName: "" }

  createBoardMutation = customName => {
    this.props.CreateBoard({
      variables: {
        customName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        CreateBoard: {
          customName,
          __typename: "Board",
        },
      },
    })
    this.props.close()
  }

  render() {
    const createBoardActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={() => this.createBoardMutation(this.state.customName)}
          disabled={!this.state.customName}
        >
          Create board
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Create board"
        actions={createBoardActions}
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
          floatingLabelShrinkStyle={{ color: "#0083ff" }}
          underlineFocusStyle={{ borderColor: "#0083ff" }}
          style={{ width: "100%" }}
          onChange={event => this.setState({ customName: event.target.value })}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.createBoardMutation(this.state.customName)
            }
          }}
        />
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation CreateBoard($customName: String!) {
      CreateBoard(customName: $customName) {
        id
        customName
      }
    }
  `,
  {
    name: "CreateBoard",
  }
)(CreateBoard)
