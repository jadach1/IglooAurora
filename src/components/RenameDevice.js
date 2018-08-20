import React from "react"
import Dialog from "material-ui/Dialog"
import TextField from "material-ui/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme, Button } from "@material-ui/core"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class RenameDevice extends React.Component {
  state = { customName: null }

  rename = () => {
    this.props["Rename"]({
      variables: {
        id: this.props.device.id,
        customName: this.state.customName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        device: {
          __typename: this.props.device.__typename,
          id: this.props.device.id,
          customName: this.state.customName,
        },
      },
    })
    this.props.close()
  }

  render() {
    const renameDeviceActions = [
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
        title="Rename device"
        actions={renameDeviceActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        <TextField
          floatingLabelText="Device name"
          defaultValue={this.props.device.customName}
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
      device(id: $id, customName: $customName) {
        id
        customName
      }
    }
  `,
  {
    name: "Rename",
  }
)(RenameDevice)
