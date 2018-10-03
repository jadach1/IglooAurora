import React from "react"
import * as EmailValidator from "email-validator"
import {
  Dialog,
  Button,
  MuiThemeProvider,
  createMuiTheme,
  Input,
  InputAdornment,
  Grid,
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

export default class ForgotPassword extends React.Component {
  state = {
    email: this.props.email,
  }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          className="notSelectable"
          TransitionComponent={Transition}
          titleClassName="defaultCursor"
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            className="notSelectable defaultCursor"
            style={window.innerWidth > MOBILE_WIDTH ? { width: "350px" } : null}
          >
            Recover your password
          </DialogTitle>
          <MuiThemeProvider theme={theme}>
            <div
              style={
                window.innerWidth > MOBILE_WIDTH
                  ? {
                      paddingLeft: "24px",
                      paddingRight: "24px",
                      width: "350px",
                    }
                  : { paddingLeft: "24px", paddingRight: "24px" }
              }
            >
              <div className="defaultCursor">
                Enter your email address and we will send you a link to reset
                your password
              </div>
              <br />
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                style={{
                  width: "100%",
                }}
              >
                <Grid item style={{ marginRight: "16px" }}>
                  <Icon>email</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Input
                      id="adornment-name-login"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={event =>
                        this.setState({
                          customName: event.target.value,
                        })
                      }
                      onKeyPress={event => {
                        if (event.key === "Enter") this.rename()
                      }}
                      endAdornment={
                        this.state.customName ? (
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
                </Grid>
              </Grid>
            </div>
          </MuiThemeProvider>
          <div style={{ height: "100%" }} />
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
