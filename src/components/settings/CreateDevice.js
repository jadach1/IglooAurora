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
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/lab/Slider"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Switch from "@material-ui/core/Switch"
import ExpandMore from "@material-ui/icons/ExpandMore"
import Clear from "@material-ui/icons/Clear"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class CreateDevice extends React.Component {
  state = {
    deviceType: "",
    name: "",
    environment: "",
    battery: 0,
    signal: 0,
    batteryCharging: false,
    expanded: "general",
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.environment &&
      nextProps.userData.user &&
      nextProps.userData.user.environments.length
    ) {
      this.setState({ environment: nextProps.userData.user.environments[0].id })
    }

    if (this.props.open !== nextProps.open && nextProps.open === true) {
      this.setState({
        name: "",
        nameEmpty: "",
        deviceType: "",
        deviceTypeEmpty: "",
      })
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
      this.props.CreateDevice({
        variables: {
          deviceType: this.state.deviceType,
          name: this.state.name,
          environmentId: this.state.environment,
        },
      })

      this.props.close()
    }

    if (user)
      environments = (
        <TextField
          value={this.state.environment}
          onChange={event => {
            this.setState({
              environment: event.target.value,
            })
          }}
          label="Environment"
          variant="outlined"
          select
          required
          style={{ width: "100%", marginBottom: "16px" }}
          InputLabelProps={this.state.environment && { shrink: true }}
          disabled={user.environments.length < 2}
        >
          {user.environments
            .sort(function(a, b) {
              if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1
              }
              if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1
              }
              return 0
            })
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
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
          className="notSelectable"
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
            <ExpansionPanel
              expanded={this.state.expanded === "general"}
              onChange={(event, expanded) =>
                this.setState({ expanded: expanded ? "general" : null })
              }
            >
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography>General</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <TextField
                  id="create-device-name"
                  label="Name"
                  value={this.state.name}
                  error={this.state.nameEmpty}
                  helperText={
                    this.state.nameEmpty ? "This field is required" : " "
                  }
                  onChange={event =>
                    this.setState({
                      name: event.target.value,
                      nameEmpty: event.target.value === "",
                    })
                  }
                  style={{ width: "100%", marginBottom: "16px" }}
                  onKeyPress={event => {
                    if (
                      event.key === "Enter" &&
                      this.state.deviceType &&
                      !this.state.name
                    ) {
                      createDeviceMutation()
                    }
                  }}
                  required
                  variant="outlined"
                  InputLabelProps={this.state.name && { shrink: true }}
                  InputProps={{
                    endAdornment: this.state.name && (
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
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="create-device-type"
                  label="Device type"
                  value={this.state.deviceType}
                  variant="outlined"
                  error={this.state.deviceTypeEmpty}
                  helperText={
                    this.state.deviceTypeEmpty ? "This field is required" : " "
                  }
                  onChange={event =>
                    this.setState({
                      deviceType: event.target.value,
                      deviceTypeEmpty: event.target.value === "",
                    })
                  }
                  onKeyPress={event => {
                    if (
                      event.key === "Enter" &&
                      this.state.deviceType &&
                      !this.state.name
                    ) {
                      createDeviceMutation()
                    }
                  }}
                  required
                  style={{ width: "100%", marginBottom: "16px" }}
                  InputLabelProps={this.state.deviceType && { shrink: true }}
                  InputProps={{
                    endAdornment: this.state.deviceType && (
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
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {environments}
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel
              expanded={this.state.expanded === "advanced"}
              onChange={(event, expanded) =>
                this.setState({ expanded: expanded ? "advanced" : null })
              }
            >
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography>Advanced</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <TextField
                  id="device-index"
                  label="Index"
                  value={this.state.index}
                  helperText=" "
                  type="number"
                  onChange={event =>
                    this.setState({
                      index: event.target.value,
                    })
                  }
                  onKeyPress={event => {
                    if (
                      event.key === "Enter" &&
                      this.state.deviceType &&
                      !this.state.name
                    ) {
                      createDeviceMutation()
                    }
                  }}
                  style={{ width: "100%", marginBottom: "16px" }}
                  variant="outlined"
                  InputLabelProps={this.state.index && { shrink: true }}
                />
                <Typography>Signal</Typography>
                <Slider
                  value={this.state.signal}
                  onChange={(event, value) => this.setState({ signal: value })}
                  min={0}
                  max={100}
                  step={1}
                />
                <Typography>Battery</Typography>
                <Slider
                  value={this.state.battery}
                  onChange={(event, value) => this.setState({ battery: value })}
                  min={0}
                  max={100}
                  step={1}
                />
                <List
                  style={{
                    padding: "0",
                  }}
                >
                  <ListItem style={{ marginTop: "-3px", marginBottom: "13px" }}>
                    <ListItemText
                      primary={
                        <font
                          style={
                            typeof Storage !== "undefined" &&
                            localStorage.getItem("nightMode") === "true"
                              ? { color: "white" }
                              : {}
                          }
                        >
                          Battery charging
                        </font>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={this.state.batteryCharging}
                        onChange={event =>
                          this.setState(oldState => ({
                            batteryCharging: !oldState.batteryCharging,
                          }))
                        }
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
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
      $deviceType: String!
      $name: String!
      $environmentId: ID!
    ) {
      createDevice(
        deviceType: $deviceType
        name: $name
        environmentId: $environmentId
      ) {
        id
      }
    }
  `,
  {
    name: "CreateDevice",
  }
)(withMobileDialog({ breakpoint: "xs" })(CreateDevice))
