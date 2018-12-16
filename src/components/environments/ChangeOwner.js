import React, { Component } from "react"
import Icon from "@material-ui/core/Icon"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"

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

  async changeOwner() {
    try {
      this.setState({ showLoading: true })

      await this.props.client.mutate({
        mutation: gql`
          mutation($environmentId: ID!, $email: String!) {
            changeOwner(environmentId: $environmentId, email: $email) {
              id
            }
          }
        `,
        variables: {
          environmentId: this.props.environmentId,
          email: this.state.email,
        },
      })

      this.props.close()
    } catch (e) {
      if (
        e.message ===
        "GraphQL error: This account doesn't exist, check the email passed"
      ) {
        this.setState({ emailError: "This account doesn't exist" })
      } else if (
        e.message ===
        "GraphQL error: You already are the owner of this environment"
      ) {
        this.setState({
          emailError: "This is you",
        })
      } else if (
        e.message ===
        "GraphQL error: The user already has a role on this environment"
      ) {
        this.setState({
          emailError: "Environment alreay shared",
        })
      } else if (
        e.message ===
        "GraphQL error: There is already an environmentShare pending"
      ) {
        this.setState({
          emailError: "Environment alreay shared",
        })
      } else {
        this.setState({
          emailError: "Unexpected error",
        })
      }
    }

    this.setState({ showLoading: false })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({
        isEmailEmpty: false,
        emailError: false,
        email: "",
      })
    }
  }

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
        <div style={{ height: "100%" }}>
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
                  this.changeOwner()
                }
              }}
              error={
                this.state.emailError || this.state.isEmailEmpty ? true : false
              }
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
            <FormHelperText
              style={
                this.state.emailError || this.state.isEmailEmpty
                  ? { color: "#f44336" }
                  : {}
              }
            >
              {this.state.isEmailEmpty
                ? "This field is required"
                : this.state.emailError}
            </FormHelperText>
          </FormControl>
        </div>
        <DialogActions>
          <Button onClick={this.props.close}>Never mind</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.changeOwner()
            }}
          >
            Change owner
            {this.state.showLoading && <CenteredSpinner isInButton />}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default ChangeOwner
