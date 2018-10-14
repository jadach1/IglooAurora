import React, { Component } from "react"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "material-ui-next/Icon"
import {
  MuiThemeProvider,
  createMuiTheme,
  Typography,
  Tooltip,
  IconButton,
} from "@material-ui/core"
import { Redirect } from "react-router-dom"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#fff" },
  },
})

class SidebarHeader extends Component {
  hot_keys = {
    "alt+,": {
      priority: 1,
      handler: event => this.props.changeSettingsState(),
    },
    "alt+q": {
      priority: 1,
      handler: event => this.props.logOut(),
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
        }}
      >
        <Tooltip id="tooltip-bottom" title="Boards" placement="bottom">
          <IconButton
            style={{
              color: "white",
              marginLeft: "8px",
            }}
            className="sidebarHeaderButton"
            onClick={() => this.setState({ goToBoards: true })}
          >
            <Icon>chevron_left</Icon>
          </IconButton>
        </Tooltip>
        <Typography
          variant="headline"
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
          {this.props.boardName}
        </Typography>
        <div
          style={{
            padding: "0",
            marginLeft: "auto",
            marginRight: "8px",
            float: "right",
          }}
        >
          <MuiThemeProvider theme={theme}>
            {/* <a href="https://igloocloud.github.io/IglooMagellan">
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
            {this.props.user && (
              <Tooltip id="tooltip-bottom" title="Settings" placement="bottom">
                <IconButton
                  onClick={this.props.openSettingsDialog}
                  className="sidebarHeaderButton"
                  style={{ color: "white" }}
                >
                  <Icon color="primary">settings</Icon>
                </IconButton>
              </Tooltip>
            )}
            <Tooltip id="tooltip-bottom" title="Log out" placement="bottom">
              <IconButton
                onClick={this.props.logOut}
                className="sidebarHeaderButton"
                style={{ color: "white" }}
              >
                <Icon color="primary">exit_to_app</Icon>
              </IconButton>
            </Tooltip>
          </MuiThemeProvider>
        </div>
        {this.state.goToBoards && <Redirect to="/dashboard" />}
      </div>
    )
  }
}

export default hotkeys(SidebarHeader)
