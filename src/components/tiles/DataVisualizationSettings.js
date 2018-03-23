import React from "react"
import Dialog from "material-ui/Dialog"
import TextField from "material-ui/TextField"
import Button from "material-ui-next/Button"
import Snackbar from "material-ui/Snackbar"

const dataVisualizationDialogContentStyle = {
  width: "350px",
}

export default class ReadOnlyFloatTileDialog extends React.Component {
  render() {
    const dataVisualizationDialogActions = [
      <Button
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
