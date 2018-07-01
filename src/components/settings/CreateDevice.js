import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

class CreateDevice extends React.Component {
  state = { deviceType: "", customName: "" }

  createDeviceMutation = () => {
    this.props["CreateDevice"]({
      variables: {
        deviceType: this.state.deviceType,
        customName: this.state.customName,
      },
    })
  }

  render() {
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
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation CreateDevice($deviceType: String, $customName: String) {
      CreateDevice(deviceType: $deviceType, customName: $customName) {
        id
      }
    }
  `,
  {
    name: "CreateDevice",
  }
)(CreateDevice)
