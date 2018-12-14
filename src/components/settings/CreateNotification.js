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
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import Input from "@material-ui/core/Input"
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
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let createNotificationMutation = () => {
      this.props.CreateNotification({
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
        <FormControl style={{ width: "100%" }}>
          <Select
            value={this.state.device || 0}
            onChange={event => {
              this.setState({ device: event.target.value })
            }}
            name="device"
          >
            {this.props.allDevices.map(device => (
              <MenuItem value={device.index}>{device.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
            <br />
            <br />

            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-name-login"
                placeholder="Notification content"
                value={this.state.content}
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }
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
            </FormControl>
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
      $date: Date
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
