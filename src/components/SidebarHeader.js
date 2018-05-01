import React, { Component } from "react"
import IconButton from "material-ui/IconButton"
import Tooltip from "material-ui-next/Tooltip"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "material-ui-next/Icon"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

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

  render() {
    return (
      <div className="sidebarHeader notSelectable">
        <img
          alt="Igloo Logo"
          src="./assets/logo.svg"
          width="48px"
          height="48px"
          style={{ marginLeft: "5px" }}
          className="miniLogo notSelectable"
        />
        <div className="rightSide notSelectable">
          <MuiThemeProvider theme={theme}>
            <Tooltip
              id="tooltip-bottom"
              title="Igloo Magellano"
              placement="bottom"
            >
              <IconButton
                style={{
                  padding: "0",
                  margin: "0 5px 0 5px",
                  width: "32px",
                  height: "32px",
                }}
                className="sidebarHeaderButton"
              >
                <Icon color="primary">map</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip id="tooltip-bottom" title="Settings" placement="bottom">
              <IconButton
                onClick={this.props.openSettingsDialog}
                style={{
                  padding: "0",
                  margin: "0 5px 0 5px",
                  width: "32px",
                  height: "32px",
                }}
                className="sidebarHeaderButton"
              >
                <Icon color="primary">settings</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip id="tooltip-bottom" title="Log out" placement="bottom">
              <IconButton
                onClick={this.props.logOut}
                style={{
                  padding: "0",
                  margin: "0 5px 0 5px",
                  width: "32px",
                  height: "32px",
                }}
                className="sidebarHeaderButton"
              >
                <Icon color="primary">exit_to_app</Icon>
              </IconButton>
            </Tooltip>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

export default hotkeys(SidebarHeader)
