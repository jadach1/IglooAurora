import React from "react"
import IconButton from "material-ui/IconButton"
import IconMenu from "material-ui/IconMenu"
import CenteredSpinner from "./CenteredSpinner"
import { List, ListItem } from "material-ui/List"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Snackbar from "material-ui/Snackbar"
import Badge from "material-ui-next/Badge"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import Tooltip from "material-ui-next/Tooltip"
import { createMuiTheme } from "material-ui-next/styles"

var moment = require("moment")

const sleep = time =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })

const NOTIFICATION_VIEW_TIME = 5000

class NotificationsPopover extends React.Component {
  state = {
    open: false,
    snackOpen: false,
    notificationCounter: 0,
  }

  handleActionClick = () => {
    this.setState({
      snackOpen: false,
    })
  }

  loopNotifications = async notification => {
    await sleep(NOTIFICATION_VIEW_TIME)

    this.setState(({ notificationCounter }) => ({
      notificationCounter: notificationCounter + 1,
    }))
  }

  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        notificationCreated {
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
    `

    this.props.notifications.subscribeToMore({
      document: subscriptionQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newNotifications = [
          ...prev.user.notifications,
          subscriptionData.data.notificationCreated,
        ]
        return {
          user: {
            ...prev.user,
            notifications: newNotifications,
          },
        }
      },
    })

    const updateQuery = gql`
      subscription {
        notificationUpdated {
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
    `

    this.props.notifications.subscribeToMore({
      document: updateQuery,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        const newNotification = subscriptionData.notificationUpdated
        const newNotifications = prev.user.notifications.map(
          notification =>
            notification.id === newNotification.id
              ? newNotification
              : notification
        )
        return {
          user: {
            ...prev.user,
            notifications: newNotifications,
          },
        }
      },
    })
  }

  render() {
    const { notifications: { loading, error, user } } = this.props

    let notifications = "No notifications"

    let notificationsIcon = "notifications_none"

    let notificationsSnackBar

    if (error) notifications = "Unexpected error bear"

    if (loading) notifications = <CenteredSpinner />

    if (user) {
      notifications = (
        <List>
          <ReactCSSTransitionGroup
            transitionName="notification"
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={3000}
          >
            {user.notifications
              .map(notification => (
                <ListItem
                  className="notSelectable"
                  primaryText={
                    <span>
                      <b>{notification.device.customName}:</b>{" "}
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
                  onClick={() => {
                    this.props.selectDevice(notification.device.id)
                    this.setState({ open: false })
                  }}
                  id={notification.id}
                />
              ))
              .reverse()}
          </ReactCSSTransitionGroup>
        </List>
      )
      notificationsIcon = user.notifications
        ? "notifications"
        : "notifications_none"

      notificationsSnackBar = user.notifications
        .filter(notification => !notification.visualized)
        .map(notification => (
          <span>
            <b>{notification.device.customName}:</b> {notification.content}
          </span>
        ))

      this.loopNotifications(notificationsSnackBar)
    }

    return (
      <React.Fragment>
        <IconMenu
          iconButtonElement={
            <Tooltip
              id="tooltip-bottom"
              title="Notifications"
              placement="bottom"
            >
              <Badge badgeContent={4} color="primary">
                <IconButton
                  style={{
                    padding: "0",
                    marginRight: "4px",
                    width: "24px",
                    height: "24px",
                  }}
                  onClick={() => this.setState({ open: true })}
                  className="sidebarHeaderButton"
                >
                  <i className="material-icons sidebarHeaderIcons">
                    {notificationsIcon}
                  </i>
                </IconButton>
              </Badge>
            </Tooltip>
          }
          anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
          targetOrigin={{ horizontal: "middle", vertical: "top" }}
          menuStyle={{
            width: "300px",
            height: "50vh",
            overflowY: "hidden",
          }}
          menutype="notifications"
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <div className="notificationsTopBar notSelectable invisibleHeader">
            <IconButton className="notificationsLeftSide">
              <Tooltip id="tooltip-bottom" title="Clear all" placement="bottom">
                <i className="material-icons">clear_all</i>
              </Tooltip>
            </IconButton>
            <IconButton className="notificationsRightSide">
              <Tooltip
                id="tooltip-bottom"
                title="Enable quiet mode"
                placement="bottom"
              >
                <i className="material-icons">notifications_off</i>
              </Tooltip>
            </IconButton>
          </div>
          <div
            className="notSelectable"
            style={{ overflowY: "auto", height: "100%" }}
          >
            {notifications}
          </div>
        </IconMenu>
        {notificationsSnackBar && (
          <Snackbar
            open={notificationsSnackBar[this.state.notificationCounter - 1]}
            message={notificationsSnackBar[this.state.notificationCounter - 1]}
            autoHideDuration={4000}
            action="Dismiss"
            onActionClick={this.handleActionClick}
          />
        )}
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
  { name: "notifications" }
)(NotificationsPopover)
