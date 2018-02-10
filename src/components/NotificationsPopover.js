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
        style={{ width: "300px", minHeight: "300px" }}
      >
        <div className="notificationsTopBar notSelectable">
          <IconButton className="notificationsLeftSide">
            <i className="material-icons">clear_all</i>
          </IconButton>
          <IconButton className="notificationsRightSide">
            <i class="material-icons">notifications_off</i>
          </IconButton>
        </div>
        {this.props.areThereNotifications ? (
          <Menu />
        ) : (
          <div className="notSelectable">Bear looking at phone</div>
        )}
      </Popover>
    )
  }
}
