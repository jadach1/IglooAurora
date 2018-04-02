import React, { Component } from "react"
import IconButton from "material-ui/IconButton"
import Tooltip from "material-ui-next/Tooltip"

class SidebarHeader extends Component {
  render() {
    return (
      <div className="sidebarHeader">
        <img
          alt="Igloo Logo"
          src="/assets/logo.svg"
          width="48px"
          height="48px"
          style={{ marginLeft: "5px" }}
          className="miniLogo notSelectable"
        />
        <div className="rightSide notSelectable">
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
              <i className="material-icons sidebarHeaderIcons">settings</i>
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
              <i className="material-icons sidebarHeaderIcons">exit_to_app</i>
            </IconButton>
          </Tooltip>
        </div>
      </div>
    )
  }
}

export default SidebarHeader
