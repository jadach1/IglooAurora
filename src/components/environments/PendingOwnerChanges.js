import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import CenteredSpinner from "../CenteredSpinner"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class PendingOwnerChanges extends Component {
  AcceptOwnership = id =>
    this.props.AcceptPendingOwnerChange({
      variables: {
        pendingOwnerChangeId: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        pendingOwnerChanges: {
          pendingOwnerChangeId: id,
          __typename: "OwnerChange",
        },
      },
    })

  DeclineOwnership = id =>
    this.props.DeclinePendingOwnerChange({
      variables: {
        pendingOwnerChangeId: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        pendingOwnerChanges: {
          pendingOwnerChangeId: id,
          __typename: "OwnerChange",
        },
      },
    })

  render() {
    let content = ""

    if (this.props.ownerChangesData.error) content = "Unexpected error"

    if (this.props.ownerChangesData.loading) content = <CenteredSpinner />

    if (this.props.ownerChangesData.user)
      content = (
        <List style={{ width: "100%", height: "100%" }}>
          {this.props.ownerChangesData.user.pendingOwnerChanges.map(
            pendingOwnerChange => (
              <ListItem style={{ paddingLeft: "24px" }}>
                <ListItemText
                  primary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      {pendingOwnerChange.environment.name}
                    </font>
                  }
                  secondary={
                    <font
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "#c1c2c5" }
                          : { color: "#7a7a7a" }
                      }
                    >
                      {"Sent by " + pendingOwnerChange.sender.name}
                    </font>
                  }
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginRight: "72px",
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => this.AcceptOwnership(pendingOwnerChange.id)}
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <Icon>done</Icon>
                  </IconButton>
                  <IconButton
                    onClick={() => this.DeclineOwnership(pendingOwnerChange.id)}
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    <Icon>close</Icon>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          )}
        </List>
      )

    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Pending transfer requests</DialogTitle>
        {content}
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation AcceptPendingOwnerChange($pendingOwnerChangeId: ID!) {
      acceptPendingOwnerChange(pendingOwnerChangeId: $pendingOwnerChangeId) {
        id
      }
    }
  `,
  {
    name: "AcceptPendingOwnerChange",
  }
)(
  graphql(
    gql`
      mutation DeclinePendingOwnerChange($pendingOwnerChangeId: ID!) {
        declinePendingOwnerChange(pendingOwnerChangeId: $pendingOwnerChangeId)
      }
    `,
    {
      name: "DeclinePendingOwnerChange",
    }
  )(
    withMobileDialog({ breakpoint: "xs" })(
      graphql(
        gql`
          query {
            user {
              id
              pendingOwnerChanges {
                id
                receiver {
                  id
                  profileIconColor
                  name
                  email
                }
                sender {
                  id
                  name
                }
                environment {
                  id
                  name
                }
              }
            }
          }
        `,
        { name: "ownerChangesData" }
      )(PendingOwnerChanges)
    )
  )
)
