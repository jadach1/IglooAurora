import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"

export default class SettingsDialog extends React.Component {
  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.props.closeSettingsDialog}
      />,
    ]

    return (
      <Dialog
        title="Settings"
        actions={actions}
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.closeSettingsDialog}
      >
        Lorem ipsum
      </Dialog>
    )
  }
}
