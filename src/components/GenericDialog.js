// CONGRATULATIONS, YOU'VE DISCOVERED AURORA'S BEST KEPT SECRET!
// P.S.: PLEASE DON'T TELL ANYONE ABOUT THIS

import React, { Component } from "react"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Konami from "react-konami-code"
import CircularProgress from "@material-ui/core/CircularProgress"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#f44336" },
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

export default class GenericDialog extends Component {
  state = {
    open: false,
    confirmationOpen: false,
  }

  render() {
    return (
      <React.Fragment>
        <Konami
          action={() => {
            this.setState({ open: true })
            console.clear()
            console.log(
              "In case you're wondering, this loading screen won't actually unlock any superpower!\nIf you know how to give our users the power to fly, please contribute to our open source repository!\nhttps://github.com/IglooCloud/IglooAurora"
            )
          }}
        />
        <Dialog
          open={this.state.open}
          onClose={() => this.setState({ open: false, confirmationOpen: true })}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            style={
              window.innerWidth < MOBILE_WIDTH
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? {
                      width: "calc(100% - 48px)",
                      background: "#2f333d",
                      textAlign: "center",
                    }
                  : {
                      width: "calc(100% - 48px)",
                      background: "#fff",
                      textAlign: "center",
                    }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? {
                      width: "350px",
                      background: "#2f333d",
                      textAlign: "center",
                    }
                  : { width: "350px", background: "#fff", textAlign: "center" }
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
              Unlocking superpowers!
            </font>
          </DialogTitle>
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              <MuiThemeProvider
                theme={createMuiTheme({
                  palette: {
                    primary: { main: "#0083ff" },
                  },
                })}
              >
                <CircularProgress
                  size={48}
                  style={{
                    marginTop: "16px",
                    marginBottom: "32px",
                  }}
                />
                <div
                  style={{
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    textAlign: "center",
                    marginBottom: "8px",
                  }}
                >
                  Please wait, this could take a few minutes
                </div>
              </MuiThemeProvider>
            </div>
          </div>
          <DialogActions
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    padding: "8px",
                    margin: "0",
                    background: "#2f333d",
                  }
                : {
                    padding: "8px",
                    margin: "0",
                  }
            }
          >
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={() =>
                  this.setState({ open: false, confirmationOpen: true })
                }
                style={{ width: "100%" }}
              >
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : {}
                  }
                >
                  Close
                </font>
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.confirmationOpen}
          onClose={() => this.setState({ open: false })}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            style={
              window.innerWidth < MOBILE_WIDTH
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? {
                      width: "calc(100% - 48px)",
                      background: "#2f333d",
                    }
                  : {
                      width: "calc(100% - 48px)",
                      background: "#fff",
                    }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? {
                      width: "350px",
                      background: "#2f333d",
                    }
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
              Are you sure?
            </font>
          </DialogTitle>
          <div
            style={{
              marginLeft: "24px",
              marginRight: "24px",
              height: "100%",
              marginBottom: "8px",
            }}
          >
            Are you sure you want to give up your superpowers?
          </div>
          <DialogActions
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    padding: "8px",
                    margin: "0",
                    background: "#2f333d",
                  }
                : {
                    padding: "8px",
                    margin: "0",
                  }
            }
          >
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={() =>
                  this.setState({ open: true, confirmationOpen: false })
                }
                style={{ marginRight: "4px" }}
              >
                <font
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : {}
                  }
                >
                  Go back
                </font>
              </Button>
              <Button
                onClick={() => {
                  this.setState({ confirmationOpen: false })
                  console.clear()
                  console.log(
                    "Hello! If you're reading this, you've probably got some experience with web development, so why don't you contribute to our open source repository?\nhttps://github.com/IglooCloud/IglooAurora"
                  )
                }}
                style={{ marginRight: "4px" }}
                variant="raised"
                color="secondary"
              >
                Give up
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
