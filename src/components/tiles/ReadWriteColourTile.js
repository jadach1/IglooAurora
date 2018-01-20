import React, { Component } from "react"
import { ChromePicker } from "react-color"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ReadWriteColourTile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value,
    }
  }

  render() {
    return (
      <div className="readWriteColourTile notSelectable">
        <ChromePicker
          color={this.state.value}
          disableAlpha={true}
          className="colourPicker"
          onChange={({ hex }) => this.setState({ value: hex })}
          onChangeComplete={({ hex }) => {
            this.props.mutate({
              variables: {
                id: this.props.id,
                value: hex,
              },
              optimisticResponse: {
                __typename: "Mutation",
                colourValue: {
                  __typename: "ColourValue",
                  id: this.props.id,
                  value: hex,
                },
              },
            })
          }}
        />
      </div>
    )
  }
}

const updateColourValue = gql`
  mutation colourValue($id: ID!, $value: String!) {
    colourValue(id: $id, value: $value) {
      id
      value
    }
  }
`

export default graphql(updateColourValue)(ReadWriteColourTile)
