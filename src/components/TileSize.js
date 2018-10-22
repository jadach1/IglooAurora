import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Icon from "@material-ui/core/Icon"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { RadioButton, RadioButtonGroup } from "material-ui"

const MOBILE_WIDTH = 500

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
            : this.props.value.__typename === "ColourValue"
              ? "ChangeColourSize"
              : this.props.value.__typename === "PlotValue"
                ? "ChangePlotSize"
                : this.props.value.__typename === "StringValue"
                  ? "ChangeStringPlotSize"
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
              : this.props.value.__typename === "colourValue"
                ? "colourValue"
                : this.props.value.__typename === "plotValue"
                  ? "plotValue"
                  : this.props.value.__typename === "stringPlotValue"
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
      >
        <DialogTitle style={{ width: "300px" }}>Change card size</DialogTitle>
        <div style={{ paddingLeft: "24px" }}>Role</div>
        <RadioButtonGroup
          name="role"
          onChange={(event, value) => this.setState({ radioValue: value })}
          valueSelected={this.state.radioValue}
          style={{
            height: "100%",
          }}
        >
          <RadioButton
            value="NORMAL"
            label="Normal"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="WIDE"
            label="Wide"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="TALL"
            label="Tall"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
          <RadioButton
            value="LARGE"
            label="Large"
            style={{
              marginTop: 12,
              marginBottom: 16,
              paddingLeft: 24,
              width: "calc(100% - 24px)",
            }}
            rippleStyle={{ color: "#0083ff" }}
            checkedIcon={
              <Icon style={{ color: "#0083ff" }}>radio_button_checked</Icon>
            }
            uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
          />
        </RadioButtonGroup>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#0083ff" },
              },
            })}
          >
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              onClick={() => {
                updateTileMutation(this.state.radioValue)
                this.props.close()
              }}
            >
              Change size
            </Button>
          </MuiThemeProvider>
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
            colourValue(tileSize: $size, id: $id, visibility: $visibility) {
              id
              visibility
              tileSize
            }
          }
        `,
        {
          name: "ChangeColourSize",
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
                  stringPlotValue(
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
                name: "ChangeStringPlotSize",
              }
            )(TileSize)
          )
        )
      )
    )
  )
)
