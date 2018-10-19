import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Icon from "@material-ui/core/Icon"
import { RadioButtonGroup, RadioButton } from "material-ui"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class ChangeDevice extends React.Component {
  state = { newDevice: this.props.value.device.id }

  changeDevice = () => {
    this.props[
      this.props.value.__typename === "FloatValue"
        ? "ChangeDeviceFloat"
        : this.props.value.__typename === "StringValue"
          ? "ChangeDeviceString"
          : this.props.value.__typename === "ColourValue"
            ? "ChangeDeviceColour"
            : this.props.value.__typename === "PlotValue"
              ? "ChangeDevicePlot"
              : this.props.value.__typename === "StringPlotValue"
                ? "ChangeDeviceStringPlot"
                : this.props.value.__typename === "MapValue"
                  ? "ChangeDeviceMap"
                  : "ChangeDeviceBoolean"
    ]({
      variables: {
        id: this.props.value.id,
        deviceId: this.state.newDevice,
      },
      optimisticResponse: {
        __typename: "Mutation",
        [this.props.value.__typename === "FloatValue"
          ? "floatValue"
          : this.props.value.__typename === "StringValue"
            ? "stringValue"
            : this.props.value.__typename === "ColourValue"
              ? "colourValue"
              : this.props.value.__typename === "PlotValue"
                ? "plotValue"
                : this.props.value.__typename === "StringPlotValue"
                  ? "stringPlotValue"
                  : this.props.value.__typename === "MapValue"
                    ? "mapValue"
                    : "booleanValue"]: {
          __typename: this.props.value.__typename,
          id: this.props.value.id,
          deviceId: this.state.newDevice,
        },
      },
    })
    this.props.close()
  }

  render() {
    const {
      userData: { user },
    } = this.props

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle style={{ width: "350px" }}>Change device</DialogTitle>
        <div
          style={{ paddingRight: "24px", paddingLeft: "24px", height: "100%" }}
        >
          {user &&
            user.boards.filter(board => board.devices[0]).map(board => (
              <React.Fragment>
                {board.customName}
                <RadioButtonGroup
                  name="device"
                  onChange={(event, value) =>
                    this.setState({ newDevice: value })
                  }
                  valueSelected={
                    this.state.newDevice || this.props.value.device.id
                  }
                >
                  {user &&
                    user.devices
                      .filter(device => device.board.id === board.id)
                      .map(device => (
                        <RadioButton
                          value={device.id}
                          label={device.customName}
                          style={{
                            marginTop: 12,
                            marginBottom: 16,
                          }}
                          rippleStyle={{ color: "#0083ff" }}
                          checkedIcon={
                            <Icon style={{ color: "#0083ff" }}>
                              radio_button_checked
                            </Icon>
                          }
                          uncheckedIcon={<Icon>radio_button_unchecked</Icon>}
                        />
                      ))}
                </RadioButtonGroup>
              </React.Fragment>
            ))}
        </div>
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              buttonStyle={{ backgroundColor: "#0083ff" }}
              onClick={this.changeDevice}
              disabled={this.state.newDevice === this.props.value.device.id}
            >
              Change device
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeDevice($id: ID!, $deviceId: ID) {
      floatValue(id: $id, deviceId: $deviceId) {
        id
        device {
          id
        }
      }
    }
  `,
  {
    name: "ChangeDeviceFloat",
  }
)(
  graphql(
    gql`
      mutation ChangeDevice($id: ID!, $deviceId: ID) {
        stringValue(id: $id, deviceId: $deviceId) {
          id
          device {
            id
          }
        }
      }
    `,
    {
      name: "ChangeDeviceString",
    }
  )(
    graphql(
      gql`
        mutation ChangeDevice($id: ID!, $deviceId: ID) {
          mapValue(id: $id, deviceId: $deviceId) {
            id
            device {
              id
            }
          }
        }
      `,
      {
        name: "ChangeDeviceMap",
      }
    )(
      graphql(
        gql`
          mutation ChangeDevice($id: ID!, $deviceId: ID) {
            booleanValue(id: $id, deviceId: $deviceId) {
              id
              device {
                id
              }
            }
          }
        `,
        {
          name: "ChangeDeviceBoolean",
        }
      )(
        graphql(
          gql`
            mutation ChangeDevice($id: ID!, $deviceId: ID) {
              plotValue(id: $id, deviceId: $deviceId) {
                id
                device {
                  id
                }
              }
            }
          `,
          {
            name: "ChangeDevicePlot",
          }
        )(
          graphql(
            gql`
              mutation ChangeDevice($id: ID!, $deviceId: ID) {
                colourValue(id: $id, deviceId: $deviceId) {
                  id
                  device {
                    id
                  }
                }
              }
            `,
            {
              name: "ChangeDeviceColour",
            }
          )(
            graphql(
              gql`
                mutation ChangeDevice($id: ID!, $deviceId: ID) {
                  stringPlotValue(id: $id, deviceId: $deviceId) {
                    id
                    device {
                      id
                    }
                  }
                }
              `,
              {
                name: "ChangeDeviceStringPlot",
              }
            )(ChangeDevice)
          )
        )
      )
    )
  )
)
