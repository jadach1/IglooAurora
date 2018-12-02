import React from "react"
import Button from "@material-ui/core/Button"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"

const MOBILE_WIDTH = 600

let oldName = ""

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class RenameTileDialog extends React.Component {
  state = { tileName: null }

  rename = () => {
    this.props[
      this.props.value.__typename === "FloatValue"
        ? "RenameFloatValue"
        : this.props.value.__typename === "StringValue"
        ? "RenameStringValue"
        : this.props.value.__typename === "PlotValue"
        ? "RenamePlotValue"
        : this.props.value.__typename === "StringPlotValue"
        ? "RenameStringPlotValue"
        : this.props.value.__typename === "MapValue"
        ? "RenameMapValue"
        : "RenameBooleanValue"
    ]({
      variables: {
        id: this.props.value.id,
        customName: this.state.tileName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        [this.props.value.__typename === "FloatValue"
          ? "floatValue"
          : this.props.value.__typename === "StringValue"
          ? "stringValue"
          : this.props.value.__typename === "PlotValue"
          ? "plotValue"
          : this.props.value.__typename === "StringPlotValue"
          ? "stringPlotValue"
          : this.props.value.__typename === "MapValue"
          ? "mapValue"
          : "booleanValue"]: {
          __typename: this.props.value.__typename,
          id: this.props.value.id,
          customName: this.state.tileName,
        },
      },
    })
    this.props.handleRenameTileDialogClose()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.renameTileOpen && !this.props.renameTileOpen) {
      oldName = this.props.tileName
      this.setState({ tileName: this.props.tileName })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.renameTileOpen}
        onClose={this.props.handleRenameTileDialogClose}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle style={{ width: "350px" }}>Rename card</DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          <FormControl style={{ width: "100%" }}>
            <Input
              id="adornment-email-login"
              placeholder="Card name"
              value={this.state.tileName}
              onChange={event => {
                this.setState({
                  tileName: event.target.value,
                })
              }}
              onKeyPress={event => {
                if (event.key === "Enter") this.rename()
              }}
              endAdornment={
                this.state.tileName ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        this.setState({ tileName: "" })
                      }}
                      onMouseDown={event => {
                        event.preventDefault()
                      }}
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                      tabIndex="-1"
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>
        </div>
        <DialogActions>
          <Button
            onClick={this.props.handleRenameTileDialogClose}
            style={{ marginRight: "4px" }}
          >
            Never mind
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.rename}
            disabled={!this.state.tileName || oldName === this.state.tileName}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation Rename($id: ID!, $customName: String) {
      floatValue(id: $id, customName: $customName) {
        id
        customName
      }
    }
  `,
  {
    name: "RenameFloatValue",
  }
)(
  graphql(
    gql`
      mutation Rename($id: ID!, $customName: String) {
        stringValue(id: $id, customName: $customName) {
          id
          customName
        }
      }
    `,
    {
      name: "RenameStringValue",
    }
  )(
    graphql(
      gql`
        mutation Rename($id: ID!, $customName: String) {
          booleanValue(id: $id, customName: $customName) {
            id
            customName
          }
        }
      `,
      {
        name: "RenameBooleanValue",
      }
    )(
      graphql(
        gql`
          mutation Rename($id: ID!, $customName: String) {
            plotValue(id: $id, customName: $customName) {
              id
              customName
            }
          }
        `,
        {
          name: "RenamePlotValue",
        }
      )(
        graphql(
          gql`
            mutation Rename($id: ID!, $customName: String) {
              stringPlotValue(id: $id, customName: $customName) {
                id
                customName
              }
            }
          `,
          {
            name: "RenameStringPlotValue",
          }
        )(
          graphql(
            gql`
              mutation Rename($id: ID!, $customName: String) {
                mapValue(id: $id, customName: $customName) {
                  id
                  customName
                }
              }
            `,
            {
              name: "RenameMapValue",
            }
          )(RenameTileDialog)
        )
      )
    )
  )
)
