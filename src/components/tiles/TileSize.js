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

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class TileSize extends Component {
  state = {
    radioValue: this.props.value.tileSize,
  }

  render() {
    const updateTileMutation = size => {
      this.props[
        this.props.value.__typename === "FloatValue"
          ? "ChangeFloatSize"
          : this.props.value.__typename === "StringValue"
          ? "ChangeStringSize"
          : this.props.value.__typename === "PlotValue"
          ? "ChangePlotSize"
          : this.props.value.__typename === "StringValue"
          ? "ChangeCategoryPlotSize"
          : this.props.value.__typename === "MapValue"
          ? "ChangeMapSize"
          : "ChangeBooleanSize"
      ]({
        variables: {
          id: this.props.value.id,
          size,
        },
        optimisticResponse: {
          __typename: "Mutation",
          [this.props.value.__typename === "floatValue"
            ? "floatValue"
            : this.props.value.__typename === "stringValue"
            ? "stringValue"
            : this.props.value.__typename === "plotValue"
            ? "plotValue"
            : this.props.value.__typename === "categoryPlotValue"
            ? "stringValue"
            : this.props.value.__typename === "mapValue"
            ? "mapValue"
            : "booleanValue"]: {
            __typename: this.props.value.__typename,
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
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Change card size</DialogTitle>
        <div style={{ height: "100%" }}>
          {" "}
          <RadioGroup
            onChange={(event, value) => this.setState({ radioValue: value })}
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
          <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
            Never mind
          </Button>
          <Button
            variant="contained"
            color="primary"
            primary={true}
            onClick={() => {
              updateTileMutation(this.state.radioValue)
              this.props.close()
            }}
          >
            Change size
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
      floatValue(tileSize: $size, id: $id, visibility: $visibility) {
        id
        visibility
        tileSize
      }
    }
  `,
  {
    name: "ChangeFloatSize",
  }
)(
  graphql(
    gql`
      mutation ChangeSize(
        $id: ID!
        $size: TileSize
        $visibility: ValueVisibility
      ) {
        stringValue(tileSize: $size, id: $id, visibility: $visibility) {
          id
          tileSize
          visibility
        }
      }
    `,
    {
      name: "ChangeStringSize",
    }
  )(
    graphql(
      gql`
        mutation ChangeSize(
          $id: ID!
          $size: TileSize
          $visibility: ValueVisibility
        ) {
          booleanValue(tileSize: $size, id: $id, visibility: $visibility) {
            id
            visibility
            tileSize
          }
        }
      `,
      {
        name: "ChangeBooleanSize",
      }
    )(
      graphql(
        gql`
          mutation ChangeSize(
            $id: ID!
            $size: TileSize
            $visibility: ValueVisibility
          ) {
            plotValue(tileSize: $size, id: $id, visibility: $visibility) {
              id
              visibility
              tileSize
            }
          }
        `,
        {
          name: "ChangePlotSize",
        }
      )(
        graphql(
          gql`
            mutation ChangeSize(
              $id: ID!
              $size: TileSize
              $visibility: ValueVisibility
            ) {
              mapValue(tileSize: $size, id: $id, visibility: $visibility) {
                id
                visibility
                tileSize
              }
            }
          `,
          {
            name: "ChangeMapSize",
          }
        )(
          graphql(
            gql`
              mutation ChangeSize(
                $id: ID!
                $size: TileSize
                $visibility: ValueVisibility
              ) {
                categoryPlotValue(
                  tileSize: $size
                  id: $id
                  visibility: $visibility
                ) {
                  id
                  visibility
                  tileSize
                }
              }
            `,
            {
              name: "ChangeCategoryPlotSize",
            }
          )(TileSize)
        )
      )
    )
  )
)
