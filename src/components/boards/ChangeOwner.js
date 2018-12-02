import React, { Component } from "react"
import Icon from "@material-ui/core/Icon"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class ChangeOwner extends Component {
  state = { email: "" }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Transfer ownership</DialogTitle>
        <FormControl
          style={{
            width: "calc(100% - 48px)",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <Input
            id="adornment-email-login"
            placeholder="Email"
            value={this.state.email}
            onChange={event =>
              this.setState({
                email: event.target.value,
              })
            }
            onKeyPress={event => {
              if (event.key === "Enter") {
                this.setState({ addAdminOpen: false })
                this.inviteUser(this.state.selectedUserType.toUpperCase())
              }
            }}
            endAdornment={
              this.state.email ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => this.setState({ email: "" })}
                    onMouseDown={this.handleMouseDownPassword}
                    tabIndex="-1"
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <Icon>clear</Icon>
                  </IconButton>
                </InputAdornment>
              ) : null
            }
          />
        </FormControl>
        <div style={{ height: "100%" }} />
        <br />
        <DialogActions>
          <Button onClick={this.props.close}>Never mind</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.close}
          >
            Change owner
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default ChangeOwner
