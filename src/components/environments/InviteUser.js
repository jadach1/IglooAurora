import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import TextField from "@material-ui/core/TextField"
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
          mutation($environmentId: ID!, $email: String!, $role: Role!) {
            shareEnvironment(
              environmentId: $environmentId
              email: $email
              role: $role
            ) {
              id
            }
          }
        `,
        variables: {
          environmentId: this.props.environmentId,
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
      } else if (
        e.message === "GraphQL error: There is already an ownerChange pending"
      ) {
        this.setState({
          emailError: "This user has a pending ownership request",
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
        emailEmpty: false,
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
        <DialogTitle disableTypography>
          Invite an {this.props.selectedUserType}
        </DialogTitle>
        <div style={{ height: "100%" }}>
          <TextField
            id="invite-user-email"
            label={
              // makes the first letter capital
              this.props.selectedUserType.charAt(0).toUpperCase() +
              this.props.selectedUserType.slice(1) +
              " email"
            }
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
                this.inviteUser()
            }}
            style={{
              width: "calc(100% - 48px)",
              margin: "0 24px",
            }}
            InputProps={{
              endAdornment: this.state.email && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => this.setState({ email: "",emailEmpty:true })}
                    tabIndex="-1"
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "rgba(0, 0, 0, 0.46)" }
                        : { color: "rgba(0, 0, 0, 0.54)" }
                    }
                  >
                    <Icon>clear</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        <DialogActions>
          <Button onClick={this.props.close}>Never mind</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.inviteUser()}
            disabled={this.state.email === "" || this.state.emailError}
          >
            Invite
            {this.state.showLoading && <CenteredSpinner isInButton />}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
