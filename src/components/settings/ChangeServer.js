import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Icon from "@material-ui/core/Icon"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import IconButton from "@material-ui/core/IconButton"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"

const MOBILE_WIDTH = 600

let oldUrl = ""

let oldMode = ""

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
      "http://igloo-production.herokuapp.com",
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

      oldUrl = this.state.url

      this.props.logOut()
      this.props.close()
    }

    if (oldUrl === "") {
      oldUrl = typeof Storage !== "undefined" && localStorage.getItem("server")
    }

    if (oldMode === "") {
      oldMode =
        typeof Storage !== "undefined" && localStorage.getItem("server")
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
        fullWidth
        maxWidth="xs"
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
            Change connected server
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
          <RadioGroup
            onChange={(event, value) => {
              this.setState({ mode: value })
              if (typeof Storage !== "undefined") {
                if (value === "auto") {
                  localStorage.setItem("server", "")
                }
              }
            }}
            value={this.state.mode || "auto"}
            style={{ paddingLeft: "24px", paddingRight: "24px" }}
          >
            <FormControlLabel
              value="auto"
              control={<Radio color="primary" />}
              label="Auto"
            />
            <FormControlLabel
              value="manual"
              control={<Radio color="primary" />}
              label="Manual"
            />
          </RadioGroup>
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
              onKeyPress={event => {
                if (
                  event.key === "Enter" &&
                  !(
                    oldMode === this.state.mode ||
                    (this.state.mode === "manual" &&
                      (!this.state.url ||
                        typeof Storage === "undefined" ||
                        oldUrl === this.state.url))
                  )
                ) {
                  confirm()
                }
              }}
              style={
                this.state.mode === "manual"
                  ? typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                  : typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                  ? { color: "#c1c2c5" }
                  : { color: "#7a7a7a" }
              }
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
                      style={
                        this.state.mode === "manual"
                          ? typeof Storage !== "undefined" &&
                            localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                          : typeof Storage !== "undefined" &&
                            localStorage.getItem("nightMode") === "true"
                          ? { color: "#c1c2c5" }
                          : { color: "#7a7a7a" }
                      }
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>

          <br />
          <br />
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
            onClick={confirm}
            disabled={
              oldMode === this.state.mode ||
              (this.state.mode === "manual" &&
                (!this.state.url ||
                  typeof Storage === "undefined" ||
                  oldUrl === this.state.url))
            }
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
