import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"

export default class FullScreenTile extends React.Component {
  render() {
    const actions = [
      <FlatButton label="Close" onClick={this.props.handleClose} />,
    ]
    const { value } = this.props
    const valueTitle = value.customName

    return (
      <Dialog
        title={valueTitle}
        actions={actions}
        modal={false}
        open={this.props.fullScreen}
        onRequestClose={this.props.handleClose}
        className="notSelectable"
        bodyClassName="fullScreenTileDialog"
      >
        {this.props.specificTile}
      </Dialog>
    )
  }
}
