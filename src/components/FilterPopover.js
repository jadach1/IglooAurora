import React, { Component } from "react"
import Popover from "@material-ui/core/Popover"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import Checkbox from "@material-ui/core/Checkbox"
import Typography from "@material-ui/core/Typography"
import Toolbar from "@material-ui/core/Toolbar"
import Collapse from "@material-ui/core/Collapse"
import { Redirect } from "react-router-dom"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"

let removeDuplicates = inputArray => {
  var obj = {}
  var returnArray = []
  for (var i = 0; i < inputArray.length; i++) {
    obj[inputArray[i]] = true
  }
  for (var key in obj) {
    returnArray.push(key)
  }
  return returnArray
}

let deviceTypeFirmwares = []

export default class FilterPopover extends Component {
  state = {
    checked: removeDuplicates(
      this.props.devices.map(device => device.deviceType)
    ),
    firmwareChecked: removeDuplicates(
      this.props.devices.map(device => device.deviceType + device.firmware)
    ),
    open: [],
  }

  handleToggle = value => () => {
    const { checked } = this.state
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      if (
        this.props.currentDevice &&
        this.props.currentDevice.deviceType === newChecked[currentIndex]
      ) {
        this.setState({ redirect: true })
      }

      newChecked.splice(currentIndex, 1)
    }

    this.props.setVisibleTypes(newChecked)

