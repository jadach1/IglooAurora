import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Icon from "@material-ui/core/Icon"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import FormControl from "@material-ui/core/FormControl"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class ChangeMailDialog extends React.Component {
  state = {
    mailSnackOpen: false,
    mailDialogOpen: false,
  }

  openMailDialog = () => {
    this.setState({ mailDialogOpen: true })
    this.props.handleEmailDialogClose()
  }

  closeMailDialog = () => {
    this.setState({ mailDialogOpen: false })
  }

  handleMailSnackOpen = () => {
    this.setState({
      mailSnackOpen: true,
    })
    this.closeMailDialog()
  }

  handleMailSnackClose = () => {
    this.setState({
      mailSnackOpen: false,
    })
  }

  render() {
    const {
      userData: { user },
    } = this.props

    let changeEmail = () => {}

    if (user) {
      changeEmail = email => {
        this.props["ChangeEmail"]({
          variables: {
            email: email,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              email: email,
              __typename: "User",
            },
          },
        })
      }
    }

    return (
      <React.Fragment>
        <Dialog
          open={this.props.confirmationDialogOpen}
          onClose={this.props.handleEmailDialogClose}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Type your password
          </DialogTitle>
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#0083ff" },
              },
            })}
          >
            <div
              style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                height: "100%",
              }}
            >
              <FormControl
                style={{
                  width: "100%",
                }}
              >
                <Input
                  id="adornment-password-login"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.password}
                  placeholder="Password"
                  onChange={event =>
                    this.setState({
                      password: event.target.value,
                      passwordError: "",
                      isPasswordEmpty: event.target.value === "",
                    })
                  }
                  error={
                    this.state.passwordError || this.state.isPasswordEmpty
                      ? true
                      : false
                  }
                  onKeyPress={event => {
                    if (event.key === "Enter") this.openMailDialog()
                  }}
                  endAdornment={
                    this.state.password ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}
                          tabIndex="-1"
                        >
                          {this.state.showPassword ? (
                            <Icon>visibility_off</Icon>
                          ) : (
                            <Icon>visibility</Icon>
                          )}
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                />
              </FormControl>
            </div>
            <br />
          </MuiThemeProvider>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={this.props.handleEmailDialogClose}
                style={{ marginRight: "4px" }}
              >
                Never Mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                onClick={this.openMailDialog}
              >
                Proceed
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.mailDialogOpen}
          onClose={this.closeMailDialog}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Manage your emails
          </DialogTitle>
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#0083ff" },
              },
            })}
          >
            <div
              style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                height: "100%",
              }}
            >
              <FormControl style={{ width: "100%" }}>
                <Input
                  id="adornment-email-login"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={event =>
                    this.setState({
                      email: event.target.value,
                      isMailEmpty: event.target.value === "",
                    })
                  }
                  onKeyPress={event => {
                    if (event.key === "Enter") this.signIn()
                  }}
                  error={
                    this.state.emailError || this.state.isMailEmpty
                      ? true
                      : false
                  }
                  endAdornment={
                    this.state.email ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickCancelEmail}
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
              <br />
            </div>
          </MuiThemeProvider>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={this.closeMailDialog}
                style={{ marginRight: "4px" }}
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                onClick={() => changeEmail(this.state.email)}
                disabled={!user}
              >
                Change
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeEmail($email: String!) {
      user(email: $email) {
        id
        email
      }
    }
  `,
  {
    name: "ChangeEmail",
  }
)(ChangeMailDialog)
