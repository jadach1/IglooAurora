import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import moment from "moment"

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class DeviceInfo extends React.Component {
  state = { showHidden: false }

  render() {
    return (
      <Dialog
        open={this.props.infoOpen}
        onClose={this.props.close}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        className="notSelectable defaultCursor"
      >
        <DialogTitle style={{ width: "350px" }}>Device information</DialogTitle>{" "}
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          <b>Created: </b>
          {moment
            .utc(this.props.createdAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
            .fromNow()}
          <br />
          <br />
          <b>Last updated: </b>
          {moment
            .utc(this.props.updatedAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
            .fromNow()}
          {this.props.devMode && (
            <React.Fragment>
              <br />
              <br />
              <b>ID: </b> {this.props.id}
              {this.props.firmware && (
                <React.Fragment>
                  <br />
                  <br />
                  <b>Firmware: </b>
                  {this.props.firmware}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
                <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default DeviceInfo
