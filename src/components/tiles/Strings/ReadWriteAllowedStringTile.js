import React, { Component } from "react"
import { MenuItem } from "material-ui/Menu"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import DropDownMenu from "material-ui/DropDownMenu"

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
        <DropDownMenu
          value={this.props.stringValue}
          onChange={this.handleChange}
          disabled={this.state.menuDisabled}
          maxHeight={250}
          style={{ width: "300px" }}
          anchorOrigin={{ horizontal: "middle", vertical: "top" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
          className="notSelectable"
        >
          {noneAllowed && (
            <MenuItem value="" className="notSelectable">
              <em>None</em>
            </MenuItem>
          )}
          {menuItems.map(value => (
            <MenuItem
              value={value}
              style={{ width: "300px" }}
              className="notSelectable"
            >
              {value}
            </MenuItem>
          ))}
        </DropDownMenu>
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
