import React from "react"
import Dialog from "material-ui-next/Dialog"
import DialogTitle from "material-ui-next/Dialog/DialogTitle"
import DialogActions from "material-ui-next/Dialog/DialogActions"
import Button from "material-ui-next/Button"
import Slide from "material-ui-next/transitions/Slide"

function Transition(props) {
  return <Slide direction="up" {...props} />
}

export default class FullScreenTile extends React.Component {
  render() {
    const { value } = this.props
    const valueTitle = value.customName

    return (
      <Dialog
        open={this.props.fullScreen}
        onClose={this.props.handleClose}
        className="notSelectable"
        TransitionComponent={Transition}
      >
        <DialogTitle>{valueTitle}</DialogTitle>
        {this.props.specificTile}
        <DialogActions>
          <Button onClick={this.props.handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
