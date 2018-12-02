import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import moment from "moment"
import Moment from "react-moment"

const MOBILE_WIDTH = 600

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
      >
        <DialogTitle>Device information</DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          <b>Created: </b>
          <Moment fromNow>
            {moment.utc(
              this.props.device.createdAt.split(".")[0],
              "YYYY-MM-DDTh:mm:ss"
            )}
          </Moment>
          <br />
          <br />
          <b>Last updated: </b>
          <Moment fromNow>
            {moment.utc(
              this.props.device.updatedAt.split(".")[0],
              "YYYY-MM-DDTh:mm:ss"
            )}
          </Moment>
          {typeof Storage !== "undefined" &&
            localStorage.getItem("devMode") === "true" && (
              <React.Fragment>
                <br />
                <br />
                <b>ID: </b> {this.props.device.id}
                {this.props.device.firmware && (
                  <React.Fragment>
                    <br />
                    <br />
                    <b>Firmware: </b>
                    {this.props.device.firmware}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
        </div>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default DeviceInfo
