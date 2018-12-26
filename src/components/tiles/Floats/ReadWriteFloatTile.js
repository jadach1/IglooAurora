import React, { Component } from "react"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class ReadWriteFloatTile extends Component {
  constructor(props){
    super(props)
  this.state = { value: props.defaultValue || "" }
  }

  mutateFloatValue = value => {
      this.props.floatValue({
        variables: {
          id: this.props.id,
          value: parseFloat(value)
          ,
        },
        optimisticResponse: {
          __typename: "Mutation",
          device: {
            id: this.props.id,
            value: parseFloat(value),
            __typename: "FloatValue",
          },
        },
      })
    }

  render() {
    return (
      <TextField
        id="read-write-float-tile"
        type="number"
        value={this.state.value}
        variant="outlined"
        onChange={event =>{
          this.setState({
            value: event.target.value,
          })
this.mutateFloatValue(event.target.value)
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

export default graphql(gql`
mutation floatValue($id: ID!, $value: Float!) {
  floatValue(id: $id, value: $value) {
    id
    value
  }
}
`,
  {
    name: "floatValue",
  })(ReadWriteFloatTile)
