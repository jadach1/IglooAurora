import React from "react"
import Popover from "material-ui/Popover"
import Menu from "material-ui/Menu"
import MenuItem from "material-ui/MenuItem"
import IconButton from "material-ui/IconButton"

export default class NotificationsPopover extends React.Component {
  render() {
    return (
      <Popover
        open={this.props.open}
        anchorEl={this.props.anchorEl}
        anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
        targetOrigin={{ horizontal: "middle", vertical: "top" }}
        onRequestClose={this.props.handleRequestClose}
        style={{ width: "300px" }}
      >
        <IconButton tooltip="Clear all">
          <i className="material-icons">clear_all</i>
        </IconButton>
        {this.props.areThereNotifications ? (
          <Menu />
        ) : (
          <div>
            <br /> No new notifications
          </div>
        )}
      </Popover>
    )
  }
}
