import React from "react"
import Popover from "material-ui/Popover"
import Menu from "material-ui/Menu"
import MenuItem from "material-ui/MenuItem"
import IconButton from "material-ui/IconButton"
import IconMenu from "material-ui/IconMenu"
import CenteredSpinner from "./CenteredSpinner"
import { List, ListItem } from "material-ui/List"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Snackbar from "material-ui/Snackbar"

var moment = require("moment")

class NotificationsPopover extends React.Component {
  state = { notificationsCounter: 0 }

  render() {
    const { userData: { loading, error, user } } = this.props

    let notifications = "No notifications"

    let notificationsIcon = "notifications_none"

    let notificationsSnackBar = ""

    if (error) notifications = "Unexpected error bear"

    if (loading) notifications = <CenteredSpinner />

    if (user) {
      notifications = (
        <List>
          {user.notifications.map(notification => (
            <ListItem
              className="notSelectable"
              primaryText={
                <span>
                  <b>{notification.device.customName}</b>:{" "}
                  {notification.content}
                </span>
              }
              secondaryText={moment(
                notification.date.split(".")[0],
                "YYYY-MM-DDTh:mm:ss"
              ).fromNow()}
              style={{
                backgroundColor: "transparent",
              }}
              leftIcon={
                notification.device.icon ? (
                  <img
                    className="deviceIcon"
                    src={notification.device.icon}
                    alt="device logo"
                  />
                ) : (
                  <i className="material-icons">lightbulb_outline</i>
                )
              }
            />
          ))}
        </List>
      )
      notificationsIcon = user.notifications
        ? "notifications"
        : "notifications_none"

      notificationsSnackBar = user.notifications.map(notification => (
        <Snackbar
          open={true}
          message={
            <span>
              <b>{notification.device.customName}</b>: {notification.content}
            </span>
          }
          autoHideDuration={10000}
          action="Close"
        />
      ))
    }

    return (
      <React.Fragment>
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
                {notificationsIcon}
              </i>
            </IconButton>
          }
          anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
          menuStyle={{
            width: "300px",
            height: "50vh",
            minHeight: "350px",
          }}
          menutype="notifications"
        >
          <div className="notificationsTopBar notSelectable invisibleHeader">
            <IconButton className="notificationsLeftSide">
              <i className="material-icons">clear_all</i>
            </IconButton>
            <IconButton className="notificationsRightSide">
              <i className="material-icons">notifications_off</i>
            </IconButton>
          </div>
          <div className="notSelectable">{notifications}</div>
        </IconMenu>
        {notificationsSnackBar}
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        notifications {
          id
          content
          date
          visualized
          device {
            id
            icon
            customName
          }
        }
      }
    }
  `,
  { name: "userData" }
)(NotificationsPopover)
