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
import FlatButton from "material-ui/FlatButton"

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

    let clearNotification = id => {
      this.props["ClearNotification"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            visualized: true,
          },
        },
      })
    }

    let notifications = ""
    let readNotifications = ""

    let notificationsIcon = "notifications_none"

    let noNotificationsUI = ""
    let readNotificationsUI = ""

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
              .filter(
                notification => notification.device.id === this.props.device.id
              )
              .filter(notification => notification.visualized === false)
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
                  onClick={() => clearNotification(notification.id)}
                />
              ))
              .reverse()}
          </ReactCSSTransitionGroup>
        </List>
      )

      readNotifications = (
        <List>
          <ReactCSSTransitionGroup
            transitionName="notification"
            transitionEnterTimeout={5000}
            transitionLeaveTimeout={3000}
          >
            {user.notifications
              .filter(
                notification => notification.device.id === this.props.device.id
              )
              .filter(notification => notification.visualized === true)
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

      const notificationCount = user.notifications
        .filter(notification => notification.device.id === this.props.device.id)
        .filter(notification => notification.visualized === false).length

      const readNotificationCount = user.notifications
        .filter(notification => notification.device.id === this.props.device.id)
        .filter(notification => notification.visualized === true).length

      notificationsIcon = notificationCount
        ? "notifications"
        : "notifications_none"

      if (!notificationCount) {
        noNotificationsUI = "No new notifications"
      }

      if (readNotificationCount) {
        readNotificationsUI = (
          <FlatButton
            onClick={() =>
              this.setState(oldState => ({
                showVisualized: !oldState.showVisualized,
              }))
            }
            label={
              this.state.showVisualized
                ? "Hide read notifications"
                : "Show read notifications"
            }
            icon={
              this.state.showVisualized ? (
                <i className="material-icons">keyboard_arrow_up</i>
              ) : (
                <i className="material-icons">keyboard_arrow_down</i>
              )
            }
            fullWidth={true}
            className="divider"
            key="showMoreLessButton"
            style={
              this.state.showVisualized
                ? { backgroundColor: "#d4d4d4" }
                : { backgroundColor: "transparent" }
            }
          />
        )
      }
    }

    return (
      <React.Fragment>
        <IconButton
          className="mainBodyHeaderIcon"
          style={{
            padding: "0",
            width: "32px",
            height: "32px",
            marginTop: "14px",
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
          variant="temporary"
          anchor="right"
          open={this.state.drawer}
          onClose={() =>
            this.setState(
              this.state.drawer ? { drawer: false } : { drawer: true }
            )
          }
        >
          <div className="notificationsTopBar notSelectable invisibleHeader">
            <IconButton
              className="notificationsLeftSide"
              onClick={() => this.setState({ drawer: false })}
              style={{
                padding: "0",
                width: "32px",
                height: "32px",
              }}
            >
              <Tooltip
                id="tooltip-bottom"
                title="Close drawer"
                placement="bottom"
              >
                <i class="material-icons">chevron_right</i>
              </Tooltip>
            </IconButton>
            <IconButton
              className="notificationsRightSide2"
              style={{
                padding: "0",
                width: "32px",
                height: "32px",
              }}
            >
              <Tooltip id="tooltip-bottom" title="Clear all" placement="bottom">
                <i className="material-icons">clear_all</i>
              </Tooltip>
            </IconButton>
            <IconButton
              className="notificationsRightSide"
              style={{
                padding: "0",
                width: "32px",
                height: "32px",
              }}
            >
              <Tooltip
                id="tooltip-bottom"
                title="Mute device"
                placement="bottom"
              >
                <i className="material-icons">notifications_off</i>
              </Tooltip>
            </IconButton>
          </div>
          <div
            className="notSelectable"
            style={{ overflowY: "auto", height: "100%", width: "320px" }}
          >
            {noNotificationsUI}
            {notifications}
            {readNotificationsUI}
            {readNotificationsUI
              ? this.state.showVisualized ? readNotifications : ""
              : ""}
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
)(
  graphql(
    gql`
      mutation ClearNotification($id: ID!) {
        notification(id: $id, visualized: true) {
          id
        }
      }
    `,
    {
      name: "ClearNotification",
    }
  )(NotificationsDrawer)
)
