import React, { Component } from "react"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ReadWriteStringTile extends Component {
  constructor(props) {
    super(props)
    this.state = { value: props.value || "" }
  }

  handleChange = newValue => {
    this.props.mutate({
      variables: {
        id: this.props.id,
        value: newValue,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stringValue: {
          __typename: "StringValue",
          id: this.props.id,
          value: newValue,
        },
      },
    })
  }

  render() {
    return (
      <TextField
        id="read-write-string-tile"
        value={this.state.value}
        variant="outlined"
        onChange={event => {
          this.setState({
            value: event.target.value,
          })
          this.handleChange(event.target.value)
        }}
        style={{
          width: "calc(100% - 48px)",
          margin: "calc(50% - 64px) 24px",
        }}
        InputProps={{
          endAdornment: ( this.props.valueDetails ?
            <InputAdornment position="end" className="notSelectable defaultCursor">
              {this.props.valueDetails}
            </InputAdornment>
         : this.state.value && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => this.setState({ value: "" })}
                tabIndex="-1"
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "rgba(0, 0, 0, 0.46)" }
                    : { color: "rgba(0, 0, 0, 0.54)" }
                }
              >
                <Icon>clear</Icon>
              </IconButton>
            </InputAdornment>
          ))
        }}
      />
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

export default graphql(updateStringValue)(ReadWriteStringTile)
