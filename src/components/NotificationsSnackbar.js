import React from "react"

import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Snackbar from "material-ui-next/Snackbar"
import Button from "material-ui-next/Button"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#ff4081" },
  },
})

const sleep = time =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })

const NOTIFICATIONS_TIMEOUT = 5000

let notifications = ""
let notificationsId = ""

let loopRunning = false

class NotificationsSnackbar extends React.Component {
  state = {
    snackbarMessage: null,
    notificationCounter: 1,
    snackOpen: false,
    snackId: null,
  }

  componentDidMount() {
    const subscriptionQuery = gql`
      subscription {
        notificationCreated {
          id
          content
          date
          visualized
          snackbarVisualized
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
          snackbarVisualized
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

  loopNotifications = async notification => {
    loopRunning = true
    if (this.state.snackbarMessage === null && notification[0]) {
      this.setState({
        snackbarMessage: notification[0],
        snackOpen: true,
        snackId: notificationsId[0],
      })
    }

    await sleep(NOTIFICATIONS_TIMEOUT)

    this.setState(({ notificationCounter }) => ({
      notificationCounter: notificationCounter + 1,
      snackOpen: false,
    }))
    loopRunning = false
  }

  handleExited = () => {
    this.setState({
      snackOpen: true,
      snackbarMessage: notifications[this.state.notificationCounter - 1],
      snackId: notificationsId[this.state.notificationCounter - 1],
    })
  }

  render() {
    const {
      notifications: { loading, error, user },
    } = this.props

    let visualizeSnackbar = id => {
      this.props["VisualizeSnackbar"]({
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          notification: {
            id: id,
            snackbarVisualized: true,
            __typename: "Notification",
          },
        },
      })
    }

    if (error) notifications = "Unexpected error"

    if (loading) notifications = "Loading"

    if (user) {
      notifications = user.notifications
        .filter(
          notification =>
            notification.visualized === false &&
            notification.snackbarVisualized === false
        )
        .map(notification => (
          <span>
            <b>{notification.device.customName}:</b> {notification.content}
          </span>
        ))
        .reverse()

      notificationsId = user.notifications
        .filter(
          notification =>
            notification.visualized === false &&
            notification.snackbarVisualized === false
        )
        .map(notification => notification.id)
        .reverse()

      if (!loopRunning) {
        this.loopNotifications(notifications)
      }
    }

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        className="notSelectable"
        style={{ cursor: "default" }}
        onEntered={() => visualizeSnackbar(this.state.snackId)}
        onExited={this.handleExited}
        open={this.state.snackbarMessage && this.state.snackOpen}
        message={this.state.snackbarMessage}
        action={[
          <MuiThemeProvider theme={theme}>
            <Button key="close" color="primary" size="small">
              CLOSE
            </Button>
          </MuiThemeProvider>,
        ]}
      />
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
          snackbarVisualized
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
      mutation VisualizeSnackbar($id: ID!) {
        notification(id: $id, snackbarVisualized: true) {
          id
          snackbarVisualized
        }
      }
    `,
    {
      name: "VisualizeSnackbar",
    }
  )(NotificationsSnackbar)
)
