import React, { Component } from "react"
import AppBar from "material-ui-next/AppBar"
import Icon from "material-ui-next/Icon"

export default class StatusBar extends Component {
  render() {
    return (
      <AppBar position="static" style={{ height: "30px" }} color="default">
        <div
          style={{ height: "30px", cursor: "default" }}
          className="notSelectable"
        >
          Last seen: 8 hours ago
          <Icon>network_wifi</Icon>
          <Icon>battery_full</Icon>
          97%
        </div>
      </AppBar>
    )
  }
}
