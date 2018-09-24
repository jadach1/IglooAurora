import React from "react"
import Dialog from "material-ui/Dialog"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  Icon,
} from "@material-ui/core"
import { RadioButtonGroup, RadioButton } from "material-ui"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class ChangeBoard extends React.Component {
  state = { newBoard: this.props.device.board.id }

  changeBoard = () => {
    this.props["ChangeBoard"]({
      variables: {
        id: this.props.device.id,
        boardId: this.state.newBoard,
      },
      optimisticResponse: {
        __typename: "Mutation",
        device: {
          __typename: this.props.device.__typename,
          id: this.props.device.id,
          boardId: this.state.newBoard,
        },
      },
    })
    this.props.close()
  }

  render() {
    const {
      userData: { user },
    } = this.props

    const changeBoardActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.changeBoard}
          disabled={this.state.newBoard === this.props.device.board.id}
        >
          Change board
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Change board"
        actions={changeBoardActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        Board
        <RadioButtonGroup
          name="date"
          onChange={(event, value) => this.setState({ newBoard: value })}
          valueSelected={this.state.newBoard || this.props.device.board.id}
        >
          {user &&
            user.boards.map(board => (
              <RadioButton
                value={board.id}
                label={board.customName}
                style={{
                  marginTop: 12,
                  marginBottom: 16,
                }}
                rippleStyle={{ color: "#0083ff" }}
                checkedIcon={
                  <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
                }
                uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
              />
            ))}
        </RadioButtonGroup>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeBoard($id: ID!, $boardId: ID) {
      device(id: $id, boardId: $boardId) {
        id
        board {
          id
        }
      }
    }
  `,
  {
    name: "ChangeBoard",
  }
)(ChangeBoard)
