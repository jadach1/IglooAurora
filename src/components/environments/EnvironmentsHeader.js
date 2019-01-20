import React, { Component } from "react"
import AppBar from "@material-ui/core/AppBar"
import { hotkeys } from "react-keyboard-shortcuts"
import logo from "../../styles/assets/logo.svg"
import AccountPopover from "../AccountPopover"

class EnvironmentsHeader extends Component {
  hot_keys = {
    "alt+,": {
      priority: 1,
      handler: event =>
        this.props.areSettingsOpen
          ? this.props.closeSettings()
          : this.props.openSettings(),
    },
    "alt+.": {
      priority: 1,
      handler: event =>
        this.props.areSettingsOpen
          ? this.props.closeSettings()
          : this.props.openSettings(),
    },
    "alt+q": {
      priority: 1,
      handler: event => this.props.logOut(),
    },
  }

  render() {
    return (
      <AppBar
        position="sticky"
        style={{
          height: "64px",
        }}
      >
        <div
          className="sidebarHeader notSelectable"
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            height: "64px",
          }}
        >
          <img
            src={logo}
            alt="Igloo logo"
            className="notSelectable nonDraggable"
            draggable="false"
            style={{ width: "56px", marginLeft: "16px" }}
          />
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "12px",
              float: "right",
            }}
          >
            <AccountPopover
              logOut={this.props.logOut}
              changeAccount={this.props.changeAccount}
              openSettings={this.props.openSettings}
              user={this.props.userData}
            />
          </div>
        </div>
      </AppBar>
    )
  }
}

export default hotkeys(EnvironmentsHeader)
