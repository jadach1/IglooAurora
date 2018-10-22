import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Input from "@material-ui/core/Input"
import InputLabel from "@material-ui/core/InputLabel"
import InputAdornment from "@material-ui/core/InputAdornment"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"; import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import FormControl from "@material-ui/core/FormControl"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class ReadWriteBoundedStringTile extends Component {
  state = { text: this.props.stringValue }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stringValue !== this.state.text) {
      this.setState({ text: nextProps.stringValue })
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
    const charCount = this.state.text || 0

    return (
      <div className="readOnlyFloatTile notSelectable">
        <MuiThemeProvider theme={theme}>
          <FormControl>
            <InputLabel>{this.props.customName}</InputLabel>
            <Input
              value={this.state.text}
              onChange={this.handleChange}
              endAdornment={
                <InputAdornment style={{ cursor: "default" }}>
                  {charCount.length}/{this.props.maxChars}
                </InputAdornment>
              }
            />
          </FormControl>
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

export default graphql(updateStringValue)(ReadWriteBoundedStringTile)
