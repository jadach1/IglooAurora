import React from "react"
import Dialog from "material-ui-next/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const nameDialogContentStyle = {
  width: "350px",
}

export default class ChangeNameDialog extends React.Component {
  state = {
    nameSnackOpen: false,
    nameDialogOpen: false,
  }

  openNameDialog = () => {
    this.setState({ nameDialogOpen: true })
    this.props.handleNameDialogClose()
  }

  closeNameDialog = () => {
    this.setState({ nameDialogOpen: false })
  }

  handleNameSnackOpen = () => {
    this.setState({
      nameSnackOpen: true,
    })
    this.props.handleNameDialogClose()
  }

  handleNameSnackClose = () => {
    this.setState({
      nameSnackOpen: false,
    })
  }

  render() {
    const nameDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.handleNameDialogClose}>Never mind</Button>
        <Button
          variant="raised"
          color="primary"
          label="Change"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.handleNameSnackOpen}
        >
          Change
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Change your user name"
          actions={nameDialogActions}
          open={this.props.open}
          contentStyle={nameDialogContentStyle}
          onRequestClose={this.props.handleNameDialogClose}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            value=""
            floatingLabelText="User name"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.openNameDialog()
            }}
          />
        </Dialog>
      </React.Fragment>
    )
  }
}
