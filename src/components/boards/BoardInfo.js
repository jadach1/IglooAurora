import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"; import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import moment from "moment"

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

class BoardInfo extends React.Component {
  state = { showHidden: false }

  render() {
    const infoActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close}>Close</Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        actions={infoActions}
        open={this.props.open}
        onClose={this.props.close}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        TransitionComponent={Transition}
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={{ width: "350px" }}
        >
          Board information
        </DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          <b>Created: </b>
          {moment
            .utc(this.props.board.createdAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
            .fromNow()}
          <br />
          <br />
          <b>Last updated: </b>
          {moment
            .utc(this.props.board.updatedAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
            .fromNow()}
          {this.props.devMode ? (
            <React.Fragment>
              <br />
              <br />
              <b>ID: </b> {this.props.board.id}
            </React.Fragment>
          ) : (
            ""
          )}
        </div>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close}>Close</Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default BoardInfo
