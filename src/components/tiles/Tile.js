import React, { Component } from "react"
import Paper from "material-ui/Paper"
import IconButton from "material-ui/IconButton"
import ReadOnlyBooleanTile from "./ReadOnlyBooleanTile"
import ReadWriteBooleanTile from "./ReadWriteBooleanTile"
import ReadWriteBoundedFloatTile from "./ReadWriteBoundedFloatTile"
import ReadOnlyBoundedFloatTile from "./ReadOnlyBoundedFloatTile"
import ReadOnlyColourTile from "./ReadOnlyColourTile"
import ReadWriteColourTile from "./ReadWriteColourTile"
import ReadOnlyFloatTile from "./ReadOnlyFloatTile"
import FullScreenTile from "./FullScreenTile"
import Popover from "material-ui/Popover"
import Menu from "material-ui/Menu"
import MenuItem from "material-ui/MenuItem"
import IconMenu from "material-ui/IconMenu"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ArrowDropRight from "material-ui/svg-icons/navigation-arrow-drop-right"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import { List, ListItem } from "material-ui/List"
import Toggle from "material-ui/Toggle"
import Subheader from "material-ui/Subheader"
import DropDownMenu from "material-ui/DropDownMenu"
import { Tabs, Tab } from "material-ui/Tabs"
import SwipeableViews from "react-swipeable-views"
import FontIcon from "material-ui/FontIcon"
import TileSettings from "./TileSettings"

const listStyles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}

