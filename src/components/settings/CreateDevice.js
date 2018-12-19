import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Icon from "@material-ui/core/Icon"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class CreateDevice extends React.Component {
  state = { deviceType: "", name: "", environment: "" }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.environment &&
      nextProps.userData.user &&
      nextProps.userData.user.environments.length
    ) {
      this.setState({ environment: nextProps.userData.user.environments[0].id })
    }
  }

  render() {
    const {
      userData: { error, user, loading },
    } = this.props

    let environments = ""

    if (error) environments = "Unexpected error"

    if (loading) environments = <CenteredSpinner />

    let createDeviceMutation = () => {
      this.props["CreateDevice"]({
        variables: {
          deviceType: this.state.deviceType,
          name: this.state.name,
          environmentId: this.state.environment,
          firmware: this.state.firmware,
        },
      })

      this.props.close()
    }

    if (user)
      environments = (
        <TextField
          value={this.state.environment}
          onChange={event => {
            this.setState({ environment: event.target.value })
          }}
          label="Environment"
          variant="outlined"
          select
          style={{ width: "100%", marginBottom: "16px" }}
          InputLabelProps={{ shrink: true }}
        >
          {user.environments
            .filter(
              environment =>
                environment.myRole === "ADMIN" || environment.myRole === "OWNER"
            )
            .map(environment => (
              <MenuItem value={environment.id}>{environment.name}</MenuItem>
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
          <DialogTitle disableTypography>Create device</DialogTitle>
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
            <TextField
              id="adornment-name-login"
              label="Custom name"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
              style={{ width: "100%", marginBottom: "16px" }}
              onKeyPress={event => {
                if (event.key === "Enter") createDeviceMutation()
              }}
              variant="outlined"
              endAdornment={
                this.state.name && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ name: "" })}
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
            <TextField
              id="adornment-name-login"
              label="Device type"
              value={this.state.deviceType}
              variant="outlined"
              onChange={event =>
                this.setState({ deviceType: event.target.value })
              }
              onKeyPress={event => {
                if (event.key === "Enter") createDeviceMutation()
              }}
              style={{ width: "100%", marginBottom: "16px" }}
              endAdornment={
                this.state.deviceType && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ deviceType: "" })}
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
            {environments}
            <TextField
              id="adornment-name-login"
              label="Firmware"
              value={this.state.firmware}
              style={{ width: "100%", marginBottom: "8px" }}
              variant="outlined"
              onChange={event =>
                this.setState({ firmware: event.target.value })
              }
              onKeyPress={event => {
                if (event.key === "Enter") createDeviceMutation()
              }}
              endAdornment={
                this.state.firmware && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ firmware: "" })}
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
            <Button
              onClick={this.props.close}
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white", marginRight: "4px" }
                  : { marginRight: "4px" }
              }
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              label="Change"
              primary={true}
              onClick={createDeviceMutation}
              disabled={!this.state.deviceType || !this.state.name}
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
    mutation CreateDevice(
      $deviceType: String
      $name: String!
      $environmentId: ID!
      $firmware: String
    ) {
      createDevice(
        deviceType: $deviceType
        name: $name
        environmentId: $environmentId
        firmware: $firmware
      ) {
        id
      }
    }
  `,
  {
    name: "CreateDevice",
  }
)(CreateDevice)
