import React, { Component } from "react"
import Input, { InputLabel } from "material-ui-next/Input"
import { MenuItem } from "material-ui-next/Menu"
import { FormControl, FormHelperText } from "material-ui-next/Form"
import Select from "material-ui-next/Select"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

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
    return (
      <div className="readWriteBooleanTile">
        <FormControl>
          <InputLabel>{this.props.customName}</InputLabel>
          <Select value={this.props.stringValue} onChange={this.handleChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.props.values.map(value => (
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
