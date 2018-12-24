import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Icon from "@material-ui/core/Icon"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
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

export default class ChangeServer extends React.Component {
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

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      oldMode =
        typeof Storage !== "undefined" && localStorage.getItem("server")
          ? "manual"
          : "auto"

      oldUrl = typeof Storage !== "undefined" && localStorage.getItem("server")
    }
  }

  render() {
    let confirm = () => {
      if (typeof Storage !== "undefined") {
        if (this.state.mode === "manual") {
          localStorage.setItem("server", this.state.url)
          localStorage.setItem("manualServer", this.state.url)
        } else {
          localStorage.setItem("server", "")
          localStorage.setItem("manualServer", this.state.url)
        }
        localStorage.setItem("bearer", "")
        this.props.forceUpdate()
      }

      !this.props.isUnauthenticated && this.props.logOut()
      this.props.close()
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
        <DialogTitle disableTypography>Change connected server</DialogTitle>
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
            }}
            value={this.state.mode || "auto"}
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
          <TextField
            id="change-name"
            label="Name"
            value={this.state.url}
            variant="outlined"
            error={this.state.urlEmpty || this.state.urlError}
            helperText={
              this.state.urlEmpty
                ? "This field is required"
                : this.state.urlError || " "
            }
            onChange={event =>
              this.setState({
                url: event.target.value,
                urlEmpty: event.target.value === "",
                urlError: "",
              })
            }
            onKeyPress={event => {
              if (event.key === "Enter" && this.state.url !== "") {
                confirm()
              }
            }}
            style={{
              marginTop: "16px",
              width: "100%",
            }}
            disabled={this.state.mode === "auto"}
            InputProps={{
              endAdornment: this.state.url && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      this.setState({ name: "" })
                    }}
                    onMouseDown={event => {
                      event.preventDefault()
                    }}
                    style={
                      this.state.mode === "auto"
                        ? typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(0, 0, 0, 0.62)" }
                          : { color: "rgba(0, 0, 0, 0.38)" }
                        : typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                    tabIndex="-1"
                    disabled={this.state.mode === "auto"}
                  >
                    <Icon>clear</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            onClick={confirm}
            disabled={
              typeof Storage === "undefined"
                ? oldMode === this.state.mode
                : oldMode === this.state.mode &&
                  (this.state.mode === "manual" && this.state.url === oldUrl)
            }
          >
            Change
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
