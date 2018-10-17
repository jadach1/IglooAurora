import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Grid from "@material-ui/core/Grid"

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

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class DeleteAccountDialog extends React.Component {
  state = { showPassword: false }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.deleteConfirmedOpen}
          onClose={this.props.closeDeleteConfirmed}
          className="notSelectable defaultCursor"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Are you sure you want to delete your account?
          </DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            Be careful, your data will be erased permanently
            <br /> <br />
          </div>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme}>
              <Button
                keyboardFocused={true}
                onClick={this.props.closeDeleteConfirmed}
                style={{ marginRight: "4px" }}
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
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.props.deleteOpen}
          onClose={this.props.closeDelete}
          className="notSelectable defaultCursor"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Type your password
          </DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
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
            <br />
          </div>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme2}>
              <Button
                keyboardFocused={true}
                onClick={this.props.closeDelete}
                style={{ marginRight: "4px" }}
              >
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
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation DeleteValue($id: ID!) {
      deleteValue(id: $id)
    }
  `,
  {
    name: "DeleteAccount",
  }
)(DeleteAccountDialog)
