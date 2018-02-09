import React, { Component } from "react"
import IconButton from "material-ui/IconButton"
import Popover from "material-ui/Popover"
import Menu from "material-ui/Menu"
import MenuItem from "material-ui/MenuItem"
import NotificationsPopover from "./NotificationsPopover"

class SidebarHeader extends Component {
  state = {
    open: false,
  }

  handleClick = event => {
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="sidebarHeader">
          <img
            alt="Igloo Logo"
            src="/assets/logo.svg"
            width="60px"
            height="60px"
            className="miniLogo notSelectable"
          />
          <div className="rightSide notSelectable">
            <IconButton
              style={{
                padding: "0",
                margin: "0 5px 0 5px",
                width: "24px",
                height: "24px",
              }}
              onClick={this.handleClick}
              className="sidebarHeaderButton"
              tooltip="Notifications"
            >
              <i className="material-icons sidebarHeaderIcons">
                notifications_none
              </i>
            </IconButton>
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
              <i className="material-icons sidebarHeaderIcons">exit_to_app</i>{" "}
            </IconButton>
          </div>
        </div>
        <NotificationsPopover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          handleRequestClose={this.handleRequestClose}
        />
      </React.Fragment>
    )
  }
}

export default SidebarHeader
