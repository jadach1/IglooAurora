import React from "react"
import Popover from "material-ui/Popover"
import Menu from "material-ui/Menu"
import MenuItem from "material-ui/MenuItem"
import IconButton from "material-ui/IconButton"
import IconMenu from "material-ui/IconMenu"
import { each } from "async"

export default class NotificationsPopover extends React.Component {
  render() {
    return (
      <IconMenu
        iconButtonElement={
          <IconButton
            style={{
              padding: "0",
              margin: "0 5px 0 5px",
              width: "24px",
              height: "24px",
            }}
            onClick={this.handleClick}
            className="sidebarHeaderButton"
            tooltip="Notifications"
          >
            <i className="material-icons sidebarHeaderIcons">
              notifications_none
            </i>
          </IconButton>
        }
        anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
        targetOrigin={{ horizontal: "middle", vertical: "top" }}
        menuStyle={{
          width: "300px",
          height: "300px",
        }}
        className="notificationsMenu"
        menutype="notifications"
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
          <div className="notSelectable">No notifications</div>
        )}
      </IconMenu>
    )
  }
}
