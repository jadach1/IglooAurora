import React from "react"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
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
import StopSharing from "./StopSharing"

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

  changeRole = role => {
    this.props.ChangeRole({
      variables: {
        newRole: role.toUpperCase(),
        boardId: this.props.board.id,
        email: this.state.menuTarget.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        shareBoard: {
          id: this.props.board.id,
          email: this.state.menuTarget.email,
          newRole: role.toUpperCase(),
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
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Share board</DialogTitle>
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
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? {
                          color: "#c1c2c5",
                          cursor: "default",
                          backgroundColor: "#2f333d",
                        }
                      : {
                          color: "#7a7a7a",
                          cursor: "default",
                          backgroundColor: "white",
                        }
                  }
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
                      {this.getInitials(this.props.board.owner.name)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      this.props.userData.user.email ===
                      this.props.board.owner.email
                        ? "You"
                        : this.props.board.owner.name
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
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        <Icon>swap_horiz</Icon>
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              </ul>
            </li>
            {(this.props.board.myRole === "ADMIN" ||
              this.props.board.myRole === "OWNER" ||
              this.props.board.admins[0] ||
              this.props.board.pendingBoardShares.filter(
                boardShare => boardShare.role === "ADMIN"
              )) && (
              <li key="Admins">
                <ul style={{ padding: "0" }}>
                  <ListSubheader
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? {
                            color: "#c1c2c5",
                            cursor: "default",
                            backgroundColor: "#2f333d",
                          }
                        : {
                            color: "#7a7a7a",
                            cursor: "default",
                            backgroundColor: "white",
                          }
                    }
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
                        <Avatar>{this.getInitials(item.name)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          this.props.userData.user.email === item.email
                            ? "You"
                            : item.name
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
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            <Icon>more_vert</Icon>
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                  {(this.props.board.myRole === "ADMIN" ||
                    this.props.board.myRole === "OWNER") &&
                    this.props.board.pendingBoardShares
                      .filter(boardShare => boardShare.role === "ADMIN")
                      .map(item => (
                        <ListItem key={item.id}>
                          <ListItemAvatar
                            style={{
                              backgroundColor: item.receiver.profileIconColor,
                            }}
                          >
                            <Avatar>
                              {this.getInitials(item.receiver.name)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.receiver.name + " (pending)"}
                            secondary={item.receiver.email}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={event =>
                                this.setState({
                                  anchorEl2: event.currentTarget,
                                  menuTarget: item,
                                  selectedUserForChangeRoleDialog: "admin",
                                })
                              }
                              style={
                                typeof Storage !== "undefined" &&
                                localStorage.getItem("nightMode") === "true"
                                  ? { color: "white" }
                                  : { color: "black" }
                              }
                            >
                              <Icon>more_vert</Icon>
                            </IconButton>
                          </ListItemSecondaryAction>
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
            {(this.props.board.myRole === "ADMIN" ||
              this.props.board.myRole === "OWNER" ||
              this.props.board.editors[0] ||
              this.props.board.pendingBoardShares.filter(
                boardShare => boardShare.role === "EDITOR"
              )) && (
              <li key="Editors">
                <ul style={{ padding: "0" }}>
                  <ListSubheader
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? {
                            color: "#c1c2c5",
                            cursor: "default",
                            backgroundColor: "#2f333d",
                          }
                        : {
                            color: "#7a7a7a",
                            cursor: "default",
                            backgroundColor: "white",
                          }
                    }
                  >
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
                          {this.getInitials(item.name)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          this.props.userData.user.email === item.email
                            ? "You"
                            : item.name
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
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            <Icon>more_vert</Icon>
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                  {(this.props.board.myRole === "ADMIN" ||
                    this.props.board.myRole === "OWNER") &&
                    this.props.board.pendingBoardShares
                      .filter(boardShare => boardShare.role === "EDITOR")
                      .map(item => (
                        <ListItem key={item.id}>
                          <ListItemAvatar
                            style={{
                              backgroundColor: item.receiver.profileIconColor,
                            }}
                          >
                            <Avatar>
                              {this.getInitials(item.receiver.name)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.receiver.name + " (pending)"}
                            secondary={item.receiver.email}
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={event =>
                                this.setState({
                                  anchorEl2: event.currentTarget,
                                  menuTarget: item,
                                  selectedUserForChangeRoleDialog: "editor",
                                })
                              }
                              style={
                                typeof Storage !== "undefined" &&
                                localStorage.getItem("nightMode") === "true"
                                  ? { color: "white" }
                                  : { color: "black" }
                              }
                            >
                              <Icon>more_vert</Icon>
                            </IconButton>
                          </ListItemSecondaryAction>
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
            {(this.props.board.myRole === "ADMIN" ||
              this.props.board.myRole === "OWNER" ||
              this.props.board.spectators[0] ||
              this.props.board.pendingBoardShares.filter(
                boardShare => boardShare.role === "SPECTATOR"
              )) && (
              <li key="Spectators">
                <ul style={{ padding: "0" }}>
                  <ListSubheader
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? {
                            color: "#c1c2c5",
                            cursor: "default",
                            backgroundColor: "#2f333d",
                          }
                        : {
                            color: "#7a7a7a",
                            cursor: "default",
                            backgroundColor: "white",
                          }
                    }
                  >
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
                          {this.getInitials(item.name)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          this.props.userData.user.email === item.email
                            ? "You"
                            : item.name
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
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
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
                <Icon>edit</Icon>
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
          <Menu
            anchorEl={this.state.anchorEl2}
            open={this.state.anchorEl2}
            onClose={() => this.setState({ anchorEl2: null })}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => this.setState({ anchorEl2: null })}>
              <ListItemIcon>
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText inset primary="Change role" />
            </MenuItem>
            <MenuItem onClick={() => this.setState({ anchorEl2: null })}>
              <ListItemIcon>
                <Icon style={{ color: "#f44336" }}>remove_circle</Icon>
              </ListItemIcon>
              <ListItemText inset>
                <span style={{ color: "#f44336" }}>Revoke invite</span>
              </ListItemText>
            </MenuItem>
          </Menu>
          <DialogActions>
            <Button onClick={this.props.close}>Close</Button>
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
          selectedUserType={this.state.selectedUserForChangeRoleDialog}
        />
        <InviteUser
          open={this.state.inviteUserOpen}
          close={() => this.setState({ inviteUserOpen: false })}
          selectedUserType={this.state.selectedUserType}
          client={this.props.client}
          boardId={this.props.board.id}
        />
        <StopSharing
          open={this.state.stopSharingOpen}
          close={() => this.setState({ stopSharingOpen: false })}
          stopSharing={this.stopSharing}
          menuTarget={this.state.menuTarget}
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
      mutation ChangeRole($email: String!, $boardId: ID!, $newRole: Role!) {
        changeRole(email: $email, boardId: $boardId, newRole: $newRole) {
          id
        }
      }
    `,
    {
      name: "ChangeRole",
    }
  )(ShareBoard)
)
