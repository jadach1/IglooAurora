import React from "react"
import IconButton from "material-ui/IconButton"
import CenteredSpinner from "./CenteredSpinner"
import List, { ListItem, ListItemText } from "material-ui-next/List"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Badge from "material-ui-next/Badge"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import Tooltip from "material-ui-next/Tooltip"
import SwipeableDrawer from "material-ui-next/SwipeableDrawer"
import FlatButton from "material-ui/FlatButton"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { hotkeys } from "react-keyboard-shortcuts"
import Icon from "material-ui-next/Icon"
import moment from "moment"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#ff4081" },
  },
})

const sleep = time =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })

class NotificationsDrawer extends React.Component {
  state = { showVisualized: false }
  hot_keys = {
    "alt+n": {
      priority: 1,
      handler: event => {
        this.props.changeDrawerState()
      },
    },
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
        const newNotification = subscriptionData.data.notificationUpdated

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
    const {
      notifications: { loading, error, user },
    } = this.props

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
            __typename: "Notification",
          },
        },
      })
    }

    let clearAllNotifications = () => {
      const notificationsToFlush = user.notifications.filter(
        notification =>
          notification.device.id === this.props.device.id &&
          notification.visualized === false
      )

      for (let i = 0; i < notificationsToFlush.length; i++) {
        clearNotification(notificationsToFlush[i].id)
      }
    }

    let notifications = ""
    let readNotifications = ""

    let notificationCount = ""

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
                  key={notification.id}
                  id={notification.id}
                  onClick={() => clearNotification(notification.id)}
                >
                  <ListItemText
                    primary={notification.content}
                    secondary={moment(
                      notification.date.split(".")[0],
                      "YYYY-MM-DDTh:mm:ss"
                    ).fromNow()}
                  />
                </ListItem>
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
                  button
                  key={notification.id}
                  className="notSelectable"
                  id={notification.id}
                >
                  <ListItemText
                    primary={notification.content}
                    secondary={moment(
                      notification.date.split(".")[0],
                      "YYYY-MM-DDTh:mm:ss"
                    ).fromNow()}
                  />
                </ListItem>
              ))
              .reverse()}
          </ReactCSSTransitionGroup>
        </List>
      )

      notificationCount = user.notifications
        .filter(notification => notification.device.id === this.props.device.id)
        .filter(notification => notification.visualized === false).length

      const readNotificationCount = user.notifications
        .filter(notification => notification.device.id === this.props.device.id)
        .filter(notification => notification.visualized === true).length

      if (!notificationCount) {
        noNotificationsUI = "No new notifications"
      }

      if (readNotificationCount) {
        readNotificationsUI = (
          <FlatButton
            onClick={() => this.props.showHiddenNotifications()}
            label={
              this.props.hiddenNotifications
                ? "Hide read notifications"
                : "Show read notifications"
            }
            icon={
              this.props.hiddenNotifications ? (
                <Icon>keyboard_arrow_up</Icon>
              ) : (
                <Icon>keyboard_arrow_down</Icon>
              )
            }
            fullWidth={true}
            className="divider"
            key="showMoreLessButton"
            style={
              this.props.hiddenNotifications
                ? { backgroundColor: "#d4d4d4" }
                : null
            }
          />
        )
      }
    }

    return (
      <React.Fragment>
        <Tooltip title="Notifications" placement="bottom">
          <IconButton
            className="mainBodyHeaderIcon"
            style={{
              padding: "0",
              position: "absolute",
              marginTop: "14px",
              width: "32px",
              height: "32px",
            }}
            onClick={() => this.props.changeDrawerState()}
          >
            <MuiThemeProvider theme={theme}>
              {notificationCount ? (
                <Badge badgeContent={notificationCount} color="primary">
                  <Icon>notifications</Icon>
                </Badge>
              ) : (
                <Icon>notifications_none</Icon>
              )}
            </MuiThemeProvider>
          </IconButton>
        </Tooltip>
        <SwipeableDrawer
          variant="temporary"
          anchor="right"
          open={this.props.drawer}
          onClose={async time => {
            this.props.changeDrawerState()
            await sleep(200)
            clearAllNotifications()
          }}
          swipeAreaWidth={0}
          disableBackdropTransition={false}
          disableDiscovery={true}
        >
          <div className="notificationsTopBar notSelectable invisibleHeader">
            <Tooltip
              id="tooltip-bottom"
              title="Close drawer"
              placement="bottom"
            >
              <IconButton
                className="notificationsLeftSide"
                onClick={() => {
                  this.props.changeDrawerState()
                  clearAllNotifications()
                }}
                style={{
                  padding: "0",
                  width: "32px",
                  height: "32px",
                }}
              >
                <Icon>chevron_right</Icon>
              </IconButton>
            </Tooltip>
            {/*  <Tooltip id="tooltip-bottom" title="Clear all" placement="bottom">
              <IconButton
                className="notificationsRightSide2"
                style={{
                  padding: "0",
                  width: "32px",
                  height: "32px",
                }}
                onClick={() => {
                  clearAllNotifications()
                }}
              >
                <i className="material-icons">clear_all</i>
              </IconButton>
            </Tooltip> */}
            <Tooltip id="tooltip-bottom" title="Mute device" placement="bottom">
              <IconButton
                className="notificationsRightSide"
                style={{
                  padding: "0",
                  width: "32px",
                  height: "32px",
                }}
              >
                <Icon>notifications_off</Icon>
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="notSelectable"
            style={{ overflowY: "auto", height: "100%", width: "320px" }}
          >
            {noNotificationsUI}
            {notifications}
            {readNotificationsUI}
            {readNotificationsUI
              ? this.props.hiddenNotifications
                ? readNotifications
                : ""
              : ""}
          </div>
        </SwipeableDrawer>
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
          visualized
        }
      }
    `,
    {
      name: "ClearNotification",
    }
  )(hotkeys(NotificationsDrawer))
)
