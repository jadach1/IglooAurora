import React from "react"
import * as EmailValidator from "email-validator"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class ForgotPassword extends React.Component {
  state = { email: "" }

  componentWillReceiveProps(nextProps) {
    if (!this.state.email && nextProps.email !== this.state.email) {
      this.setState({ email: nextProps.email })
    }
  }

  render() {
    return (
      <MuiThemeProvider
        theme={createMuiTheme({
          palette: {
            default: { main: "#fff" },
            primary: { light: "#0083ff", main: "#0057cb" },
            secondary: { main: "#ff4081" },
            error: { main: "#f44336" },
          },
          overrides: {
            MuiDialogTitle: {
              root: {
                fontSize: "1.3125rem",
                lineHeight: "1.16667em",
                fontWeight: 500,
                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
              },
            },
            MuiButton: {
              containedPrimary: {
                backgroundColor: "#0083ff",
              },
            },
            MuiDialogActions: {
              action: {
                marginRight: "4px",
              },
            },
          },
        })}
      >
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          TransitionComponent={Transition}
          fullScreen={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Recover your password</DialogTitle>
          <div style={{ paddingLeft: "24px", paddingRight: "24px" }}>
            <div className="defaultCursor">
              Enter your email address and we will send you a link to reset your
              password
            </div>
            <br />
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-name-login"
                placeholder="Email"
                value={this.state.email}
                style={{ color: "black" }}
                onChange={event =>
                  this.setState({
                    email: event.target.value,
                  })
                }
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.props.recover(this.state.email)
                    this.props.close()
                  }
                }}
                endAdornment={
                  this.state.email ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => this.setState({ email: "" })}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
                      >
                        <Icon>clear</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
          </div>
          <br />
          <div style={{ height: "100%" }} />
          <DialogActions>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!EmailValidator.validate(this.state.email)}
              onClick={() => {
                this.props.recover(this.state.email)
                this.props.close()
              }}
            >
              Recover
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    )
  }
}

export default withMobileDialog({ breakpoint: "xs" })(ForgotPassword)
