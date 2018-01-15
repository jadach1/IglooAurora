import React, { Component } from "react"
import IconButton from "material-ui/IconButton"

class SidebarHeader extends Component {
  render() {
    return (
      <div className="sidebarHeader">
        <img
          alt="igloo logo"
          src="/assets/logo.svg"
          width="60px"
          height="60px"
          className="logo notSelectable"
        />
        <div className="rightSide">
          <IconButton
            style={{
              padding: "0",
              margin: "0 5px 0 5px",
              width: "24px",
              height: "24px",
            }}
            className="sidebarHeaderButton"
          >
            <i class="material-icons sidebarHeaderIcons">notifications_none</i>
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
          >
            <i class="material-icons sidebarHeaderIcons">settings</i>
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
          >
            <i class="material-icons sidebarHeaderIcons">exit_to_app</i>{" "}
          </IconButton>
        </div>
      </div>
    )
  }
}

export default SidebarHeader
