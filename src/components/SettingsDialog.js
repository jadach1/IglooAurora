import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"

export default class SettingsDialog extends React.Component {
  state = {}

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.closeSettingsDialog}
      />,
    ]

    return (
      <Dialog
        title="Settings"
        actions={actions}
        modal={false}
        areSettingsOpen={this.state.areSettingsOpen}
        onRequestClose={this.closeSettingsDialog}
      >
        Lorem ipsum
      </Dialog>
    )
  }
}
