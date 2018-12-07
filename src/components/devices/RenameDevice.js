import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Icon from "@material-ui/core/Icon"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

let oldName = ""

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class RenameDevice extends React.Component {
  state = { name: "" }

  rename = () => {
    this.props["Rename"]({
      variables: {
        id: this.props.device.id,
        name: this.state.name,
      },
      optimisticResponse: {
        __typename: "Mutation",
        device: {
          __typename: this.props.device.__typename,
          id: this.props.device.id,
          name: this.state.name,
        },
      },
    })
    this.props.close()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      oldName = this.props.device.name
      this.setState({ name: this.props.device.name })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        className="notSelectable defaultCursor"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Rename device</DialogTitle>
        <div style={{ height: "100%" }}>
          <FormControl
            style={{
              width: "calc(100% - 48px)",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <Input
              id="adornment-name-login"
              placeholder="Board Name"
              value={this.state.name}
              onChange={event =>
                this.setState({
                  name: event.target.value,
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter") this.rename()
              }}
              endAdornment={
                this.state.name ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ name: "" })}
                      onMouseDown={this.handleMouseDownPassword}
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>
        </div>
        <br />
        <DialogActions>
          <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
            Never mind
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.rename}
            disabled={
              !this.state.name || oldName === this.state.name
            }
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
    mutation Rename($id: ID!, $name: String) {
      device(id: $id, name: $name) {
        id
        name
      }
    }
  `,
  {
    name: "Rename",
  }
)(RenameDevice)
