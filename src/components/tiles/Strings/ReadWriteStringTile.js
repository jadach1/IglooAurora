import React, { Component } from "react"
import TextField from "@material-ui/core/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ReadWriteStringTile extends Component {
  state = { text: this.props.stringValue }

  componentDidMount() {
    this.setState({ text: this.props.value })
  }

  handleChange = event => {
    const newValue = event.target.value

    this.setState({
      text: newValue,
    })

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
      <div className="readWriteStringTile notSelectable">
        <TextField
          label={this.props.name}
          value={this.state.text}
          onChange={this.handleChange}
        />
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

export default graphql(updateStringValue)(ReadWriteStringTile)
