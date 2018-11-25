import React, { Component } from "react"

class ReadOnlyStringTile extends Component {
  render() {
    return (
      <div className="readOnlyFloatTile">
        <div
          className="number"
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? { color: "white" }
              : {}
          }
        >
          {this.props.value}
        </div>
      </div>
    )
  }
}

export default ReadOnlyStringTile