class Tile extends Component {
  state = {
    isTileFullScreen: false,
    open: false,
    value: 1,
    slideIndex: 0,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleClick = event => {
    // This prevents ghost click.
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    const { value } = this.props
    const valueTitle = value.customName
    const valueHidden = value.relevance === "HIDDEN"

    let specificTile
    let specificInterfaceSettings
    let specificDataSettings
    if (
      value.__typename === "BooleanValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyBooleanTile value={value.boolValue} />
    } else if (
      value.__typename === "BooleanValue" &&
      value.permission === "READ_WRITE"
    ) {
      specificTile = (
        <ReadWriteBooleanTile value={value.boolValue} id={value.id} />
      )
    } else if (
      value.__typename === "FloatValue" &&
      value.boundaries &&
      value.permission === "READ_WRITE"
    ) {
      specificTile = (
        <ReadWriteBoundedFloatTile
          id={value.id}
          min={value.boundaries[0]}
          max={value.boundaries[1]}
          defaultValue={value.floatValue}
          step={value.precision || undefined} // avoid passing null, pass undefined instead
          disabled={value.permission === "READ_ONLY"}
        />
      )
    } else if (
      value.__typename === "FloatValue" &&
      value.boundaries &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = (
        <ReadOnlyBoundedFloatTile
          id={value.id}
          min={value.boundaries[0]}
          max={value.boundaries[1]}
          defaultValue={value.floatValue}
          step={value.precision || undefined} // avoid passing null, pass undefined instead
        />
      )
      specificInterfaceSettings = (
        <div style={listStyles.root}>
          <List style={{ width: "100%" }}>
            <Subheader>Visualization</Subheader>
            <ListItem
              primaryText="Default control"
              secondaryText="Choose how the data is visualized"
            >
              <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                style={{
                  width: "150px",
                }}
              >
                <MenuItem value={1} primaryText="Number" />
                <MenuItem value={2} primaryText="Gauge" />
                <MenuItem value={3} primaryText="Graph" />
              </DropDownMenu>
            </ListItem>
          </List>
        </div>
      )
    } else if (
      value.__typename === "FloatValue" &&
      !value.boundaries &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyFloatTile value={value.floatValue} />
      specificInterfaceSettings = (
        <div style={listStyles.root}>
          <List style={{ width: "100%" }}>
            <Subheader>Visualization</Subheader>
            <ListItem
              primaryText="Default control"
              secondaryText="Choose how the data is visualized"
            >
              <DropDownMenu
                value={this.state.value}
                onChange={this.handleChange}
                style={{
                  width: "150px",
                }}
              >
                <MenuItem value={1} primaryText="Number" />
                <MenuItem value={2} primaryText="Graph" />
              </DropDownMenu>
            </ListItem>
          </List>
        </div>
      )
    } else if (
      value.__typename === "ColourValue" &&
      value.permission === "READ_ONLY"
    ) {
      specificTile = <ReadOnlyColourTile colour={value.colourValue} />
      specificInterfaceSettings = (
        <div style={listStyles.root}>
          <List style={{ width: "100%" }}>
            <Subheader>Visualization</Subheader>
            <ListItem
              primaryText="Show advanced options for the color picker"
              secondaryText="Show RGB, HEX and HSL color codes"
              rightToggle={
                <Toggle
                  thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                  trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                  rippleStyle={{ color: "#0083ff" }}
                />
              }
            />
          </List>
        </div>
      )
    } else if (
      value.__typename === "ColourValue" &&
      value.permission === "READ_WRITE"
    ) {
      specificTile = (
        <ReadWriteColourTile value={value.colourValue} id={value.id} />
      )
      specificInterfaceSettings = (
        <div style={listStyles.root}>
          <List style={{ width: "100%" }}>
            <Subheader>Visualization</Subheader>
            <ListItem
              primaryText="Show advanced options for the color picker"
              secondaryText="Show RGB, HEX and HSL color codes"
              rightToggle={
                <Toggle
                  thumbSwitchedStyle={{ backgroundColor: "#0083ff" }}
                  trackSwitchedStyle={{ backgroundColor: "#71c4ff" }}
                  rippleStyle={{ color: "#0083ff" }}
                />
              }
            />
          </List>
        </div>
      )
    } else {
      specificTile = ""
    }

    const updateTileMutation = size => () =>
      this.props[
        value.__typename === "FloatValue"
          ? "ChangeFloatSize"
          : value.__typename === "StringValue"
            ? "ChangeStringSize"
            : value.__typename === "ColourValue"
              ? "ChangeColourSize"
              : "ChangeBooleanSize"
      ]({
        variables: {
          id: value.id,
          size,
        },
        optimisticResponse: {
          __typename: "Mutation",
          [value.__typename === "FloatValue"
            ? "floatValue"
            : value.__typename === "StringValue"
              ? "stringValue"
              : value.__typename === "ColourValue"
                ? "colourValue"
                : "booleanValue"]: {
            __typename: value.__typename,
            id: value.id,
            tileSize: size,
          },
        },
      })

    const updateShown = visible => () =>
      this.props[
        value.__typename === "FloatValue"
          ? "ChangeFloatSize"
          : value.__typename === "StringValue"
            ? "ChangeStringSize"
            : value.__typename === "ColourValue"
              ? "ChangeColourSize"
              : "ChangeBooleanSize"
      ]({
        variables: {
          id: value.id,
          relevance: visible ? "VISIBLE" : "HIDDEN",
        },
        optimisticResponse: {
          __typename: "Mutation",
          [value.__typename === "FloatValue"
            ? "floatValue"
            : value.__typename === "StringValue"
              ? "stringValue"
              : value.__typename === "ColourValue"
                ? "colourValue"
                : "booleanValue"]: {
            __typename: value.__typename,
            id: value.id,
            relevance: visible ? "VISIBLE" : "HIDDEN",
          },
        },
      })

    return (
      <React.Fragment>
        <Paper className={value.tileSize.toLowerCase()} zDepth={2}>
          <FullScreenTile
            fullScreen={this.state.isTileFullScreen}
            handleClose={() => {
              this.setState({ isTileFullScreen: false })
            }}
            value={value}
            specificTile={specificTile}
          />
          <div className="tileHeader">
            <div className="tileTitle" title={valueTitle}>
              {valueTitle}
            </div>
            <div className="tileHeaderButtons notSelectable">
              <IconButton
                tooltip="Expand"
                onClick={() => {
                  this.setState({ isTileFullScreen: true })
                }}
                style={{
                  padding: "0",
                  width: "30px",
                  height: "30px",
                  marginTop: "13px",
                  marginBottom: "13px",
                }}
              >
                <i className="material-icons">fullscreen</i>
              </IconButton>
              <IconMenu
                style={{
                  padding: "0",
                  width: "30px",
                  height: "30px",
                  marginTop: "13px",
                  marginBottom: "13px",
                }}
                iconButtonElement={
                  <IconButton
                    style={{
                      padding: "0",
                      width: "30px",
                      height: "30px",
                    }}
                    tooltip="More"
                  >
                    <i className="material-icons">more_vert</i>
                  </IconButton>
                }
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                targetOrigin={{ horizontal: "right", vertical: "top" }}
              >
                <MenuItem
                  primaryText={value.relevance === "VISIBLE" ? "Hide" : "Show"}
                  onClick={
                    value.relevance === "VISIBLE"
                      ? updateShown(false)
                      : updateShown(true)
                  }
                />
                <MenuItem
                  primaryText="Resize"
                  rightIcon={<ArrowDropRight />}
                  menuItems={[
                    <MenuItem
                      primaryText="Small"
                      onClick={updateTileMutation("NORMAL")}
                    />,
                    <MenuItem
                      primaryText="Wide"
                      onClick={updateTileMutation("WIDE")}
                    />,
                    <MenuItem
                      primaryText="Tall"
                      onClick={updateTileMutation("TALL")}
                    />,
                    <MenuItem
                      primaryText="Large"
                      onClick={updateTileMutation("LARGE")}
                    />,
                  ]}
                />
                <MenuItem primaryText="Settings" onClick={this.handleOpen} />
              </IconMenu>
            </div>
          </div>
          {specificTile}
        </Paper>
        <TileSettings
          interface={specificInterfaceSettings}
          data={specificDataSettings}
          isOpen={this.state.open}
          handleClose={this.handleClose}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeSize($id: ID!, $size: TileSize, $relevance: ValueRelevance) {
      floatValue(tileSize: $size, id: $id, relevance: $relevance) {
        id
        relevance
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
        $relevance: ValueRelevance
      ) {
        stringValue(tileSize: $size, id: $id, relevance: $relevance) {
          id
          tileSize
          relevance
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
          $relevance: ValueRelevance
        ) {
          booleanValue(tileSize: $size, id: $id, relevance: $relevance) {
            id
            relevance
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
            $relevance: ValueRelevance
          ) {
            colourValue(tileSize: $size, id: $id, relevance: $relevance) {
              id
              relevance
              tileSize
            }
          }
        `,
        {
          name: "ChangeColourSize",
        }
      )(Tile)
    )
  )
)
