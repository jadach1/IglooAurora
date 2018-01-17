import React, { Component } from "react"
import Toggle from "material-ui/Toggle"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ReadWriteBooleanTile extends Component {
  render() {
    return (
      <div className="readWriteBooleanTile">
        <Toggle
          className="switch"
          thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
          trackSwitchedStyle={{ backgroundColor: "#93ceff" }}
          rippleStyle={{ color: "#0083ff" }}
          toggled={this.props.value}
          onToggle={(e, isInputChecked) => {
            this.props.mutate({
              variables: {
                id: this.props.id,
                value: isInputChecked,
              },
              optimisticResponse: {
                __typename: "Mutation",
                booleanValue: {
                  __typename: "BooleanValue",
                  id: this.props.id,
                  value: isInputChecked,
                },
              },
            })
          }}
        />
      </div>
    )
  }
}

const updateBooleanValue = gql`
  mutation booleanValue($id: ID!, $value: Boolean!) {
    booleanValue(id: $id, value: $value) {
      id
      value
    }
  }
`

export default graphql(updateBooleanValue)(ReadWriteBooleanTile)
