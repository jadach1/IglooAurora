import React from "react"
import Dialog from "material-ui-next/Dialog"
import DialogTitle from "material-ui-next/Dialog/DialogTitle"
import DialogActions from "material-ui-next/Dialog/DialogActions"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Slide from "material-ui-next/transitions/Slide"
import Input, { InputLabel, InputAdornment } from "material-ui-next/Input"
import { FormControl } from "material-ui-next/Form"
import IconButton from "material-ui-next/IconButton"
import Icon from "material-ui-next/Icon"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

function Transition(props) {
  return <Slide direction="up" {...props} />
}

export default class ChangeNameDialog extends React.Component {
  state = {
    nameSnackOpen: false,
    nameDialogOpen: false,
    email: "",
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
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
        >
          <DialogTitle>Recover your password</DialogTitle>
          <MuiThemeProvider theme={theme}>
            <div style={{ margin: "24px", width: "300px" }}>
              Enter your email address and we will send you a link to reset your
              password
              <br />
              <br />
              <FormControl style={{ width: "100%" }}>
                <InputLabel htmlFor="adornment-email">Email</InputLabel>
                <Input
                  id="adornment-email-login"
                  value={this.state.email}
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                  onKeyPress={event => {
                    if (event.key === "Enter") this.signIn()
                  }}
                  endAdornment={
                    this.state.email ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickCancelEmail}
                          onMouseDown={this.handleMouseDownPassword}
                          style={{ width: "32px", height: "32px" }}
                        >
                          <Icon>clear</Icon>
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                />
              </FormControl>
            </div>
          </MuiThemeProvider>
          <DialogActions>
            <Button onClick={this.props.close}>Never mind</Button>
            <MuiThemeProvider theme={theme}>
              <Button variant="raised" color="primary">
                Recover
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
