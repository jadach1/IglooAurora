import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"

export default class DeleteTileDialog extends React.Component {
  render() {
    const deleteTileActions = [
      <Button
        label="Never mind"
        onClick={this.props.handleDeleteTileDialogClose}
      />,
      <Button
        variant="raised"
        color="primary"
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
