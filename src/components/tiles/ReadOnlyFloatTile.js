import React, { Component } from "react"

class ReadOnlyFloatTile extends Component {
  render() {
    return (
      <div className="readOnlyFloatTile notSelectable">
        <div className="number">
          {this.props.value}{" "}
          <font className="details"> {this.props.valueDetails}</font>
        </div>
      </div>
    )
  }
}

export default ReadOnlyFloatTile
