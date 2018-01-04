import React, { Component } from "react"
import { ChromePicker } from "react-color"

class ReadWriteColourTile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
    }
  }

  render() {
    return (
      <div className="readWriteColourTile">
        <ChromePicker
          color={this.state.value}
          disableAlpha={true}
          className="colourPicker"
        />
      </div>
    )
  }
}

export default ReadWriteColourTile
