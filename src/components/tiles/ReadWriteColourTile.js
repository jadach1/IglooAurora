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
          onChange={({ hex }) => this.setState({ value: hex })}
          onChangeComplete={({ hex }) => {
            /* use this to trigger mutation*/
          }}
        />
      </div>
    )
  }
}

export default ReadWriteColourTile
