import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"

class ReadWriteAllowedStringTile extends Component {
  constructor(props){
    super(props)
  this.state = { selectedValue: props.stringValue }
  }

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
       <TextField
          value={this.state.selectedValue}
          onChange={event => {
            this.setState({
              selectedValue: event.target.value,
            })
          }}
          variant="outlined"
          select
          required
                  style={{
          width: "calc(100% - 48px)",
          margin: "calc(50% - 64px) 24px",
        }}
          InputLabelProps={this.state.selectedValue && { shrink: true }}
          disabled={menuItems.length < 1}
        >
            { noneAllowed && <MenuItem value="">
                <em>None</em>
              </MenuItem>}
          { menuItems
            .map(item => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
        </TextField>
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
