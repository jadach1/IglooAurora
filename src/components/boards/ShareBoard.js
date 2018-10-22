import React from "react"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Typography from "@material-ui/core/Typography"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Grid from "@material-ui/core/Grid"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { RadioButtonGroup, RadioButton } from "material-ui"

const theme = createMuiTheme({
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

class ShareBoard extends React.Component {
  state = {
    menuOpen: false,
    addAdminOpen: false,
    changeRoleOpen: false,
    stopSharingOpen: false,
    menuTarget: null,
    email: "",
    selectedUserType: "",
    selectedUserForCHangeRoleDialog: "",
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

  inviteUser = role => {
    this.props.InviteUser({
      variables: {
        role: role,
        boardId: this.props.board.id,
        email: this.state.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        shareBoard: {
          id: this.props.board.id,
          email: this.state.email,
          role: role,
          __typename: "Board",
        },
      },
    })
  }

  changeRole = role => {
    this.props.InviteUser({
      variables: {
        role: role.toUpperCase(),
        boardId: this.props.board.id,
        email: this.state.menuTarget.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        shareBoard: {
          id: this.props.board.id,
          email: this.state.menuTarget.email,
          role: role.toUpperCase(),
          __typename: "Board",
        },
      },
    })
  }

  stopSharing = () => {
    this.props.StopSharing({
      variables: {
        boardId: this.props.board.id,
        email: this.state.menuTarget.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stopSharing: {
          id: this.props.board.id,
          email: this.state.menuTarget.email,
          __typename: "Board",
        },
      },
    })
  }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={
            this.props.open &&
            !this.state.addAdminOpen &&
            !this.state.changeRoleOpen &&
            !this.state.stopSharingOpen
          }
          onClose={this.props.close}
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          className="notSelectable defaultCursor"
        >
          <DialogTitle
            className="notSelectable defaultCursor"
            style={{ width: "350px" }}
          >
            Share board
          </DialogTitle>
          <Typography
            variant="Title"
            style={{ paddingLeft: "24px" }}
            className="notSelectable defaultCursor"
          >
            This board is shared with:
          </Typography>
          <List
            subheader={<li />}
            style={
              window.innerWidth < MOBILE_WIDTH
                ? { overflow: "auto", height: "100%" }
                : { overflow: "auto", maxHeight: "420px" }
            }
          >
            <li key="Owner">
              <ul style={{ padding: "0" }}>
                <ListSubheader
                  style={{ backgroundColor: "white" }}
                  className="notSelectable defaultCursor"
                >
                  Owner
                </ListSubheader>
                <ListItem key={this.props.board.owner.id}>
                  <ListItemAvatar>
                    <Avatar
                      style={{
                        backgroundColor: this.props.board.owner
                          .profileIconColor,
                      }}
                    >
                      {this.getInitials(this.props.board.owner.fullName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      this.props.userData.user.email ===
                      this.props.board.owner.email
                        ? "You"
                        : this.props.board.owner.fullName
                    }
                    secondary={
                      this.props.userData.user.email ===
                      this.props.board.owner.email
                        ? ""
                        : this.props.board.owner.email
                    }
                  />
                  {this.props.userData.user.email ===
                    this.props.board.owner.email && (
                    <ListItemSecondaryAction>
                      <IconButton>
                        <Icon>swap_horiz</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              </ul>
            </li>
            {!(
              (this.props.board.myRole === "EDITOR" ||
                this.props.board.myRole === "SPECTATOR") &&
              !this.props.board.admins[0]
            ) && (
              <li key="Admins">
                <ul style={{ padding: "0" }}>
                  <ListSubheader
                    style={{ backgroundColor: "white" }}
                    className="notSelectable defaultCursor"
                  >
                    Admins
                  </ListSubheader>
                  {this.props.board.admins.map(item => (
                    <ListItem key={item.id}>
                      <ListItemAvatar
                        style={{
                          backgroundColor: item.profileIconColor,
                        }}
                      >
                        <Avatar>{this.getInitials(item.fullName)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          this.props.userData.user.email === item.email
                            ? "You"
                            : item.fullName
                        }
                        secondary={
                          this.props.userData.user.email === item.email
                            ? ""
                            : item.email
                        }
                      />
                      {this.props.userData.user.email !== item.email && (
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={event =>
                              this.setState({
                                anchorEl: event.currentTarget,
                                menuTarget: item,
                                selectedUserForCHangeRoleDialog: "admin",
                              })
                            }
                          >
                            <Icon>more_vert</Icon>
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                  {(this.props.board.myRole === "ADMIN" ||
                    this.props.board.myRole === "OWNER") && (
                    <ListItem
                      button
                      onClick={() =>
                        this.setState({
                          addAdminOpen: true,
                          selectedUserType: "admin",
                        })
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          style={{
                            backgroundColor: "transparent",
                            color: "#000",
                          }}
                        >
                          <Icon>person_add</Icon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Invite an admin" />
                    </ListItem>
                  )}
                </ul>
              </li>
            )}
            {!(
              this.props.board.myRole === "SPECTATOR" &&
              !this.props.board.admins[0]
            ) && (
              <li key="Editors">
                <ul style={{ padding: "0" }}>
                  <ListSubheader style={{ backgroundColor: "white" }}>
                    Editors
                  </ListSubheader>
                  {this.props.board.editors.map(item => (
                    <ListItem key={item.id}>
                      <ListItemAvatar>
                        <Avatar
                          style={{
                            backgroundColor: item.profileIconColor,
                          }}
                        >
                          {this.getInitials(item.fullName)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          this.props.userData.user.email === item.email
                            ? "You"
                            : item.fullName
                        }
                        secondary={
                          this.props.userData.user.email === item.email
                            ? ""
                            : item.email
                        }
                      />
                      {this.props.userData.user.email !== item.email && (
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={event =>
                              this.setState({
                                anchorEl: event.currentTarget,
                                menuTarget: item,
                                selectedUserForCHangeRoleDialog: "editor",
                              })
                            }
                          >
                            <Icon>more_vert</Icon>
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                  {(this.props.board.myRole === "ADMIN" ||
                    this.props.board.myRole === "OWNER") && (
                    <ListItem
                      button
                      onClick={() =>
                        this.setState({
                          addAdminOpen: true,
                          selectedUserType: "editor",
                        })
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          style={{
                            backgroundColor: "transparent",
                            color: "#000",
                          }}
                        >
                          <Icon>person_add</Icon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Invite an editor" />
                    </ListItem>
                  )}
                </ul>
              </li>
            )}
            {!(
              this.props.board.myRole === "EDITOR" &&
              !this.props.board.admins[0]
            ) && (
              <li key="Spectators">
                <ul style={{ padding: "0" }}>
                  <ListSubheader style={{ backgroundColor: "white" }}>
                    Spectators
                  </ListSubheader>
                  {this.props.board.spectators.map(item => (
                    <ListItem key={item.id}>
                      <ListItemAvatar>
                        <Avatar
                          style={{
                            backgroundColor: item.profileIconColor,
                          }}
                        >
                          {this.getInitials(item.fullName)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          this.props.userData.user.email === item.email
                            ? "You"
                            : item.fullName
                        }
                        secondary={
                          this.props.userData.user.email === item.email
                            ? ""
                            : item.email
                        }
                      />
                      {this.props.userData.user.email !== item.email && (
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={event =>
                              this.setState({
                                anchorEl: event.currentTarget,
                                menuTarget: item,
                                selectedUserForCHangeRoleDialog: "spectator",
                              })
                            }
                          >
                            <Icon>more_vert</Icon>
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                  {(this.props.board.myRole === "ADMIN" ||
                    this.props.board.myRole === "OWNER") && (
                    <ListItem
                      button
                      onClick={() =>
                        this.setState({
                          addAdminOpen: true,
                          selectedUserType: "spectator",
                        })
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          style={{
                            backgroundColor: "transparent",
                            color: "#000",
                          }}
                        >
                          <Icon>person_add</Icon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Invite a spectator" />
                    </ListItem>
                  )}
                </ul>
              </li>
            )}
          </List>
          <Menu
            anchorEl={this.state.anchorEl}
            open={this.state.anchorEl}
            onClose={() => this.setState({ anchorEl: null })}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() =>
                this.setState({ changeRoleOpen: true, anchorEl: null })
              }
            >
              <ListItemIcon>
                <Icon
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  edit
                </Icon>
              </ListItemIcon>
              <ListItemText inset primary="Change role" />
            </MenuItem>
            <MenuItem
              onClick={() =>
                this.setState({ stopSharingOpen: true, anchorEl: null })
              }
            >
              <ListItemIcon>
                <Icon style={{ color: "#f44336" }}>remove_circle</Icon>
              </ListItemIcon>
              <ListItemText inset>
                <span style={{ color: "#f44336" }}>Stop sharing</span>
              </ListItemText>
            </MenuItem>
          </Menu>
          <DialogActions
            className="notSelectable defaultCursor"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          >
            <MuiThemeProvider theme={theme}>
              <Button onClick={this.props.close}>Close</Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.addAdminOpen}
          onClose={() => this.setState({ addAdminOpen: false })}
          className="notSelectable defaultCursor"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            className="notSelectable defaultCursor"
            style={{ width: "350px" }}
          >
            Invite an {this.state.selectedUserType}
          </DialogTitle>
          <MuiThemeProvider theme={theme}>
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{
                width: "100%",
                paddingLeft: "24px",
                paddingRight: "24px",
              }}
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
                      })
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter") {
                        this.setState({ addAdminOpen: false })
                        this.inviteUser(
                          this.state.selectedUserType.toUpperCase()
                        )
                      }
                    }}
                    endAdornment={
                      this.state.email ? (
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
          </MuiThemeProvider>
          <div style={{ height: "100%" }} />
          <br />
          <DialogActions
            className="notSelectable defaultCursor"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          >
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={() => this.setState({ addAdminOpen: false })}
                style={{ marginRight: "4px" }}
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                onClick={() => {
                  this.setState({ addAdminOpen: false })
                  this.inviteUser(this.state.selectedUserType.toUpperCase())
                }}
              >
                Invite
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.changeRoleOpen}
          onClose={() => this.setState({ changeRoleOpen: false })}
          className="notSelectable defaultCursor"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            className="notSelectable defaultCursor"
            style={{ width: "300px" }}
          >
            Change role
          </DialogTitle>
          <div style={{ paddingLeft: "24px" }}>Role</div>
          <RadioButtonGroup
            name="role"
            onChange={(event, value) =>
              this.setState({ selectedUserForCHangeRoleDialog: value })
            }
            valueSelected={this.state.selectedUserForCHangeRoleDialog}
            style={{
              height: "100%",
            }}
          >
            <RadioButton
              value="admin"
              label="Admin"
              style={{
                marginTop: 12,
                marginBottom: 16,
                paddingLeft: 24,
                width: "calc(100% - 24px)",
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
            <RadioButton
              value="editor"
              label="Editor"
              style={{
                marginTop: 12,
                marginBottom: 16,
                paddingLeft: 24,
                width: "calc(100% - 24px)",
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
            <RadioButton
              value="spectator"
              label="Spectator"
              style={{
                marginTop: 12,
                marginBottom: 16,
                paddingLeft: 24,
                width: "calc(100% - 24px)",
              }}
              rippleStyle={{ color: "#0083ff" }}
              checkedIcon={
                <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
              }
              uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
            />
          </RadioButtonGroup>
          <DialogActions
            className="notSelectable defaultCursor"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          >
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={() => this.setState({ changeRoleOpen: false })}
                style={{ marginRight: "4px" }}
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                onClick={() => {
                  this.setState({ changeRoleOpen: false })
                  this.changeRole(this.state.selectedUserForCHangeRoleDialog)
                }}
              >
                Change role
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.stopSharingOpen}
          onClose={() => this.setState({ stopSharingOpen: false })}
          className="notSelectable defaultCursor"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>Stop sharing</DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              width: "350px",
              height: "100%",
            }}
          >
            Are you sure you want to stop sharing this board with{" "}
            {this.state.menuTarget && this.state.menuTarget.fullName}?<br />
          </div>
          <DialogActions
            className="notSelectable defaultCursor"
            style={{ marginLeft: "8px", marginRight: "8px" }}
          >
            <MuiThemeProvider
              theme={createMuiTheme({
                palette: {
                  primary: { main: "#f44336" },
                },
              })}
            >
              <Button
                onClick={() => this.setState({ stopSharingOpen: false })}
                style={{ marginRight: "4px" }}
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                primary={true}
                onClick={() => {
                  this.stopSharing()
                  this.setState({ stopSharingOpen: false })
                }}
              >
                Stop sharing
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
    mutation StopSharing($email: String!, $boardId: ID!) {
      stopSharingBoard(email: $email, boardId: $boardId) {
        id
      }
    }
  `,
  {
    name: "StopSharing",
  }
)(
  graphql(
    gql`
      mutation InviteUser($email: String!, $boardId: ID!, $role: Role!) {
        shareBoard(email: $email, boardId: $boardId, role: $role) {
          id
        }
      }
    `,
    {
      name: "InviteUser",
    }
  )(ShareBoard)
)
