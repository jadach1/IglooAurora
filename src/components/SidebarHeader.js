import React, { Component } from "react"
import IconButton from "material-ui/IconButton"
import Popover from "material-ui/Popover"
import Menu from "material-ui/Menu"
import MenuItem from "material-ui/MenuItem"
import NotificationsPopover from "./NotificationsPopover"

class SidebarHeader extends Component {
  render() {
    return (
      <div className="sidebarHeader">
        <img
          alt="Igloo Logo"
          src="/assets/logo.svg"
          width="60px"
          height="60px"
          className="miniLogo notSelectable"
        />
        <div className="rightSide notSelectable">
          <NotificationsPopover />
          <IconButton
            onClick={this.props.openSettingsDialog}
            style={{
              padding: "0",
              margin: "0 5px 0 5px",
              width: "24px",
              height: "24px",
            }}
            className="sidebarHeaderButton"
            tooltip="Settings"
          >
            <i className="material-icons sidebarHeaderIcons">settings</i>
          </IconButton>
          <IconButton
            onClick={this.props.logOut}
            style={{
              padding: "0",
              margin: "0 5px 0 5px",
              width: "24px",
              height: "24px",
            }}
            className="sidebarHeaderButton"
            tooltip="Log out"
          >
            <i className="material-icons sidebarHeaderIcons">exit_to_app</i>
          </IconButton>
        </div>
      </div>
    )
  }
}

export default SidebarHeader
