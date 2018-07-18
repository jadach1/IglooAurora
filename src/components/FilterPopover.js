import React, { Component } from "react"
import Popover from "material-ui-next/Popover"
import List, { ListItem, ListItemText } from "material-ui-next/List"
import Checkbox from "material-ui-next/Checkbox"
import Typography from "material-ui-next/Typography"
import Toolbar from "material-ui-next/Toolbar"

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

export default class FilterPopover extends Component {
  state = {
    checked: removeDuplicates(
      this.props.devices.map(device => device.deviceType)
    ),
  }

  handleToggle = value => () => {
    const { checked } = this.state
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    this.props.setVisibleTypes(newChecked)

    this.setState({
      checked: newChecked,
    })
  }

  componentDidMount() {
    this.props.setVisibleTypes(this.state.checked)
  }

  render() {
    let deviceTypeList = this.props.devices.map(device => device.deviceType)

    let uniqueDeviceTypeList = removeDuplicates(deviceTypeList)

    var occurrences = {}
    for (var i = 0, j = deviceTypeList.length; i < j; i++) {
      occurrences[deviceTypeList[i]] = (occurrences[deviceTypeList[i]] || 0) + 1
    }

    return (
      <Popover
        open={this.props.open}
        onClose={this.props.close}
        anchorEl={this.props.anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        className="notSelectable"
      >
        <Toolbar style={{ height: "64px" }}>
          <Typography
            variant="title"
            className="defaultCursor"
            style={{
              marginLeft: "-8px",
            }}
          >
            Filter by device type
          </Typography>
        </Toolbar>
        <List style={{ width: "256px", padding: "0" }}>
          {uniqueDeviceTypeList.map(deviceType => (
            <ListItem
              key={deviceType}
              role={undefined}
              button
              onClick={this.handleToggle(deviceType)}
            >
              <Checkbox
                checked={this.state.checked.indexOf(deviceType) !== -1}
                tabIndex={-1}
                disableRipple
                onChange={this.handleToggle(deviceType)}
              />
              <ListItemText
                primary={deviceType}
                secondary={
                  occurrences[deviceType] +
                  (occurrences[deviceType] === 1 ? " device" : " devices")
                }
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    )
  }
}
