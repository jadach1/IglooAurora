import React from "react"
import CenteredSpinner from "./CenteredSpinner"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import AppBar from "@material-ui/core/AppBar"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Badge from "@material-ui/core/Badge"
import Tooltip from "@material-ui/core/Tooltip"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import IconButton from "@material-ui/core/IconButton"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListSubheader from "@material-ui/core/ListSubheader"
import Menu from "@material-ui/core/Menu"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Button from "@material-ui/core/Button"
import { hotkeys } from "react-keyboard-shortcuts"
import moment from "moment"
import Moment from "react-moment"

let device

let loading

let error

let unreadNotifications = []

let notificationsToFlush = []

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
          ...prev.device.notifications,
          subscriptionData.data.notificationCreated,
        ]
        return {
          device: {
            ...prev.device,
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
        const newNotification = [
          ...prev.user.notifications,
          subscriptionData.data.notificationUpdated,
        ]

        return {
          user: {
            ...prev.user,
            notifications: newNotification,
          },
        }
      },
    })

    const subscribeToNotificationsDeletes = gql`
      subscription {
        notificationDeleted
      }
    `

    this.props.notifications.subscribeToMore({
      document: subscribeToNotificationsDeletes,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        const newNotifications = prev.device.notifications.filter(
          notification =>
            notification.id !== subscriptionData.data.notificationDeleted
        )

        return {
          device: {
            ...prev.device,
            notifications: newNotifications,
          },
        }
      },
    })
  }

  clearNotification = id => {
    this.props.ClearNotification({
      variables: {
        id: id,
      },
    })
  }

  clearAllNotifications = () => {
    if (device) {
      notificationsToFlush = device.notifications
        .filter(
          notification =>
            notification.visualized === false &&
            unreadNotifications.indexOf(notification.id) === -1
        )
        .map(notification => notification.id)

      for (let i = 0; i < notificationsToFlush.length; i++) {
        this.clearNotification(notificationsToFlush[i])
      }
    }
  }

  showNotificationsAsRead = () => {
    if (device) {
      device.notifications
        .filter(notification => !unreadNotifications.includes(notification.id))
        .forEach(notification =>
          Object.defineProperty(notification, "visualized", {
            value: true,
            writable: true,
            configurable: true,
          })
        )
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.drawer !== nextProps.drawer && nextProps.drawer) {
      this.clearAllNotifications()
    }

    if (this.props.notifications.error !== nextProps.notifications.error) {
      error = nextProps.notifications.error
    }

    if (this.props.notifications.loading !== nextProps.notifications.loading) {
      loading = nextProps.notifications.loading
    }

    if (this.props.notifications.device !== nextProps.notifications.device) {
      device = nextProps.notifications.device
    }
  }

  render() {
    let markAsUnread = id => {
      this.props["MarkAsUnread"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            visualized: false,
            __typename: "Notification",
          },
        },
      })
    }

    let deleteNotification = id => {
      this.props["DeleteNotification"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          deleteNotification: {
            id: id,
            __typename: "Notification",
          },
        },
      })
    }

    let notifications = ""
    let readNotifications = ""

    let notificationCount = ""

    let noNotificationsUI = ""
    let readNotificationsUI = ""

    if (error) {
      notifications = "Unexpected error"

      if (error.message === "GraphQL error: This user doesn't exist anymore") {
        this.props.logOut()
      }
    }

    if (loading || !this.props.completeDevice)
      notifications = (
        <CenteredSpinner
          style={{
            paddingTop: "32px",
          }}
        />
      )

    if (device && this.props.completeDevice) {
      let determineDiff = notification =>
        moment().isSame(
          moment.utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss"),
          "day"
        )
          ? "Today"
          : moment()
              .endOf("week")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("week"),
                "weeks"
              ) <= 1
          ? "This week"
          : moment()
              .endOf("month")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("month"),
                "months"
              ) <= 0
          ? moment()
              .endOf("week")
              .add(1, "weeks")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("week"),
                "weeks"
              ) + " weeks ago"
          : moment()
              .endOf("year")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("year"),
                "years"
              ) <= 0
          ? moment()
              .endOf("month")
              .add(1, "months")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("month"),
                "months"
              ) + " months ago"
          : moment()
              .endOf("year")
              .add(1, "years")
              .diff(
                moment
                  .utc(notification.date.split(".")[0], "YYYY-MM-DDTh:mm:ss")
                  .endOf("year"),
                "years"
              ) + " years ago"

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

      let notificationsSections = device.notifications
        .filter(notification => !notification.visualized)
        .map(notification => determineDiff(notification))
        .reverse()

      let cleanedNotificationsSections = removeDuplicates(notificationsSections)

      notifications = (
        <List>
          {cleanedNotificationsSections.map(section => (
            <li>
              <ListSubheader
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { backgroundColor: "#2f333d" }
                    : { backgroundColor: "white" }
                }
              >
                <span
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5" }
                      : { color: "#7a7a7a" }
                  }
                >
                  {section}
                </span>
              </ListSubheader>
              {device.notifications &&
                device.notifications
                  .filter(
                    notification => determineDiff(notification) === section
                  )
                  .filter(notification => !notification.visualized)
                  .map(notification => (
                    <ListItem
                      className="notSelectable"
                      key={notification.id}
                      id={notification.id}
                    >
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
                            {notification.content}
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
                            <Moment fromNow>
                              {moment.utc(
                                notification.date.split(".")[0],
                                "YYYY-MM-DDTh:mm:ss"
                              )}
                            </Moment>
                          </span>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Delete" placement="bottom">
                          <IconButton
                            onClick={() => deleteNotification(notification.id)}
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            <Icon>delete</Icon>
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  .reverse()}
            </li>
          ))}
        </List>
      )

      let readNotificationsSections = device.notifications
        .filter(notification => notification.visualized)
        .map(notification => determineDiff(notification))
        .reverse()

      let cleanedReadNotificationsSections = removeDuplicates(
        readNotificationsSections
      )

      readNotifications = (
        <List>
          {cleanedReadNotificationsSections.map(section => (
            <li>
              <ListSubheader
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { backgroundColor: "#2f333d" }
                    : { backgroundColor: "white" }
                }
              >
                <span
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5" }
                      : { color: "#7a7a7a" }
                  }
                >
                  {section}
                </span>
              </ListSubheader>
              {device.notifications &&
                device.notifications
                  .filter(
                    notification => determineDiff(notification) === section
                  )
                  .filter(notification => notification.visualized)
                  .map(notification => (
                    <ListItem
                      key={notification.id}
                      className="notSelectable"
                      id={notification.id}
                    >
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
                            {notification.content}
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
                            <Moment fromNow>
                              {moment.utc(
                                notification.date.split(".")[0],
                                "YYYY-MM-DDTh:mm:ss"
                              )}
                            </Moment>
                          </span>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="More" placement="bottom">
                          <IconButton
                            onClick={event =>
                              this.setState({
                                anchorEl: event.currentTarget,
                                targetNotification: notification,
                              })
                            }
                            style={
                              typeof Storage !== "undefined" &&
                              localStorage.getItem("nightMode") === "true"
                                ? { color: "white" }
                                : { color: "black" }
                            }
                          >
                            <Icon>more_vert</Icon>
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                  .reverse()}
            </li>
          ))}
        </List>
      )

      notificationCount =
        device.notifications &&
        device.notifications.filter(
          notification => notification.visualized === false
        ).length

      const readNotificationCount =
        device.notifications &&
        device.notifications.filter(
          notification => notification.visualized === true
        ).length

      if (!notificationCount) {
        noNotificationsUI = (
          <Typography
            variant="h5"
            style={{
              textAlign: "center",
              marginTop: "32px",
              marginBottom: "32px",
            }}
          >
            No new notifications
          </Typography>
        )
      }

      if (readNotificationCount) {
        readNotificationsUI = (
          <Button
            onClick={() => this.props.showHiddenNotifications()}
            fullWidth={true}
            className="divider"
            key="showMoreLessButton"
            style={
              this.props.hiddenNotifications
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { backgroundColor: "#282c34", color: "white" }
                  : { backgroundColor: "#d4d4d4", color: "black" }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                ? { backgroundColor: "transparent", color: "white" }
                : { backgroundColor: "transparent", color: "black" }
            }
          >
            {this.props.hiddenNotifications ? (
              <Icon>keyboard_arrow_up</Icon>
            ) : (
              <Icon>keyboard_arrow_down</Icon>
            )}
            {this.props.hiddenNotifications
              ? "Hide read notifications"
              : "Show read notifications"}
          </Button>
        )
      }
    }

    return (
      <React.Fragment>
        <Menu
          open={this.state.anchorEl}
          anchorEl={this.state.anchorEl}
          onClose={() => {
            this.setState({ anchorEl: null })
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              markAsUnread(this.state.targetNotification.id)
              this.setState({ anchorEl: null })
              unreadNotifications.push(this.state.targetNotification.id)
            }}
          >
            <ListItemIcon>
              <Icon>markunread</Icon>
            </ListItemIcon>
            <ListItemText>Mark as unread</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              deleteNotification(this.state.targetNotification.id)
              this.setState({ anchorEl: null })
            }}
          >
            <ListItemIcon>
              <Icon style={{ color: "#f44336" }}>delete</Icon>
            </ListItemIcon>
            <ListItemText inset>
              <span style={{ color: "#f44336" }}>Delete</span>
            </ListItemText>
          </MenuItem>
        </Menu>
        <Tooltip title="Notifications" placement="bottom">
          <IconButton
            style={{ color: "white" }}
            onClick={
              this.props.hiddenNotifications
                ? () => {
                    this.props.changeDrawerState()
                    this.props.showHiddenNotifications()
                  }
                : () => {
                    this.props.changeDrawerState()
                  }
            }
          >
            {notificationCount ? (
              <Badge
                badgeContent={
                  notificationCount > 99 ? "99+" : notificationCount
                }
                color="primary"
              >
                <Icon>notifications</Icon>
              </Badge>
            ) : (
              <Icon>notifications_none</Icon>
            )}
          </IconButton>
        </Tooltip>
        <SwipeableDrawer
          variant="temporary"
          anchor="right"
          open={this.props.drawer}
          onClose={() => {
            notificationsToFlush = []
            this.props.changeDrawerState()
            this.showNotificationsAsRead()
          }}
          swipeAreaWidth={0}
          disableBackdropTransition={false}
          disableDiscovery={true}
        >
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? { background: "#2f333d", height: "100%", overflowY: "hidden" }
                : { background: "white", height: "100%", overflowY: "hidden" }
            }
          >
            <div>
              <AppBar position="sticky" style={{ height: "64px" }}>
                <div
                  className="notSelectable"
                  style={{
                    height: "64px",
                    backgroundColor: "#0083ff",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tooltip
                    id="tooltip-bottom"
                    title="Close drawer"
                    placement="bottom"
                  >
                    <IconButton
                      onClick={() => {
                        this.props.changeDrawerState()
                      }}
                      style={{
                        color: "white",
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "8px",
                      }}
                    >
                      <Icon>chevron_right</Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </AppBar>
              <div
                className="notSelectable"
                style={
                  window.innerWidth > 360
                    ? {
                        overflowY: "auto",
                        height: "calc(100vh - 64px)",
                        width: "324px",
                      }
                    : {
                        overflowY: "auto",
                        height: "calc(100vh - 64px)",
                        width: "90vw",
                      }
                }
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
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
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
  {
    name: "notifications",
    options: ({ deviceId }) => ({ variables: { id: deviceId } }),
  }
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
  )(
    graphql(
      gql`
        mutation MarkAsUnread($id: ID!) {
          notification(id: $id, visualized: false) {
            id
            visualized
          }
        }
      `,
      {
        name: "MarkAsUnread",
      }
    )(
      graphql(
        gql`
          mutation DeleteNotification($id: ID!) {
            deleteNotification(id: $id)
          }
        `,
        {
          name: "DeleteNotification",
        }
      )(
        graphql(
          gql`
            mutation ToggleQuietMode($id: ID!, $muted: Boolean!) {
              device(id: $id, muted: $muted) {
                id
                muted
              }
            }
          `,
          {
            name: "ToggleQuietMode",
          }
        )(hotkeys(NotificationsDrawer))
      )
    )
  )
)
