import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MenuItem from "material-ui/MenuItem"
import CenteredSpinner from "../CenteredSpinner"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Icon from "@material-ui/core/Icon"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
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

class CreateNotification extends React.Component {
  state = {
    content: "",
    activeStep: 0,
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let createNotificationMutation = () => {
      this.props["CreateNotification"]({
        variables: {
          deviceId: user.devices[this.props.device].id,
        },
      })
    }

    let deviceList = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user)
      deviceList = (
        <MuiThemeProvider theme={theme}>
          <FormControl style={{ width: "100%" }}>
            <Select
              value={this.state.device || 0}
              onChange={event => {
                this.setState({ device: event.target.value })
              }}
              name="device"
            >
              {user.devices.map(device => (
                <MenuItem value={device.index}>{device.customName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </MuiThemeProvider>
      )

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            style={
              window.innerWidth < MOBILE_WIDTH
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { width: "calc(100% - 48px)", background: "#2f333d" }
                  : { width: "calc(100% - 48px)", background: "#fff" }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { width: "350px", background: "#2f333d" }
                  : { width: "350px", background: "#fff" }
            }
          >
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "#fff" }
                  : {}
              }
            >
              Create notification
            </font>
          </DialogTitle>
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                    background: "#2f333d",
                  }
                : {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                  }
            }
          >
            {deviceList}
            <br />
            <br />
            <MuiThemeProvider theme={theme}>
              <FormControl style={{ width: "100%" }}>
                <Input
                  id="adornment-name-login"
                  placeholder="Notification content"
                  value={this.state.content}
                  onChange={event =>
                    this.setState({ content: event.target.value })
                  }
                  /*  onKeyPress={event => {
                        if (event.key === "Enter") createDeviceMutation()
                      }} */
                  endAdornment={
                    this.state.content && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => this.setState({ content: "" })}
                          tabIndex="-1"
                        >
                          <Icon>clear</Icon>
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                />
              </FormControl>
            </MuiThemeProvider>
            <br />
          </div>
          <DialogActions
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    padding: "8px",
                    margin: "0",
                    background: "#2f333d",
                  }
                : {
                    padding: "8px",
                    margin: "0",
                  }
            }
          >
            <MuiThemeProvider theme={theme}>
              <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : {}
                  }
                >
                  Never mind
                </font>
              </Button>
              <Button
                variant="raised"
                color="primary"
                label="Change"
                primary={true}
                buttonStyle={{ backgroundColor: "#0083ff" }}
                disabled={!this.state.content || !this.state.device}
                onClick={() => {
                  createNotificationMutation()
                  this.props.close()
                }}
              >
                Create
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation CreateDevice(
      $deviceType: String
      $customName: String!
      $boardId: ID!
      $firmware: String
    ) {
      CreateDevice(
        deviceType: $deviceType
        customName: $customName
        boardId: $boardId
        firmware: $firmware
      ) {
        id
      }
    }
  `,
  {
    name: "CreateDevice",
  }
)(CreateNotification)
