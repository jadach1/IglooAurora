import React, { Component } from "react"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "@material-ui/core/Icon"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import { Link, Redirect } from "react-router-dom"

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
      handler: event => this.setState({ goToEnvironments: true }),
    },
  }

  state = {
    goToEnvironments: false,
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
          maxWidth: "100vw",
        }}
      >
        <Tooltip
          id="tooltip-bottom"
          title={
            <font className="notSelectable defaultCursor">Environments</font>
          }
          placement="bottom"
        >
          <Link
            to="/"
            style={{
              marginLeft: "8px",
              textDecoration: "none",
              color: "white",
            }}
          >
            <IconButton
              style={{
                color: "white",
              }}
              onClick={() => this.setState({ goToEnvironments: true })}
              tabIndex="-1"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
          </Link>
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
            marginRight: "8px",
          }}
        >
          {this.props.environments &&
            this.props.environments.filter(
              environment => environment.id === this.props.selectedEnvironment
            )[0] &&
            this.props.environments.filter(
              environment => environment.id === this.props.selectedEnvironment
            )[0].name}
        </Typography>
        {this.state.goToEnvironments && <Redirect push to="/" />}
      </div>
    )
  }
}

export default hotkeys(SidebarHeader)
