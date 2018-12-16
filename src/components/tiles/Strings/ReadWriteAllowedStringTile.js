import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"

class ReadWriteAllowedStringTile extends Component {
  state = { selectedValue: "" }

  handleChange = event => {
    this.setState({ selectedValue: event.target.value })

    this.props.mutate({
      variables: {
        id: this.props.id,
        stringValue: this.state.selectedValue,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stringValue: {
          __typename: "StringValue",
          id: this.props.id,
          stringValue: this.state.selectedValue,
        },
      },
    })
  }

  render() {
    let noneAllowed = false

    const menuItems = this.props.values.filter(value => {
      const allowed = value !== ""

      noneAllowed = noneAllowed || !allowed
      return allowed
    })

    return (
      <div className="readWriteBooleanTile notSelectable">
        <FormControl style={{ width: "100%" }}>
          <Select
            value={this.state.stringValue}
            onChange={this.handleChange}
            name="environment"
          >
            {noneAllowed && (
              <MenuItem value="" className="notSelectable">
                <em>None</em>
              </MenuItem>
            )}
            {menuItems.map(value => (
              <MenuItem value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }
}

const updateStringValue = gql`
  mutation stringValue($id: ID!, $value: String!) {
    stringValue(id: $id, stringValue: $stringValue) {
      id
      stringValue
    }
  }
`

export default graphql(updateStringValue)(ReadWriteAllowedStringTile)
