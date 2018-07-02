import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import DropDownMenu from "material-ui/DropDownMenu"
import MenuItem from "material-ui/MenuItem"
import CenteredSpinner from "../CenteredSpinner"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

export default class CreatePlotNode extends React.Component {
  state = {
    content: "",
    activeStep: 0,
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    const {
      userData: { loading, error, user },
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
          disabled={!this.state.content}
        >
          Create
        </Button>
      </MuiThemeProvider>,
    ]

    let deviceList = ""
    let plotList = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user) {
      deviceList = (
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          maxHeight={250}
          style={{ width: "300px" }}
          anchorOrigin={{ horizontal: "middle", vertical: "top" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
        >
          {user.devices.map(device => (
            <MenuItem
              value={user.devices.indexOf(device)}
              primaryText={device.customName}
              style={{ width: "300px" }}
              className="notSelectable"
            />
          ))}
        </DropDownMenu>
      )

      plotList = (
        <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}
          maxHeight={250}
          style={{ width: "300px" }}
          anchorOrigin={{ horizontal: "middle", vertical: "top" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
        />
      )
    }

    return (
      <React.Fragment>
        <Dialog
          title="Create plot node"
          actions={actions}
          open={this.props.open}
          contentStyle={{ width: "350px" }}
          onRequestClose={this.props.close}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <div style={{ height: "200px" }}>
            {deviceList}
            <br />
            <br />
            {plotList}
            <br />
            <br />
            <TextField
              floatingLabelShrinkStyle={{ color: "#0083ff" }}
              underlineFocusStyle={{ borderColor: "#0083ff" }}
              floatingLabelText="Notification content"
              style={{ width: "100%" }}
              onChange={event => this.setState({ content: event.target.value })}
            />
          </div>
        </Dialog>
      </React.Fragment>
    )
  }
}
