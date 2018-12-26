import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import InputAdornment from "@material-ui/core/InputAdornment"
import TextField from "@material-ui/core/TextField"

class ReadWriteBoundedStringTile extends Component {
  state = { value: this.props.stringValue }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stringValue !== this.state.text) {
      this.setState({ value: nextProps.stringValue })
    }
  }

  handleChange = event => {
    this.props.mutate({
      variables: {
        id: this.props.id,
        stringValue: this.state.value,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stringValue: {
          __typename: "StringValue",
          id: this.props.id,
          stringValue: this.state.value,
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
          if (event.target.value.length<=this.props.maxChars){
          this.setState({
            value: event.target.value,
          })
          this.handleChange(event.target.value)}}
        }
        style={{
          width: "calc(100% - 48px)",
          margin: "calc(50% - 64px) 24px",
        }}
        InputProps={{
          endAdornment:
            <InputAdornment position="end" className="notSelectable defaultCursor">
              {this.state.value.length+"/"+this.props.maxChars}
            </InputAdornment>
        }}
      />
    )
  }
}

const updateStringValue = gql`
  mutation stringValue($id: ID!, $stringValue: String!) {
    stringValue(id: $id, value: $stringValue) {
      id
      value
    }
  }
`

export default graphql(updateStringValue)(ReadWriteBoundedStringTile)
