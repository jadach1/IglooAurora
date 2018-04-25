import React, { Component } from "react"

class ReadOnlyStringTile extends Component {
  render() {
    return (
      <div className="readOnlyFloatTile">
        <div className="number">{this.props.value}</div>
      </div>
    )
  }
}

export default ReadOnlyStringTile
