import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
//import CenteredSpinner from "../CenteredSpinner"

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

export default class CreatePlotNode extends React.Component {
  state = {
    content: "",
    activeStep: 0,
  }

  handleChange = (event, index, value) => this.setState({ value })

  render() {
    /*
    const {
      userData: { loading, error, user },
    } = this.props

    let deviceList = ""
    let plotList = ""

    if (error) deviceList = "Unexpected error bear"

    if (loading) deviceList = <CenteredSpinner />

    if (user) {
      deviceList = ""

      plotList = ""
    } */

    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
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
              Create plot node
            </font>
          </DialogTitle>
          <div
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
              height: "100%",
            }}
          >
            a
          </div>
          <DialogActions style={{ marginRight: "8px", marginLeft: "8px" }}>
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
