import React from "react"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import Popover from "@material-ui/core/Popover"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Divider from "@material-ui/core/Divider"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Settings from "@material-ui/icons/Settings"
import People from "@material-ui/icons/People"

export default class AccountPopover extends React.Component {
  state = { popoverOpen: false }

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

  render() {
    let currentUser =
      typeof Storage !== undefined &&
      localStorage.getItem("accountList") &&
      JSON.parse(localStorage.getItem("accountList")).filter(
        account => account.id === localStorage.getItem("userId")
      )[0]

    return (
      <React.Fragment>
        <IconButton
          onClick={() => this.setState({ popoverOpen: true })}
          buttonRef={node => {
            this.anchorEl = node
          }}
          style={{ width: "40px", height: "40px", padding: "0" }}
        >
          <Avatar
            style={
              currentUser && {
                backgroundColor: currentUser.profileIconColor,
              }
            }
          >
            {this.getInitials(currentUser && currentUser.name)}
          </Avatar>
        </IconButton>
        <Popover
          open={this.state.popoverOpen}
          onClose={() => this.setState({ popoverOpen: false })}
          anchorEl={this.anchorEl}
          marginThreshold={12}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          className="notSelectable"
        >
          <List>
            {typeof Storage !== undefined &&
              localStorage.getItem("accountList") &&
              JSON.parse(localStorage.getItem("accountList")).map(account => (
                <ListItem
                  button
                  selected={
                    typeof Storage !== undefined &&
                    localStorage.getItem("userId") === account.id
                  }
                >
                  <Avatar style={{ backgroundColor: account.profileIconColor }}>
                    {this.getInitials(account.name)}
                  </Avatar>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary={
                      <font>
                        {account.name}
                        {!account.token && (
                          <font style={{ color: "black", opacity: "0.54" }}>
                            {" "}
                            (signed out)
                          </font>
                        )}
                      </font>
                    }
                    secondary={account.email}
                  />
                </ListItem>
              ))}
            <ListItem button onClick={this.props.changeAccount}>
              <ListItemAvatar>
                <Avatar
                  style={{ backgroundColor: "transparent", color: "black" }}
                >
                  <People />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Manage accounts"
                style={{ cursor: "pointer" }}
              />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                this.props.openSettings()
                this.setState({ popoverOpen: false })
              }}
            >
              <ListItemAvatar>
                <Avatar
                  style={{ backgroundColor: "transparent", color: "black" }}
                >
                  <Settings />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Settings" style={{ cursor: "pointer" }} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                this.props.logOut()
                this.setState({ popoverOpen: false })
              }}
            >
              <ListItemAvatar>
                <Avatar
                  style={{ backgroundColor: "transparent", color: "black" }}
                >
                  <ExitToApp />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Log out" style={{ cursor: "pointer" }} />
            </ListItem>
          </List>
        </Popover>
      </React.Fragment>
    )
  }
}
