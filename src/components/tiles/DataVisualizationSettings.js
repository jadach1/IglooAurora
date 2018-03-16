import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import TextField from "material-ui/TextField"
import RaisedButton from "material-ui/RaisedButton"
import Snackbar from "material-ui/Snackbar"

const dataVisualizationDialogContentStyle = {
  width: "350px",
}

export default class ReadOnlyFloatTileDialog extends React.Component {
  render() {
    const dataVisualizationDialogActions = [
      <FlatButton
        label="Close"
        onClick={this.props.dataVisualizationDialogClose}
      />,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Select a data visualization"
          actions={dataVisualizationDialogActions}
          open={this.props.dataVisualizationDialogOpen}
          contentStyle={dataVisualizationDialogContentStyle}
          onRequestClose={this.props.dataVisualizationDialogClose}
          className="notSelectable"
          bodyStyle={{
            paddingBottom: "0px",
          }}
        >
          {this.props.specificVisualizationSettings}
        </Dialog>
      </React.Fragment>
    )
  }
}
