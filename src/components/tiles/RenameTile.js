import React from "react"
import Dialog from "material-ui/Dialog"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import TextField from "material-ui/TextField"

export default class TimeZoneDialog extends React.Component {
  render() {
    const renameTileActions = [
      <FlatButton
        label="Never mind"
        onClick={this.props.handleRenameTileDialogClose}
      />,
      <RaisedButton
        label="Rename"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
        onClick={this.props.renameTile}
      />,
    ]

    return (
      <Dialog
        title="Rename card"
        actions={renameTileActions}
        open={this.props.renameTileOpen}
        onRequestClose={this.props.handleRenameTileDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
      >
        <TextField
          floatingLabelText="Card name"
          defaultValue={this.props.tileName}
          floatingLabelShrinkStyle={{ color: "#0083ff" }}
          underlineFocusStyle={{ borderColor: "#0083ff" }}
          style={{ width: "100%" }}
          onKeyPress={event => {
            if (event.key === "Enter") {
              this.openNameDialog()
            }
          }}
        />
      </Dialog>
    )
  }
}
