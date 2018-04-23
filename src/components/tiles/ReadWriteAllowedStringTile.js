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
        value: this.state.selectedValue,
      },
      optimisticResponse: {
        __typename: "Mutation",
        floatValue: {
          __typename: "StringValue",
          id: this.props.id,
          value: this.state.selectedValue,
        },
      },
    })
  }

  render() {
    return (
      <div className="readWriteBooleanTile">
        <FormControl>
          <InputLabel>{this.props.customName}</InputLabel>
          <Select value={this.state.selectedValue} onChange={this.handleChange}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.props.value.map(value => (
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
    stringValue(id: $id, value: $value) {
      id
      value
    }
  }
`

export default graphql(updateStringValue)(ReadWriteAllowedStringTile)
