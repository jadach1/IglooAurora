import React from "react"
import Dialog from "material-ui/Dialog"
import TextField from "material-ui/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import {
  FormControlLabel,
  Checkbox,
  Icon,
  Button,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class CreateBoard extends React.Component {
  state = { customName: "", favorite: false }

  createBoardMutation = () => {
    this.props.CreateBoard({
      variables: {
        customName: this.state.customName,
        favorite: this.state.favorite,
      },
      optimisticResponse: {
        __typename: "Mutation",
        CreateBoard: {
          customName: this.state.customName,
          favorite: this.state.favorite,
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
          onClick={this.createBoardMutation}
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
        <FormControlLabel
          control={
            <MuiThemeProvider
              theme={createMuiTheme({
                palette: {
                  secondary: { main: "#0083ff" },
                },
              })}
            >
              <Checkbox
                onChange={event =>
                  this.setState({ favorite: event.target.checked })
                }
                icon={<Icon>favorite_border</Icon>}
                checkedIcon={<Icon>favorite</Icon>}
              />
            </MuiThemeProvider>
          }
          label="Set as favorite"
        />
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation CreateBoard($customName: String!, $favorite: Boolean) {
      CreateBoard(customName: $customName, favorite: $favorite) {
        id
        customName
        favorite
      }
    }
  `,
  {
    name: "CreateBoard",
  }
)(CreateBoard)
