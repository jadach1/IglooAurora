import React, { Component } from "react"

class ReadOnlyFloatTile extends Component {
  render() {
    return (
      <div className="readOnlyFloatTile">
        <div className="number">{this.props.value}</div>
      </div>
    )
  }
}

export default ReadOnlyFloatTile
