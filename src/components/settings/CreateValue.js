import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Icon from "@material-ui/core/Icon"
import MenuItem from "@material-ui/core/MenuItem"
import CenteredSpinner from "../CenteredSpinner"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class CreateValue extends React.Component {
  state = {
    name: "",
    device: "",
    type: "",
    permission: "READ_ONLY",
    visibility: "VISIBLE",
    valueSettingsOpen: false,
    value: null,
  }

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1,
    }))
  }

  handleStepChange = activeStep => {
    this.setState({ activeStep })
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

    let devices = ""

    if (error) devices = "Unexpected error"

    if (loading) devices = <CenteredSpinner />

    if (user)
      devices = (
        <TextField
          value={this.state.device}
          onChange={event => {
            this.setState({ device: event.target.value })
          }}
          label="Device"
          variant="outlined"
          select
          style={{ width: "100%", marginBottom: "16px" }}
          InputLabelProps={{ shrink: true }}
        >
          {this.props.allDevices.map(device => (
            <MenuItem value={device.id}>{device.name}</MenuItem>
          ))}
        </TextField>
      )

    let value

    switch (this.state.type) {
      case "float":
        value = (
          <TextField
            label="Value"
            value={this.state.value}
            type="number"
            onChange={event => this.setState({ value: event.target.value })}
            onKeyPress={event => {
              if (
                event.key === "Enter" &&
                this.state.visibility &&
                this.state.type &&
                this.state.permission &&
                this.state.device &&
                this.state.name
              )
                createValueMutation()
            }}
            style={{ width: "100%", marginBottom: "16px" }}
            variant="outlined"
          />
        )
        break

      case "string":
        value = (
          <TextField
            label="Value"
            value={this.state.value}
            onChange={event => this.setState({ value: event.target.value })}
            onKeyPress={event => {
              if (
                event.key === "Enter" &&
                this.state.visibility &&
                this.state.type &&
                this.state.permission &&
                this.state.device &&
                this.state.name
              )
                createValueMutation()
            }}
            style={{ width: "100%", marginBottom: "16px" }}
            variant="outlined"
          />
        )
        break

      case "boolean":
        value = (
          <FormControlLabel
            control={
              <Switch
                checked={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            }
            label="Value"
            labelPlacement="start"
          />
        )
        break

      default:
        value = ""
        break
    }

    let createValueMutation = () => {
      switch (this.state.type) {
        case "float":
          this.props.CreateFloatValue({
            variables: {
              name: this.state.name,
              deviceId: this.state.device,
              permission: this.state.permission,
              value: parseFloat(this.state.value),
            },
          })
          break

        case "plot":
          this.props.CreatePlotValue({
            variables: {
              name: this.state.name,
              deviceId: this.state.device,
              permission: this.state.permission,
              value: this.state.value,
            },
          })
          break

        case "string":
          this.props.CreateStringValue({
            variables: {
              name: this.state.name,
              deviceId: this.state.device,
              permission: this.state.permission,
              value: this.state.value,
            },
          })
          break

        case "category plot":
          this.props.CreateCategoryPlotValue({
            variables: {
              name: this.state.name,
              deviceId: this.state.device,
              permission: this.state.permission,
              value: this.state.value,
            },
          })
          break

        case "boolean":
          this.props.CreateBooleanValue({
            variables: {
              name: this.state.name,
              deviceId: this.state.device,
              permission: this.state.permission,
              value: this.state.value,
            },
          })
          break

        default:
          break
      }
    }

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open && !this.state.valueSettingsOpen}
          onClose={this.props.close}
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Choose value type</DialogTitle>
          <List>
            <ListItem
              button
              onClick={() =>
                this.setState({ valueSettingsOpen: true, type: "boolean" })
              }
            >
              <ListItemText primary="Boolean" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                this.setState({
                  valueSettingsOpen: true,
                  type: "category plot",
                })
              }
            >
              <ListItemText primary="Category plot" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                this.setState({ valueSettingsOpen: true, type: "float" })
              }
            >
              <ListItemText primary="Float" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                this.setState({ valueSettingsOpen: true, type: "plot" })
              }
            >
              <ListItemText primary="Plot" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                this.setState({ valueSettingsOpen: true, type: "string" })
              }
            >
              <ListItemText primary="String" />
            </ListItem>
          </List>
          <DialogActions>
            <Button onClick={this.props.close}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.valueSettingsOpen}
          onClose={() => this.setState({ valueSettingsOpen: false })}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Create {this.state.type}</DialogTitle>
          <div
            style={{
              marginLeft: "24px",
              marginRight: "24px",
              height: "100%",
            }}
          >
            <TextField
              id="adornment-name-login"
              label="Custom name"
              variant="outlined"
              value={this.state.name}
              style={{ width: "100%", marginBottom: "16px" }}
              onChange={event => this.setState({ name: event.target.value })}
              onKeyPress={event => {
                if (event.key === "Enter") createValueMutation()
              }}
              endAdornment={
                this.state.name && (
                  <InputAdornment position="end">
                    <IconButton
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                      onClick={() => this.setState({ name: "" })}
                      tabIndex="-1"
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                )
              }
            />
            {value}
            {devices}
            <TextField
              value={this.state.permission}
              onChange={event => {
                this.setState({ permission: event.target.value })
              }}
              label="Permission"
              variant="outlined"
              style={{ width: "100%", marginBottom: "16px" }}
              select
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="READ_ONLY">Read only</MenuItem>
              <MenuItem value="READ_WRITE">Read and write</MenuItem>
            </TextField>
            <TextField
              value={this.state.visibility}
              onChange={event => {
                this.setState({ visibility: event.target.value })
              }}
              label="Visibility"
              variant="outlined"
              style={{ width: "100%", marginBottom: "8px" }}
              select
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="VISIBLE">Visible</MenuItem>
              <MenuItem value="HIDDEN">Hidden</MenuItem>
              <MenuItem value="INVISIBLE">Invisible</MenuItem>
            </TextField>
          </div>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({ valueSettingsOpen: false })
                this.props.close()
              }}
              style={{ marginRight: "4px" }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.setState({ valueSettingsOpen: false })
                createValueMutation()
                this.props.close()
              }}
              disabled={
                !this.state.visibility ||
                !this.state.type ||
                !this.state.permission ||
                !this.state.device ||
                !this.state.name
              }
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
    mutation CreateFloatValue(
      $name: String!
      $deviceId: ID!
      $permission: ValuePermission!
      $visibility: Visibility!
      $value: Float!
    ) {
      createFloatValue(
        name: $name
        deviceId: $deviceId
        permission: $permission
        value: $value
      ) {
        id
      }
    }
  `,
  {
    name: "CreateFloatValue",
  }
)(
  graphql(
    gql`
      mutation CreateStringValue(
        $name: String!
        $deviceId: ID!
        $permission: ValuePermission!
        $visibility: Visibility!
        $value: String!
      ) {
        createStringValue(
          name: $name
          deviceId: $deviceId
          permission: $permission
          value: $value
        ) {
          id
        }
      }
    `,
    {
      name: "CreateStringValue",
    }
  )(
    graphql(
      gql`
        mutation CreatePlotValue(
          $name: String!
          $deviceId: ID!
          $permission: ValuePermission!
          $visibility: Visibility!
        ) {
          createPlotValue(
            name: $name
            deviceId: $deviceId
            permission: $permission
          ) {
            id
          }
        }
      `,
      {
        name: "CreatePlotValue",
      }
    )(
      graphql(
        gql`
          mutation CreateBooleanValue(
            $name: String!
            $deviceId: ID!
            $permission: ValuePermission!
            $visibility: Visibility!
            $value: Boolean!
          ) {
            createBooleanValue(
              name: $name
              deviceId: $deviceId
              permission: $permission
              value: $value
            ) {
              id
            }
          }
        `,
        {
          name: "CreateBooleanValue",
        }
      )(
        graphql(
          gql`
            mutation CreateCategoryPlotValue(
              $name: String!
              $deviceId: ID!
              $permission: ValuePermission!
              $visibility: Visibility!
            ) {
              createCategoryPlotValue(
                name: $name
                deviceId: $deviceId
                permission: $permission
              ) {
                id
              }
            }
          `,
          {
            name: "CreateCategoryPlotValue",
          }
        )(CreateValue)
      )
    )
  )
)
