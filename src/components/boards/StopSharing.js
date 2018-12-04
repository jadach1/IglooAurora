import React, { Component } from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class StopSharing extends Component {
  state = { stopSharingOpen: false }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Stop sharing</DialogTitle>
        <div
          style={{
            paddingLeft: "24px",
            paddingRight: "24px",
            height: "100%",
            marginBottom: "16px",
          }}
        >
          Are you sure you want to stop sharing this board with{" "}
          {this.props.menuTarget && this.props.menuTarget.name}?
        </div>
        <DialogActions>
          <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
            Never mind
          </Button>
          <Button
            variant="contained"
            color="primary"
            primary={true}
            onClick={() => {
              this.props.stopSharing()
              this.props.close()
            }}
          >
            Stop sharing
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
