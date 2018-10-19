import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Icon from "@material-ui/core/Icon"
import Grid from "@material-ui/core/Grid"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import IconButton from "@material-ui/core/IconButton"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const MOBILE_WIDTH = 500

let oldUrl = ""

let oldMode =""

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ChangePasswordDialog extends React.Component {
  state = {
    url:
      (typeof Storage !== "undefined" && localStorage.getItem("server")) ||
      localStorage.getItem("manualServer") ||
      "http://iglooql.herokuapp.com",
    mode:
      typeof Storage !== "undefined" && localStorage.getItem("server")
        ? "manual"
        : "auto",
  }

  render() {
    let confirm = () => {
      if (typeof Storage !== "undefined") {
        localStorage.setItem("server", this.state.url)
        localStorage.setItem("manualServer", this.state.url)
      }

      oldUrl=this.state.url

      window.location.reload()
    }

    if (oldUrl === "") {
      oldUrl = typeof Storage !== "undefined" && localStorage.getItem("server")
    }

    if (oldMode === ""){
      oldMode = typeof Storage !== "undefined" && localStorage.getItem("server")
      ? "manual"
      : "auto"
    }

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable"
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle style={{ width: "350px" }}>
          Change connected server
        </DialogTitle>
        <div
          style={{
            paddingLeft: "24px",
            paddingRight: "24px",
            height: "100%",
          }}
        >
          <RadioButtonGroup
            name="time"
            defaultSelected={this.state.mode || "auto"}
            onChange={(event, value) => {
              this.setState({ mode: value })
              if (typeof Storage !== "undefined") {
                if (value === "auto") {
                  localStorage.setItem("server", "")
                } else {
                  localStorage.setItem("server", "http://iglooql.herokuapp.com")
                }
              }
            }}
          >
            <RadioButton
              value="auto"
              label="Auto"
              style={{
                marginTop: 12,
                marginBottom: 16,
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
            <RadioButton
              value="manual"
              label="Manual"
              style={{
                marginBottom: 16,
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
          </RadioButtonGroup>
          <MuiThemeProvider theme={theme}>
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{ width: "100%" }}
            >
              <Grid item style={{ marginRight: "16px" }}>
                <Icon
                  style={this.state.mode === "auto" ? { opacity: "0.5" } : {}}
                >
                  link
                </Icon>
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-email-login"
                    placeholder="Server address"
                    value={this.state.url}
                    onChange={event => {
                      this.setState({
                        url: event.target.value,
                      })
                    }}
                    disabled={this.state.mode === "auto"}
                    endAdornment={
                      this.state.url ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => {
                              this.setState({ url: "" })
                            }}
                            onMouseDown={event => {
                              event.preventDefault()
                            }}
                            tabIndex="-1"
                            disabled={this.state.mode === "auto"}
                          >
                            <Icon>clear</Icon>
                          </IconButton>
                        </InputAdornment>
                      ) : null
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
              primary={true}
              buttonStyle={{ backgroundColor: "#0083ff" }}
              onClick={confirm}
              disabled={oldMode === this.state.mode || (this.state.mode==="manual" &&
                (!this.state.url ||
                typeof Storage === "undefined" ||
                oldUrl === this.state.url))
              }
            >
              Change
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}
