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

const theme2 = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const passwordDialogContentStyle = {
  width: "350px",
}

const deleteDialogContentStyle = {
  width: "360px",
}

export default class DeleteAccountDialog extends React.Component {
  render() {
    const deleteConfimedActions = [
      <MuiThemeProvider theme={theme2}>
        <Button keyboardFocused={true} onClick={this.props.closeDelete}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#F44336" }}
          onClick={this.props.deleteConfirmed}
        >
          Proceed
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Are you sure you want to delete your account?"
          actions={[
            <MuiThemeProvider theme={theme}>
              <Button
                keyboardFocused={true}
                onClick={this.props.closeDeleteConfirmed}
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                primary={true}
                buttonStyle={{ backgroundColor: "#F44336" }}
                disabled={this.props.isDeleteDisabled}
                style={{ width: "120px" }}
                disabledLabelColor="#751f19"
              >
                {this.props.isDeleteDisabled
                  ? "Delete (" + this.props.timer + ")"
                  : "Delete"}
              </Button>
            </MuiThemeProvider>,
          ]}
          open={this.props.deleteConfirmedOpen}
          contentStyle={deleteDialogContentStyle}
          onRequestClose={this.props.closeDeleteConfirmed}
          className="notSelectable"
        >
          Be careful, your data will be erased permanently
        </Dialog>
        <Dialog
          title="Type your password"
          actions={deleteConfimedActions}
          open={this.props.deleteOpen}
          contentStyle={passwordDialogContentStyle}
          onRequestClose={this.props.closeDelete}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Password"
            type="password"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.props.deleteConfirmed()
            }}
          />
        </Dialog>
      </React.Fragment>
    )
  }
}
