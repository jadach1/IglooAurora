import React, { Component } from "react"
import Slider from "material-ui/Slider"

class ReadOnlyBooleanTile extends Component {
  constructor(props) {
    super()
    this.state = {
      value: props.defaultValue,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.state.value) {
      this.setState({ value: nextProps.defaultValue })
    }
  }

  render() {
    return (
      <div className="readWriteBoundedFloatTile">
        <div className="min">{this.props.min}</div>
        <Slider
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
          className="slider"
          sliderStyle={{ marginTop: "0", marginBottom: "0" }}
          onChange={(e, newValue) => this.setState({ value: newValue })}
          onDragStop={() => {
            /* use this even to trigger the mutation */
          }}
          disabled={this.props.disabled}
        />
        <div className="max">{this.props.max}</div>
        <input
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
          onChange={e => this.setState({ value: parseFloat(e.target.value) })}
          className="number"
          type="number"
          disabled={this.props.disabled}
        />
      </div>
    )
  }
}

export default ReadOnlyBooleanTile
