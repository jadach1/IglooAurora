import React from "react"
import Button from "@material-ui/core/Button"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import withMobileDialog from "@material-ui/core/withMobileDialog"

let oldName = ""

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class RenameTileDialog extends React.Component {
  state = { name: null }

  rename = () => {
    this.props.Rename({
      variables: {
        id: this.props.value.id,
        name: this.state.name,
      },
      optimisticResponse: {
        __typename: "Mutation",
        value: {
          __typename: "Value",
          id: this.props.value.id,
          name: this.state.name,
        },
      },
    })
    this.props.handleRenameTileDialogClose()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.renameTileOpen && !this.props.renameTileOpen) {
      oldName = this.props.tileName
      this.setState({ name: this.props.tileName, nameEmpty: "" })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.renameTileOpen}
        onClose={this.props.handleRenameTileDialogClose}
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Rename card</DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          <TextField
            id="rename-card"
            label="Name"
            value={this.state.name}
            variant="outlined"
            error={this.state.nameEmpty}
            helperText={this.state.nameEmpty ? "This field is required" : " "}
            onChange={event =>
              this.setState({
                name: event.target.value,
                nameEmpty: event.target.value === "",
              })
            }
            onKeyPress={event => {
              if (event.key === "Enter" && !this.state.nameEmpty) this.rename()
            }}
            style={{
              width: "100%",
            }}
            InputLabelProps={this.state.name && { shrink: true }}
            InputProps={{
              endAdornment: this.state.name && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => this.setState({ name: "", nameEmpty: true })}
                    tabIndex="-1"
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "rgba(0, 0, 0, 0.46)" }
                        : { color: "rgba(0, 0, 0, 0.46)" }
                    }
                  >
                    <Icon>clear</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
            disabled={!this.state.name || oldName === this.state.name}
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
      value(id: $id, name: $name) {
        id
        name
      }
    }
  `,
  {
    name: "Rename",
  }
)(withMobileDialog({ breakpoint: "xs" })(RenameTileDialog))
