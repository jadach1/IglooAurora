import React, { Component } from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"

export default class FullScreenTile extends React.Component {
  render() {
    const actions = [
      <FlatButton label="Close" onClick={this.props.handleClose} />,
    ]

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.fullScreen}
        onRequestClose={this.props.handleClose}
      >
        Lorem Ipsum
      </Dialog>
    )
  }
}
