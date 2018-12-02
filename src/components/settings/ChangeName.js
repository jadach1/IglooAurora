import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Avatar from "@material-ui/core/Avatar"
import Icon from "@material-ui/core/Icon"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

let oldName = ""

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class ChangeNameDialog extends React.Component {
  state = {
    nameDialogOpen: false,
    name: "",
  }

  closeNameDialog = () => {
    this.setState({ nameDialogOpen: false })
  }

  getInitials = string => {
    if (string) {
      var names = string.trim().split(" "),
        initials = names[0].substring(0, 1).toUpperCase()

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.state.name) {
      this.setState({ name: nextProps.name })
    }

    if (
      nextProps.confirmationDialogOpen !== this.state.confirmationDialogOpen
    ) {
      this.setState({
        confirmationDialogOpen: this.props.confirmationDialogOpen,
      })

      oldName = this.props.name
    }
  }

  componentDidMount() {
    oldName = this.props.name
  }

  render() {
    const {
      userData: { user },
    } = this.props

    let changeName = () => {}

    if (user) {
      changeName = name => {
        this.props["ChangeName"]({
          variables: {
            name: name,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              name: name,
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
          onClose={this.props.handleNameDialogClose}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle style={{ width: "350px" }}>
            Manage your profile
          </DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            <Avatar
              style={{
                backgroundColor: this.props.profileIconColor || "#0057cb",
                width: "96px",
                height: "96px",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: "48px",
              }}
              className="defaultCursor"
            >
              {this.getInitials(this.state.name)}
            </Avatar>
            <br />

            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-email-login"
                placeholder="Email"
                value={this.state.name}
                onChange={event => {
                  this.setState({
                    name: event.target.value,
                  })
                }}
                onKeyPress={event => {
                  if (event.key === "Enter") changeName(this.state.name)
                }}
                endAdornment={
                  this.state.name ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          this.setState({ name: "" })
                        }}
                        onMouseDown={event => {
                          event.preventDefault()
                        }}
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
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
            <br />
          </div>
          <DialogActions>
            <Button
              onClick={this.props.handleNameDialogClose}
              style={{ marginRight: "4px" }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              label="Change"
              primary={true}
              disabled={!this.state.name || oldName === this.state.name}
              onClick={() => {
                changeName(this.state.name)
                this.props.handleNameDialogClose()
              }}
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeName($name: String!) {
      user(name: $name) {
        id
        name
      }
    }
  `,
  {
    name: "ChangeName",
  }
)(ChangeNameDialog)
