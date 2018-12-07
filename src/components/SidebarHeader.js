import React, { Component } from "react"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "@material-ui/core/Icon"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { Redirect } from "react-router-dom"

class SidebarHeader extends Component {
  hot_keys = {
    "alt+,": {
      priority: 1,
      handler: event =>
        this.props.areSettingsOpen
          ? this.props.closeSettings()
          : this.props.openSettingsDialog(),
    },
    "alt+.": {
      priority: 1,
      handler: event =>
        this.props.areSettingsOpen
          ? this.props.closeSettings()
          : this.props.openSettingsDialog(),
    },
    "alt+q": {
      priority: 1,
      handler: event => this.props.logOut(),
    },
    "alt+backspace": {
      priority: 1,
      handler: event => this.setState({ goToBoards: true }),
    },
  }

  state = {
    goToBoards: false,
  }

  render() {
    return (
      <div
        className="sidebarHeader notSelectable"
        style={{
          color: "white",
          display: "flex",
          alignItems: "center",
          height: "64px",
          gridArea: "sidebarHeader",
          background: "#0057cb",
          zIndex: 1000,
        }}
      >
        <Tooltip
          id="tooltip-bottom"
          title={<font className="notSelectable defaultCursor">Boards</font>}
          placement="bottom"
        >
          <IconButton
            style={{
              marginLeft: "8px",
              color: "white",
            }}
            onClick={() => this.setState({ goToBoards: true })}
          >
            <Icon>chevron_left</Icon>
          </IconButton>
        </Tooltip>
        <Typography
          variant="h5"
          style={{
            cursor: "default",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "white",
            lineHeight: "64px",
            marginLeft: "8px",
          }}
        >
          {this.props.boards &&
            this.props.boards.filter(
              board => board.id === this.props.selectedBoard
            )[0] &&
            this.props.boards.filter(
              board => board.id === this.props.selectedBoard
            )[0].name}
        </Typography>
        <div
          style={{
            padding: "0",
            marginLeft: "auto",
            marginRight: "8px",
            float: "right",
            minWidth: "96px",
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
                  style={{ color: "white" }}
                >
                  <Icon color="primary">map</Icon>
                </IconButton>
              </Tooltip>
            </a> */}
          <Tooltip
            id="tooltip-bottom"
            title={
              <font className="notSelectable defaultCursor">Settings</font>
            }
            placement="bottom"
          >
            <IconButton
              onClick={this.props.openSettingsDialog}
              style={{ color: "white" }}
            >
              <Icon>settings</Icon>
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-bottom" title="Log out" placement="bottom">
            <IconButton onClick={this.props.logOut} style={{ color: "white" }}>
              <Icon>exit_to_app</Icon>
            </IconButton>
          </Tooltip>
        </div>
        {this.state.goToBoards && <Redirect push to="/dashboard" />}
      </div>
    )
  }
}

export default hotkeys(SidebarHeader)
