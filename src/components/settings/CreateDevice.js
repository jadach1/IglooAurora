import React from "react"
import Dialog from "material-ui/Dialog"
import TextField from "material-ui/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"
import {
  FormControl,
  Select,
  MenuItem,
  Button,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

class CreateDevice extends React.Component {
  state = { deviceType: "", customName: "", board: 0 }

  createDeviceMutation = () => {
    this.props["CreateDevice"]({
      variables: {
        deviceType: this.state.deviceType,
        customName: this.state.customName,
      },
    })
  }

  render() {
    const {
      userData: { error, user, loading },
    } = this.props

    const actions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          label="Change"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.createDeviceMutation}
          disabled={!this.state.deviceType || !this.state.customName}
        >
          Create
        </Button>
      </MuiThemeProvider>,
    ]

    let boards = ""

    if (error) boards = "Unexpected error"

    if (loading) boards = <CenteredSpinner />

    if (user)
      boards = (
        <FormControl>
          <Select
            value={this.state.board}
            onChange={event => {
              this.setState({ board: event.target.value })
            }}
            displayEmpty
            name="board"
          >
            {user.boards.map(board => (
              <MenuItem value={board.index}>{board.customName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )

    return (
      <React.Fragment>
        <Dialog
          title="Create device"
          actions={actions}
          open={this.props.open}
          contentStyle={{ width: "350px" }}
          onRequestClose={this.props.close}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Custom name"
            style={{ width: "100%" }}
            onChange={event =>
              this.setState({ deviceType: event.target.value })
            }
          />
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Device type"
            style={{ width: "100%" }}
            onChange={event =>
              this.setState({ customName: event.target.value })
            }
          />
          {boards}
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation CreateDevice($deviceType: String, $customName: String!) {
      CreateDevice(deviceType: $deviceType, customName: $customName) {
        id
      }
    }
  `,
  {
    name: "CreateDevice",
  }
)(CreateDevice)
