import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Button from "@material-ui/core/Button"
import Slide from "@material-ui/core/Slide"
import Grow from "@material-ui/core/Grow"

const MOBILE_WIDTH = 500

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        titleClassName="notSelectable defaultCursor"
        className="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle style={{ width: "350px" }}>
          Your account isn't verified
        </DialogTitle>
        <div
          style={{
            height: "100%",
            paddingLeft: "24px",
            paddingRight: "24px",
            width: "350px",
          }}
        >
          You should have received a verification email.
          <br />
          <br />
          If that's not the case, click on "Send again" and we'll send you
          another email.
          <br />
          <br />
        </div>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button
              style={{ marginRight: "4px" }}
              onClick={() => this.props.close()}
            >
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              onClick={() => {
                this.props.ResendVerificationEmail()
                this.props.close()
              }}
            >
              Send again
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}
