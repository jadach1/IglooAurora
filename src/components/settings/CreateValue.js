import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"; import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Icon from "@material-ui/core/Icon"
import MenuItem from "material-ui/MenuItem"
import CenteredSpinner from "../CenteredSpinner"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Grid from "@material-ui/core/Grid"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Select from "@material-ui/core/Select"
import FormControl from "@material-ui/core/FormControl"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
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

export default class CreateValue extends React.Component {
  state = {
    customName: "",
    device: 0,
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

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let devices = ""

    if (error) devices = "Unexpected error"

    if (loading) devices = <CenteredSpinner />

    if (user)
      devices = (
        <MuiThemeProvider theme={theme}>
          <Grid
            container
            spacing={0}
            alignItems="flex-end"
            style={{
              width: "100%",
            }}
          >
            <Grid item style={{ marginRight: "16px" }}>
              <Icon>lightbulb_outline</Icon>
            </Grid>
            <Grid item style={{ width: "calc(100% - 40px)" }}>
              <FormControl style={{ width: "100%" }}>
                <Select
                  value={this.state.device}
                  onChange={event => {
                    this.setState({ device: event.target.value })
                  }}
                  name="device"
                >
                  {user.devices.map(device => (
                    <MenuItem value={device.index}>
                      {device.customName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </MuiThemeProvider>
      )

    let createDeviceMutation = () => {
      this.props["CreateVaòue"]({
        variables: {
          deviceType: this.state.deviceType,
          customName: this.state.customName,
          boardId: user.boards[this.state.board].id,
          firmware: this.state.firmware,
        },
      })
    }

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>Create value</DialogTitle>
          <div
            style={{ marginLeft: "24px", marginRight: "24px", height: "100%" }}
          >
            <MuiThemeProvider theme={theme}>
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                style={{
                  width: "100%",
                }}
              >
                <Grid item style={{ marginRight: "16px" }}>
                  <Icon>lightbulb_outline</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Input
                      id="adornment-name-login"
                      placeholder="Custom name"
                      value={this.state.customName}
                      onChange={event =>
                        this.setState({ customName: event.target.value })
                      }
                      onKeyPress={event => {
                        if (event.key === "Enter") createDeviceMutation()
                      }}
                      endAdornment={
                        this.state.customName && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => this.setState({ customName: "" })}
                              tabIndex="-1"
                            >
                              <Icon>clear</Icon>
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br /> {devices}
              <br />
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                style={{
                  width: "100%",
                }}
              >
                <Grid item style={{ marginRight: "16px" }}>
                  <Icon>lightbulb_outline</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Select
                      value={this.state.permission}
                      onChange={event => {
                        this.setState({ permission: event.target.value })
                      }}
                      name="permission"
                    >
                      <MenuItem value="readOnly">Read only</MenuItem>
                      <MenuItem value="readWrite">Read and write</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                style={{
                  width: "100%",
                }}
              >
                <Grid item style={{ marginRight: "16px" }}>
                  <Icon>lightbulb_outline</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Select
                      value={this.state.visibility}
                      onChange={event => {
                        this.setState({ visibility: event.target.value })
                      }}
                      name="visibility"
                    >
                      <MenuItem value="readOnly">Visible</MenuItem>
                      <MenuItem value="readWrite">Hidden</MenuItem>{" "}
                      <MenuItem value="readWrite">Invisible</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                style={{
                  width: "100%",
                }}
              >
                <Grid item style={{ marginRight: "16px" }}>
                  <Icon>lightbulb_outline</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Input
                      id="adornment-name-login"
                      placeholder="Custom name"
                      value={this.state.details}
                      onChange={event =>
                        this.setState({ details: event.target.value })
                      }
                      onKeyPress={event => {
                        if (event.key === "Enter") createDeviceMutation()
                      }}
                      endAdornment={
                        this.state.details && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => this.setState({ details: "" })}
                              tabIndex="-1"
                            >
                              <Icon>clear</Icon>
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </MuiThemeProvider>
            <br />
          </div>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme}>
              <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                label="Change"
                buttonStyle={{ backgroundColor: "#0083ff" }}
                onClick={this.props.close}
                disabled={true}
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
