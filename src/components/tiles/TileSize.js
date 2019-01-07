import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import RadioGroup from "@material-ui/core/RadioGroup"
import Radio from "@material-ui/core/Radio"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import withMobileDialog from "@material-ui/core/withMobileDialog"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class TileSize extends Component {
  state = {
    radioValue: this.props.value.tileSize,
  }

  render() {
    const updateTileMutation = size => {
      this.props.ChangeSize({
        variables: {
          id: this.props.value.id,
          size,
        },
        optimisticResponse: {
          __typename: "Mutation",
          value: {
            __typename: "Value",
            id: this.props.value.id,
            tileSize: size,
          },
        },
      })
    }

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Change card size</DialogTitle>
        <div style={{ height: "100%" }}>
          <RadioGroup
            onChange={(event, value) => {this.setState({ radioValue: value })
              updateTileMutation(value)
          }}
            value={this.state.radioValue}
            style={{ paddingLeft: "24px", paddingRight: "24px" }}
          >
            <FormControlLabel
              value="NORMAL"
              control={<Radio color="primary" />}
              label="Normal"
            />
            <FormControlLabel
              value="WIDE"
              control={<Radio color="primary" />}
              label="Wide"
            />
            {!(
              this.props.value.__typename === "FloatValue" &&
              this.props.value.permission === "READ_ONLY"
            ) && (
              <FormControlLabel
                value="LARGE"
                control={<Radio color="primary" />}
                label="Large"
              />
            )}
          </RadioGroup>
        </div>
        <DialogActions>
          <Button onClick={this.props.close} >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeSize(
      $id: ID!
      $size: TileSize
      $visibility: ValueVisibility
    ) {
      value(tileSize: $size, id: $id, visibility: $visibility) {
        id
        visibility
        tileSize
      }
    }
  `,
  {
    name: "ChangeSize",
  }
)(withMobileDialog({ breakpoint: "xs" })(TileSize))