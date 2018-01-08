import React, { Component } from "react"
import Toggle from "material-ui/Toggle"

class ReadWriteBooleanTile extends Component {
  render() {
    return (
      <div>
        <Toggle
          thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
          trackSwitchedStyle={{ backgroundColor: "#40a2ff" }}
        />
      </div>
    )
  }
}

export default ReadWriteBooleanTile
