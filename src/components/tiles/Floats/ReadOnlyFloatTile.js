import React, { Component } from "react"

class ReadOnlyFloatTile extends Component {
  render() {
    return (
      <div className="readOnlyFloatTile">
        <div
          className="number"
          style={this.props.nightMode ? { color: "white" } : {}}
        >
          {this.props.value}{" "}
          <font
            style={
              this.props.nightMode ? { color: "#c1c2c5" } : { color: "#7a7a7a" }
            }
          >
            {" "}
            {this.props.valueDetails}
          </font>
        </div>
      </div>
    )
  }
}

export default ReadOnlyFloatTile
