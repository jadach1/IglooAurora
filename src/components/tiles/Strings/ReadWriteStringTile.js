import React, { Component } from "react"
import TextField from "@material-ui/core/TextField"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"; import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class ReadWriteStringTile extends Component {
  state = { text: this.props.stringValue }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stringValue !== this.state.text) {
      this.setState({ text: nextProps.stringValue })
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
      <div className="readWriteStringTile notSelectable">
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
