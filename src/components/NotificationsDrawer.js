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
import { withStyles } from "material-ui-next/styles"

var moment = require("moment")

const drawerWidth = 320

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appFrame: {
    height: 430,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%",
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  "appBarShift-left": {
    marginLeft: drawerWidth,
  },
  "appBarShift-right": {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: "none",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  "content-left": {
    marginLeft: -drawerWidth,
  },
  "content-right": {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  "contentShift-left": {
    marginLeft: 0,
  },
  "contentShift-right": {
    marginRight: 0,
  },
})

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
    const { classes, theme } = this.props

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
              .filter(
                notification => notification.device.id === this.props.device.id
              )
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

      const notificationCount = user.notifications.filter(
        notification => notification.device.id === this.props.device.id
      ).length

      notificationsIcon = notificationCount
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
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div
            className="notSelectable"
            style={{ overflowY: "auto", height: "100%" }}
          >
            {this.state.drawer && notifications}
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
)(withStyles(styles)(NotificationsDrawer))
