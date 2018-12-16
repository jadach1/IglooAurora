import React, { Component } from "react"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Tooltip from "@material-ui/core/Tooltip"
import AppBar from "@material-ui/core/AppBar"
import { hotkeys } from "react-keyboard-shortcuts"
import logo from "../../styles/assets/logo.svg"

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
            className="notSelectable"
            style={{ width: "56px", marginLeft: "16px" }}
          />
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "8px",
              float: "right",
            }}
          >
            {/* <a href="drekar.igloo.ooo">
              <Tooltip
                id="tooltip-bottom"
                title="Go to Magellan"
                placement="bottom"
              >
                <IconButton
                  className="sidebarHeaderButton"
color="default"                >
                  <Icon style={{ color: "white" }}>map</Icon>
                </IconButton>
              </Tooltip>
            </a> */}
            <Tooltip id="tooltip-bottom" title="Settings" placement="bottom">
              <IconButton
                onClick={this.props.openSettings}
                style={{ color: "white" }}
              >
                <Icon>settings</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip id="tooltip-bottom" title="Log out" placement="bottom">
              <IconButton
                onClick={this.props.logOut}
                className="sidebarHeaderButton"
                style={{ color: "white" }}
              >
                <Icon>exit_to_app</Icon>
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </AppBar>
    )
  }
}

export default hotkeys(EnvironmentsHeader)
