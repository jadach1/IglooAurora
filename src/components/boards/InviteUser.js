import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import CenteredSpinner from "../CenteredSpinner"
import gql from "graphql-tag"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class InviteUser extends Component {
  state = { email: "", value: "" }

  async inviteUser() {
    try {
      this.setState({ showLoading: true })

      await this.props.client.mutate({
        mutation: gql`
          mutation($boardId: ID!, $email: String!, $role: Role!) {
            shareBoard(boardId: $boardId, email: $email, role: $role) {
              id
            }
          }
        `,
        variables: {
          boardId: this.props.boardId,
          email: this.state.email,
          role: this.props.selectedUserType.toUpperCase(),
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
        e.message === "GraphQL error: You can't share a resource with yourself"
      ) {
        this.setState({
          emailError: "This is yourself",
        })
      } else if (
        e.message === "GraphQL error: The user already has a role on this board"
      ) {
        this.setState({
          emailError: "Board alreay shared",
        })
      } else if (
        e.message === "GraphQL error: There is already a boardShare pending"
      ) {
        this.setState({
          emailError: "Board alreay shared",
        })
      } else {
        this.setState({
          emailError: "Unexpected error",
        })
      }
    }

    this.setState({ showLoading: false })
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
        <DialogTitle disableTypography>
          Invite an {this.props.selectedUserType}
        </DialogTitle>
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
                emailError: "",
                isEmailEmpty: event.target.value === "",
              })
            }
            onKeyPress={event => {
              if (event.key === "Enter") this.inviteUser()
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
        <div style={{ height: "100%" }} />
        <DialogActions>
          <Button onClick={this.props.close}>Never mind</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.inviteUser()}
            disabled={this.state.showLoading}
          >
            Invite
            {this.state.showLoading && <CenteredSpinner isInButton />}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
