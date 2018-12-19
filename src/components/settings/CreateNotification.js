import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import MenuItem from "@material-ui/core/MenuItem"
import CenteredSpinner from "../CenteredSpinner"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Icon from "@material-ui/core/Icon"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"

const MOBILE_WIDTH = 600

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
    device: "",
  }

  handleChange = (event, index, value) => this.setState({ value })

  componentWillReceiveProps(nextProps) {
    if (!this.state.device && nextProps.allDevices.length) {
      this.setState({ device: nextProps.allDevices[0].id })
    }
  }

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let createNotificationMutation = () => {
      this.props.CreateNotification({
        variables: {
          deviceId: this.state.device,
          content: this.state.content,
        },
      })
    }

    let deviceList = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user)
      deviceList = (
        <TextField
          value={this.state.device}
          onChange={event => {
            this.setState({ device: event.target.value })
          }}
          select
          variant="outlined"
          name="device"
          label="Device"
          style={{ width: "100%", marginBottom: "16px" }}
        >
          {this.props.allDevices.map(device => (
            <MenuItem value={device.id}>{device.name}</MenuItem>
          ))}
        </TextField>
      )

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Create notification</DialogTitle>
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
            <TextField
              id="adornment-name-login"
              variant="outlined"
              label="Notification content"
              value={this.state.content}
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      color: "white",
                      width: "100%",
                      marginBottom: "8px",
                    }
                  : {
                      color: "black",
                      width: "100%",
                      marginBottom: "8px",
                    }
              }
              multiline
              rows="4"
              onChange={event => this.setState({ content: event.target.value })}
              endAdornment={
                this.state.content && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ content: "" })}
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }
            />
          </div>
          <DialogActions>
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
              variant="contained"
              color="primary"
              label="Change"
              disabled={
                !this.state.content || !this.state.deviceIndex === "undefined"
              }
              onClick={() => {
                createNotificationMutation()
                this.props.close()
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation CreateNotification(
      $deviceId: ID!
      $content: String!
      $date: DateTime
    ) {
      createNotification(deviceId: $deviceId, content: $content, date: $date) {
        id
      }
    }
  `,
  {
    name: "CreateNotification",
  }
)(CreateNotification)
