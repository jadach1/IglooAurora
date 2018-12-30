import React from "react"
import * as EmailValidator from "email-validator"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import TextField from "@material-ui/core/TextField"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class ForgotPassword extends React.Component {
  state = { email: "" }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({ email: nextProps.email, emailError: false })
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
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Recover your password</DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            <div className="defaultCursor notSelectable">
              Enter your email address and we will send you a link to reset your
              password.
            </div>
            <TextField
              id="forgot-password-email"
              label="Email"
              value={this.state.email}
              variant="outlined"
              error={this.state.emailEmpty || this.state.emailError}
              helperText={
                this.state.emailEmpty
                  ? "This field is required"
                  : this.state.emailError || " "
              }
              onChange={event =>
                this.setState({
                  email: event.target.value,
                  emailEmpty: event.target.value === "",
                  emailError: "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && !this.state.emailEmpty)
                  this.changeOwner()
              }}
              style={{
                width: "100%",
                marginTop: "16px",
              }}
              InputProps={{
                endAdornment: this.state.email && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        this.setState({ email: "", emailEmpty: true })
                      }
                      tabIndex="-1"
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
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
