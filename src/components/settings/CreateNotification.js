import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import MenuItem from "material-ui/MenuItem"
import CenteredSpinner from "../CenteredSpinner"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Grid from "@material-ui/core/Grid"
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

export default class CreateNotification extends React.Component {
  state = {
    content: "",
    activeStep: 0,
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    const {
      userData: { loading, error, user },
    } = this.props

    let deviceList = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user)
      deviceList = (
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
                  value={this.state.value || 0}
                  onChange={event => {
                    this.setState({ board: event.target.value })
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

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Create notification
          </DialogTitle>
          <div
            style={{
              height: "100%",
              paddingRight: "24px",
              paddingLeft: "24px",
            }}
          >
            {deviceList}
            <br />
            <br />
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
                  <Icon>chat_bubble_outline</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Input
                      id="adornment-name-login"
                      placeholder="Notification content"
                      value={this.state.customName}
                      onChange={event =>
                        this.setState({ customName: event.target.value })
                      }
                      /*  onKeyPress={event => {
                        if (event.key === "Enter") createDeviceMutation()
                      }} */
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
            </MuiThemeProvider>
          </div>
          <br />
                  <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
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
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
