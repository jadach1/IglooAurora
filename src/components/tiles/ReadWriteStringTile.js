import React, { Component } from "react"
import TextField from "material-ui-next/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class ReadWriteStringTile extends Component {
  state = { text: this.props.stringValue }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.state.text) {
      this.setState({ text: nextProps.defaultValue })
    }
  }

  handleChange = event => {
    this.setState({
      text: event.target.value,
    })

    this.props.mutate({
      variables: {
        id: this.props.id,
        stringValue: this.state.text,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stringValue: {
          __typename: "StringValue",
          id: this.props.id,
          stringValue: this.state.text,
        },
      },
    })
  }

  render() {
    return (
      <div className="readOnlyFloatTile notSelectable">
        <MuiThemeProvider theme={theme}>
          <TextField
            label={this.props.customName}
            value={this.state.text}
            onChange={this.handleChange}
          />
        </MuiThemeProvider>
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

export default graphql(updateStringValue)(ReadWriteStringTile)
