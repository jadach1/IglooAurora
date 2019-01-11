import React, { Component } from "react"
import Switch from "@material-ui/core/Switch"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ReadWriteBooleanCard extends Component {
  render() {
    return (
      <div className="readWriteBooleanCard">
        <Switch
          className="switch"
          thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
          trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
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

export default graphql(updateBooleanValue)(ReadWriteBooleanCard)
