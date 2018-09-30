import React from "react"
import * as EmailValidator from "email-validator"
import {
  Dialog,
  Button,
  MuiThemeProvider,
  createMuiTheme,
  Input,
  InputAdornment,
  InputLabel,
  FormControl,
  IconButton,
  Icon,
  DialogTitle,
  DialogActions,
  Grow,
  Slide,
} from "@material-ui/core"

const MOBILE_WIDTH = 500

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ChangeNameDialog extends React.Component {
  state = {
    nameSnackOpen: false,
    nameDialogOpen: false,
    email: this.props.email,
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
          contentStyle={{ width: "350px" }}
          titleClassName="defaultCursor"
        >
          <DialogTitle
            className="notSelectable defaultCursor"
            style={{ width: "350px" }}
          >
            Recover your password
          </DialogTitle>
          <MuiThemeProvider theme={theme}>
            <div
              style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                width: "350px",
              }}
            >
              <div className="defaultCursor">
                Enter your email address and we will send you a link to reset
                your password
              </div>
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
                          onClick={() => this.setState({ email: "" })}
                          onMouseDown={event => {
                            event.preventDefault()
                          }}
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
          <br />
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <MuiThemeProvider theme={theme}>
              <Button
                variant="raised"
                color="primary"
                disabled={!EmailValidator.validate(this.state.email)}
                onClick={() => {
                  this.props.recover(this.state.email)
                  this.props.close()
                }}
              >
                Recover
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