    this.setState({
      checked: newChecked,
    })
  }

  handleFirmwareToggle = value => () => {
    const { firmwareChecked } = this.state
    const currentIndex = firmwareChecked.indexOf(value)
    const newFirmwareChecked = [...firmwareChecked]

    if (currentIndex === -1) {
      newFirmwareChecked.push(value)
    } else {
      newFirmwareChecked.splice(currentIndex, 1)
    }

    this.setState({
      firmwareChecked: newFirmwareChecked,
    })
  }

  handleOpen = value => () => {
    const { open } = this.state
    const currentIndex = open.indexOf(value)
    const newOpen = [...open]

    if (currentIndex === -1) {
      newOpen.push(value)
    } else {
      newOpen.splice(currentIndex, 1)
    }

    this.props.setVisibleTypes(newOpen)

    this.setState({
      open: newOpen,
    })
  }

  //fix for .lenght returning undefined
  getLenght = array => {
    let count = 0

    for (let i in array) {
      if (i) count++
    }

    return count
  }

  componentDidMount() {
    this.props.setVisibleTypes(this.state.checked)
  }

  componentWillReceiveProps(nextProps) {
    deviceTypeFirmwares = []

    nextProps.devices.forEach(device => {
      if (
        deviceTypeFirmwares.some(
          deviceTypeFirmware =>
            deviceTypeFirmware.deviceType === device.deviceType
        )
      ) {
        let currentDeviceType = deviceTypeFirmwares.filter(
          deviceTypeFirmware =>
            deviceTypeFirmware.deviceType === device.deviceType
        )[0]
        if (
          currentDeviceType.firmwares.some(
            firmware => firmware.name === device.firmware
          )
        ) {
          currentDeviceType.firmwares
            .filter(firmware => firmware.name === device.firmware)[0]
            .devices.push(device.id)
        } else {
          currentDeviceType.firmwares.push({
            name: device.firmware,
            devices: [device.id],
          })
        }
      } else {
        deviceTypeFirmwares.push({
          deviceType: device.deviceType,
          firmwares: [
            {
              name: device.firmware,
              devices: [device.id],
            },
          ],
        })
      }
    })
  }

  render() {
    let deviceTypeList = this.props.devices.map(device => device.deviceType)

    let uniqueDeviceTypeList = removeDuplicates(deviceTypeList)

    var occurrences = {}
    for (var i = 0, j = deviceTypeList.length; i < j; i++) {
      occurrences[deviceTypeList[i]] = (occurrences[deviceTypeList[i]] || 0) + 1
    }

    return (
      <React.Fragment>
        <Popover
          open={this.props.open}
          onClose={this.props.close}
          anchorEl={this.props.anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          className="notSelectable"
        >
          <Toolbar style={{ height: "64px", paddingLeft: "24px" }}>
            <Typography
              variant="h6"
              className="defaultCursor"
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      marginLeft: "-8px",
                      color: "white",
                    }
                  : {
                      marginLeft: "-8px",
                      color: "black",
                    }
              }
            >
              Filters
            </Typography>
          </Toolbar>
          <div
            style={
              96 + this.getLenght(uniqueDeviceTypeList) * 72 >
              window.innerHeight
                ? {
                    height: "calc(100vh - 96px)",
                    overflow: "auto",
                    overflowX: "hidden",
                  }
                : { overflowX: "hidden" }
            }
          >
            <List style={{ width: "256px" }}>
              {uniqueDeviceTypeList.map(deviceType => (
                <React.Fragment>
                  <ListItem
                    key={deviceType}
                    role={undefined}
                    button
                    onClick={this.handleToggle(deviceType)}
                    style={{ cursor: "pointer" }}
                  >
                    <Checkbox
                      checked={this.state.checked.indexOf(deviceType) !== -1}
                      color="secondary"
                      tabIndex={-1}
                      disableRipple
                      onChange={this.handleToggle(deviceType)}
                      indeterminate={
                        this.state.firmwareChecked
                          .filter(firmware => firmware.startsWith(deviceType))
                          .map(firmware =>
                            firmware.substring(deviceType.length)
                          )
                          .some(firmware =>
                            this.props.devices
                              .filter(
                                device => device.deviceType === deviceType
                              )
                              .map(device => device.firmware)
                              .includes(firmware)
                          )
                      }
                    />
                    <ListItemText
                      primary={
                        <span
                          style={
                            typeof Storage !== "undefined" &&
                            localStorage.getItem("nightMode") === "true"
                              ? { color: "white" }
                              : { color: "black" }
                          }
                        >
                          {deviceType}
                        </span>
                      }
                      secondary={
                        <span
                          style={
                            typeof Storage !== "undefined" &&
                            localStorage.getItem("nightMode") === "true"
                              ? { color: "#c1c2c5" }
                              : { color: "#7a7a7a" }
                          }
                        >
                          {occurrences[deviceType] +
                            (occurrences[deviceType] === 1
                              ? " device"
                              : " devices")}
                        </span>
                      }
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                      }}
                    />
                    {deviceTypeFirmwares.filter(
                      deviceTypeFirmware =>
                        deviceTypeFirmware.deviceType === deviceType
                    )[0] &&
                      deviceTypeFirmwares.filter(
                        deviceTypeFirmware =>
                          deviceTypeFirmware.deviceType === deviceType
                      )[0].firmwares[1] && (
                        <ListItemSecondaryAction>
                          <IconButton onClick={this.handleOpen(deviceType)}>
                            {this.state.open.indexOf(deviceType) !== -1 ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                  </ListItem>
                  {deviceTypeFirmwares.filter(
                    deviceTypeFirmware =>
                      deviceTypeFirmware.deviceType === deviceType
                  )[0] &&
                    deviceTypeFirmwares.filter(
                      deviceTypeFirmware =>
                        deviceTypeFirmware.deviceType === deviceType
                    )[0].firmwares[1] && (
                      <Collapse
                        in={this.state.open.indexOf(deviceType) !== -1}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          {deviceTypeFirmwares
                            .filter(
                              deviceTypeFirmware =>
                                deviceTypeFirmware.deviceType === deviceType
                            )[0]
                            .firmwares.map(firmware => (
                              <ListItem
                                key={deviceType + firmware.name}
                                role={undefined}
                                button
                                onClick={this.handleFirmwareToggle(
                                  deviceType + firmware.name
                                )}
                                style={{
                                  cursor: "pointer",
                                  paddingLeft: "32px",
                                }}
                              >
                                <Checkbox
                                  checked={
                                    this.state.firmwareChecked.indexOf(
                                      deviceType + firmware.name
                                    ) !== -1
                                  }
                                  color="secondary"
                                  tabIndex={-1}
                                  disableRipple
                                  onChange={this.handleFirmwareToggle(
                                    deviceType + firmware.name
                                  )}
                                />
                                <ListItemText
                                  primary={
                                    <span
                                      style={
                                        typeof Storage !== "undefined" &&
                                        localStorage.getItem("nightMode") ===
                                          "true"
                                          ? { color: "white" }
                                          : { color: "black" }
                                      }
                                    >
                                      {firmware.name
                                        ? firmware.name
                                        : "No firmware"}
                                    </span>
                                  }
                                  secondary={
                                    <span
                                      style={
                                        typeof Storage !== "undefined" &&
                                        localStorage.getItem("nightMode") ===
                                          "true"
                                          ? { color: "#c1c2c5" }
                                          : { color: "#7a7a7a" }
                                      }
                                    >
                                      {removeDuplicates(firmware.devices)
                                        .length +
                                        (removeDuplicates(firmware.devices)
                                          .length === 1
                                          ? " device"
                                          : " devices")}
                                    </span>
                                  }
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    cursor: "pointer",
                                  }}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </Collapse>
                    )}
                </React.Fragment>
              ))}
            </List>
          </div>
        </Popover>
        {this.state.redirect && (
          <Redirect to={"/?environment=" + this.props.environmentId} />
        )}
      </React.Fragment>
    )
  }
}
