import React, { Component } from "react"
import SettingsIcon from "material-ui/svg-icons/action/settings"
import LogOutIcon from "material-ui/svg-icons/action/exit-to-app"
import IconButton from "material-ui/IconButton"
import NotificationIcon from "material-ui/svg-icons/social/notifications"
import AppBar from "material-ui/AppBar"

class SidebarHeader extends Component {
  render() {
    return (
      <AppBar
        className="sidebarHeader"
        zDepth={2}
        rounded={false}
        showMenuIconButton={false}
      >
        <div className="sidebarHeaderBackground">
          <img
            alt="igloo logo"
            src="/assets/logo.svg"
            width="60px"
            height="60px"
            className="logo notSelectable"
          />
          <div className="rightSide">
            <NotificationIcon className="icon" />
            <SettingsIcon className="icon" />
            <IconButton
              onClick={this.props.logOut}
              style={{
                padding: "0",
                margin: "0 5px 0 5px",
                width: "24px",
                height: "24px",
              }}
              className="logoutButton"
            >
              <LogOutIcon />
            </IconButton>
          </div>
        </div>
      </AppBar>
    )
  }
}

export default SidebarHeader
