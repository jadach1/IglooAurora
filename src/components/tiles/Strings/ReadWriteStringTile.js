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
    const newValue = event.target.value

    this.setState({
      text: newValue,
    })

    this.props.mutate({
      variables: {
        id: this.props.id,
        stringValue: newValue,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stringValue: {
          __typename: "StringValue",
          id: this.props.id,
          stringValue: newValue,
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
  mutation stringValue($id: ID!, $stringValue: String!) {
    stringValue(id: $id, value: $stringValue) {
      id
      value
    }
  }
`

export default graphql(updateStringValue)(ReadWriteStringTile)
