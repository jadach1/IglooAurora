import React, { Component } from "react"
import { ChromePicker } from "react-color"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ColorPicker from "coloreact"

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
        <ColorPicker
          className="colourPicker"
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            paddingLeft: "1.3em",
          }}
          color="#408fa3"
          onChange={color => console.log("single-example color:", color.hex)}
        />
        {/* <ChromePicker
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
        /> */}
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
