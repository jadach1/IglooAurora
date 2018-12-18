import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
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

class EnvironmentInfo extends React.Component {
  state = { showHidden: false }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        TransitionComponent={Transition}
      >
        <DialogTitle disableTypography>Environment information</DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          <b>Created: </b>
          <Moment fromNow>
            {moment.utc(
              this.props.environment.createdAt.split(".")[0],
              "YYYY-MM-DDTh:mm:ss"
            )}
          </Moment>
          <br />
          <br className="notSelectable" />
          <b>Last updated: </b>
          <Moment fromNow>
            {moment.utc(
              this.props.environment.updatedAt.split(".")[0],
              "YYYY-MM-DDTh:mm:ss"
            )}
          </Moment>
          {this.props.devMode ? (
            <React.Fragment>
              <br />
              <br className="notSelectable" />
              <b>ID: </b> {this.props.environment.id}
            </React.Fragment>
          ) : (
            ""
          )}
        </div>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default EnvironmentInfo
