import React, { Component } from "react"
import Slider from "material-ui/Slider"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ReadOnlyBooleanTile extends Component {
  constructor(props) {
    super()
    this.state = {
      value: props.defaultValue,
    }

    this.timeout = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.state.value) {
      this.setState({ value: nextProps.defaultValue })
    }
  }

  render() {
    return (
      <div className="readWriteBoundedFloatTile notSelectable">
        <div className="min">{this.props.min}</div>
        <Slider
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
          className="slider"
          sliderStyle={{ marginTop: "0", marginBottom: "0" }}
          onChange={(e, newValue) => this.setState({ value: newValue })}
          onDragStop={e => {
            this.props.mutate({
              variables: {
                id: this.props.id,
                value: this.state.value,
              },
              optimisticResponse: {
                __typename: "Mutation",
                floatValue: {
                  __typename: "FloatValue",
                  id: this.props.id,
                  value: this.state.value,
                },
              },
            })
          }}
          disabled={true}
        />
        <div className="max">{this.props.max}</div>
        <input
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.value}
          onChange={e => {
            this.setState({ value: parseFloat(e.target.value) })
            if (this.timeout) clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              this.props.mutate({
                variables: {
                  id: this.props.id,
                  value: this.state.value,
                },
                optimisticResponse: {
                  __typename: "Mutation",
                  floatValue: {
                    __typename: "FloatValue",
                    id: this.props.id,
                    value: this.state.value,
                  },
                },
              })
            }, 100)
          }}
          className="number"
          type="number"
          disabled={this.props.disabled}
        />
      </div>
    )
  }
}

const updateFloatValue = gql`
  mutation floatValue($id: ID!, $value: Float!) {
    floatValue(id: $id, value: $value) {
      id
      value
    }
  }
`

export default graphql(updateFloatValue)(ReadOnlyBooleanTile)
