import React from "react"
import Dialog from "material-ui/Dialog"

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
        onRequestClose={this.props.handleClose}
        className="notSelectable"
        TransitionComponent={Transition}
        title={valueTitle}
        actions={<Button onClick={this.props.handleClose}>Close</Button>}
        modal={false}
        titleClassName="notSelectable defaultCursor"
      >
        {this.props.specificTile}
      </Dialog>
    )
  }
}
