import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import IconButton from "material-ui-next/IconButton"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"
import { Grid } from "material-ui-next"
import Input, { InputAdornment } from "material-ui-next/Input"
import { FormControl } from "material-ui-next/Form"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

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

    const confirmationDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button
          onClick={this.props.handleEmailDialogClose}
          style={{ marginRight: "4px" }}
        >
          Never Mind
        </Button>
        <Button variant="raised" color="primary" onClick={this.openMailDialog}>
          Proceed
        </Button>
      </MuiThemeProvider>,
    ]
    const mailDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.closeMailDialog} style={{ marginRight: "4px" }}>
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
      </MuiThemeProvider>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Type your password"
          actions={confirmationDialogActions}
          open={this.props.confirmationDialogOpen}
          contentStyle={{ width: "350px" }}
          onRequestClose={this.props.handleEmailDialogClose}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <Grid
            container
            spacing={0}
            alignItems="flex-end"
            style={{ width: "100%" }}
          >
            <Grid item style={{ marginRight: "16px" }}>
              <Icon>vpn_key</Icon>
            </Grid>
            <Grid item style={{ width: "calc(100% - 40px)" }}>
              <FormControl style={{ width: "100%" }}>
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
            </Grid>
          </Grid>
        </Dialog>
        <Dialog
          title="Manage your emails"
          actions={mailDialogActions}
          open={this.state.mailDialogOpen}
          contentStyle={{ width: "350px", color: "#000" }}
          onRequestClose={this.closeMailDialog}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <Grid
            container
            spacing={0}
            alignItems="flex-end"
            style={{ width: "100%" }}
          >
            <Grid item style={{ marginRight: "16px" }}>
              <Icon>email</Icon>
            </Grid>
            <Grid item style={{ width: "calc(100% - 40px)" }}>
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
            </Grid>
          </Grid>
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
