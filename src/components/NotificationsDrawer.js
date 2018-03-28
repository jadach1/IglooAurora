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
import Drawer from "material-ui-next/Drawer"

var moment = require("moment")

class NotificationsDrawer extends React.Component {
  state = {
    drawer: false,
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

    if (error) notifications = "Unexpected error"

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
                  primaryText={notification.content}
                  secondaryText={moment(
                    notification.date.split(".")[0],
                    "YYYY-MM-DDTh:mm:ss"
                  ).fromNow()}
                  style={{
                    backgroundColor: "transparent",
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
    }

    return (
      <React.Fragment>
        <IconButton
          className="mainBodyHeaderIcon"
          style={{
            padding: "0",
            width: "24px",
            height: "24px",
            marginTop: "18px",
            left: "34px",
          }}
          onClick={() =>
            this.setState(
              this.state.drawer ? { drawer: false } : { drawer: true }
            )
          }
        >
          <i class="material-icons">{notificationsIcon}</i>
        </IconButton>
        <Drawer
          variant="persistent"
          anchor="right"
          open={this.state.drawer}
          onClose={this.props.changeDrawerState}
        >
          <div
            className="notSelectable"
            style={{ overflowY: "auto", height: "100%" }}
          >
            {notifications}
          </div>
        </Drawer>
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
)(NotificationsDrawer)
