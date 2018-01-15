import React, { Component } from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"

FullScreenTile

export default class FullScreenTile extends React.Component {
  render() {
    const actions = [
      <FlatButton label="Close" primary={true} onClick={this.handleClose} />,
    ]

    return (
      <Dialog
        title="Dialog With Actions"
        actions={actions}
        modal={false}
        open={this.props.fullScreen}
        onRequestClose={this.handleClose}
      >
        The actions in this window were passed in as an array of React objects.
      </Dialog>
    )
  }
}
