import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Avatar from "@material-ui/core/Avatar"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
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

let oldName = ""

const MOBILE_WIDTH = 500

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
    fullName: "",
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
    if (nextProps.fullName !== this.state.fullName) {
      this.setState({ fullName: nextProps.fullName })
    }
  }

  componentDidMount() {
    oldName = this.props.fullName
  }

  render() {
    const {
      userData: { user },
    } = this.props

    let changeName = () => {}

    if (user) {
      changeName = fullName => {
        this.props["ChangeName"]({
          variables: {
            fullName: fullName,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              fullName: fullName,
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
              {this.getInitials(this.state.fullName)}
            </Avatar>
            <br />
            <MuiThemeProvider theme={theme}>
              <Grid
                container
                spacing={0}
                alignItems="flex-end"
                style={{ width: "100%" }}
              >
                <Grid item style={{ marginRight: "16px" }}>
                  <Icon>account_circle</Icon>
                </Grid>
                <Grid item style={{ width: "calc(100% - 40px)" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Input
                      id="adornment-email-login"
                      placeholder="Email"
                      value={this.state.fullName}
                      onChange={event => {
                        this.setState({
                          fullName: event.target.value,
                        })
                      }}
                      onKeyPress={event => {
                        if (event.key === "Enter")
                          changeName(this.state.fullName)
                      }}
                      endAdornment={
                        this.state.fullName ? (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => {
                                this.setState({ fullName: "" })
                              }}
                              onMouseDown={event => {
                                event.preventDefault()
                              }}
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
            </MuiThemeProvider>
            <br />
          </div>
          <DialogActions>
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={this.props.handleNameDialogClose}
                style={{ marginRight: "4px" }}
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                label="Change"
                primary={true}
                disabled={
                  !this.state.fullName || oldName === this.state.fullName
                }
                onClick={() => {
                  changeName(this.state.fullName)
                }}
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
    mutation ChangeName($fullName: String!) {
      user(fullName: $fullName) {
        id
        fullName
      }
    }
  `,
  {
    name: "ChangeName",
  }
)(ChangeNameDialog)
