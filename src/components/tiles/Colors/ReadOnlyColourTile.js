import React, { Component } from "react"

class ReadOnlyColourTile extends Component {
  render() {
    return (
      <div className="readOnlyColourTile">
        <div className="colourDot" style={{ background: this.props.colour }} />
      </div>
    )
  }
}

export default ReadOnlyColourTile
