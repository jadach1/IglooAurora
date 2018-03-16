import React from "react"
import Dialog from "material-ui/Dialog"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import TextField from "material-ui/TextField"

export default class DeleteTileDialog extends React.Component {
  render() {
    const deleteTileActions = [
      <FlatButton
        label="Never mind"
        onClick={this.props.handleDeleteTileDialogClose}
      />,
      <RaisedButton
        label="Delete"
        primary={true}
        buttonStyle={{ backgroundColor: "#f44336" }}
        onClick={this.props.deleteTile}
      />,
    ]

    return (
      <Dialog
        title="Delete card"
        actions={deleteTileActions}
        open={this.props.deleteTileOpen}
        onRequestClose={this.props.handleDeleteTileDialogClose}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
      >
        Be careful, this card will be delete permanently
      </Dialog>
    )
  }
}
