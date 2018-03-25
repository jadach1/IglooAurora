import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#f44336" },
  },
})

export default class DeleteTileDialog extends React.Component {
  render() {
    const deleteTileActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.handleDeleteTileDialogClose}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#f44336" }}
          onClick={this.props.deleteTile}
        >
          Delete
        </Button>
      </MuiThemeProvider>,
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
