import React, { Component } from "react"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "@material-ui/core/Icon"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
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
        }}
      >
        <MuiThemeProvider
          theme={createMuiTheme({
            palette: {
              primary: { main: "#ffffff" },
            },
          })}
        >
          <Tooltip id="tooltip-bottom" title="Boards" placement="bottom">
            <IconButton
              style={{
                marginLeft: "8px",
              }}
              color="primary"
              className="sidebarHeaderButton"
              onClick={() => this.setState({ goToBoards: true })}
            >
              <Icon>chevron_left</Icon>
            </IconButton>
          </Tooltip>
        </MuiThemeProvider>
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
          {this.props.boards &&
            this.props.boards.filter(
              board => board.id === this.props.selectedBoard
            )[0] &&
            this.props.boards.filter(
              board => board.id === this.props.selectedBoard
            )[0].customName}
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
          <MuiThemeProvider theme={theme}>
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
            <MuiThemeProvider
              theme={createMuiTheme({
                palette: {
                  primary: { main: "#ffffff" },
                },
              })}
            >
              <Tooltip id="tooltip-bottom" title="Settings" placement="bottom">
                <IconButton
                  onClick={this.props.openSettingsDialog}
                  className="sidebarHeaderButton"
                  color="primary"
                >
                  <Icon color="primary">settings</Icon>
                </IconButton>
              </Tooltip>
            </MuiThemeProvider>
            <MuiThemeProvider
              theme={createMuiTheme({
                palette: {
                  primary: { main: "#ffffff" },
                },
              })}
            >
              <Tooltip id="tooltip-bottom" title="Log out" placement="bottom">
                <IconButton
                  onClick={this.props.logOut}
                  className="sidebarHeaderButton"
                  color="primary"
                >
                  <Icon color="primary">exit_to_app</Icon>
                </IconButton>
              </Tooltip>
            </MuiThemeProvider>
          </MuiThemeProvider>
        </div>
        {this.state.goToBoards && <Redirect push to="/dashboard" />}
      </div>
    )
  }
}

export default hotkeys(SidebarHeader)
