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
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ChangeRole from "./ChangeRole"
import ChangeOwner from "./ChangeOwner"
import InviteUser from "./InviteUser"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const MOBILE_WIDTH = 600

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
    inviteUserOpen: false,
    changeRoleOpen: false,
    stopSharingOpen: false,
    menuTarget: null,
    email: "",
    selectedUserType: "",
    selectedUserForChangeRoleDialog: "",
    changeOwnerOpen: false,
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

  inviteUser = (role, email) => {
    this.props.InviteUser({
      variables: {
        role: role,
        boardId: this.props.board.id,
        email: email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        shareBoard: {
          id: this.props.board.id,
          email: email,
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
            !this.state.inviteUserOpen &&
            !this.state.changeRoleOpen &&
            !this.state.stopSharingOpen &&
            !this.state.changeOwnerOpen
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
            variant="h6"
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
                      <IconButton
                        onClick={() => this.setState({ changeOwnerOpen: true })}
                      >
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
                                selectedUserForChangeRoleDialog: "admin",
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
                          inviteUserOpen: true,
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
                                selectedUserForChangeRoleDialog: "editor",
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
                          inviteUserOpen: true,
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
                                selectedUserForChangeRoleDialog: "spectator",
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
                          inviteUserOpen: true,
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
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
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
        <ChangeOwner
          open={this.state.changeOwnerOpen}
          close={() => this.setState({ changeOwnerOpen: false })}
        />
        <ChangeRole
          open={this.state.changeRoleOpen}
          close={() => this.setState({ changeRoleOpen: false })}
          changeRole={this.changeRole}
        />
        <InviteUser
          open={this.state.inviteUserOpen}
          close={() => this.setState({ inviteUserOpen: false })}
          selectedUserType={this.state.selectedUserType}
          inviteUser={this.inviteUser}
        />
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
