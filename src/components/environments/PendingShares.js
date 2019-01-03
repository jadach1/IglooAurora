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

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class PendingShares extends Component {
  AcceptPendingEnvironmentShare = id =>
    this.props.AcceptPendingEnvironmentShare({
      variables: {
        pendingEnvironmentShareId: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        pendingEnvironmentShares: {
          pendingEnvironmentShareId: id,
          __typename: "EnvironmentShares",
        },
      },
    })

  DeclinePendingEnvironmentShare = id =>
    this.props.DeclinePendingEnvironmentShare({
      variables: {
        pendingEnvironmentShareId: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        pendingEnvironmentShares: {
          pendingEnvironmentShareId: id,
          __typename: "EnvironmentShares",
        },
      },
    })

  render() {
    return (
      <Dialog
        open={this.props.open && this.props.pendingEnvironmentShares.length}
        onClose={this.props.close}
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Pending share requests</DialogTitle>
        <List style={{ width: "100%", height: "100%" }}>
          {this.props.pendingEnvironmentShares.map(environmentShare => (
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
                    {environmentShare.environment.name}
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
                    {"Sent by " + environmentShare.sender.name}
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
                  onClick={() =>
                    this.AcceptPendingEnvironmentShare(environmentShare.id)
                  }
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5" }
                      : { color: "#7a7a7a" }
                  }
                >
                  <Icon>done</Icon>
                </IconButton>
                <IconButton
                  onClick={() =>
                    this.DeclinePendingEnvironmentShare(environmentShare.id)
                  }
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "#c1c2c5" }
                      : { color: "#7a7a7a" }
                  }
                >
                  <Icon>close</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation AcceptPendingEnvironmentShare($pendingEnvironmentShareId: ID!) {
      acceptPendingEnvironmentShare(
        pendingEnvironmentShareId: $pendingEnvironmentShareId
      ) {
        id
      }
    }
  `,
  {
    name: "AcceptPendingEnvironmentShare",
  }
)(
  graphql(
    gql`
      mutation DeclinePendingEnvironmentShare($pendingEnvironmentShareId: ID!) {
        declinePendingEnvironmentShare(
          pendingEnvironmentShareId: $pendingEnvironmentShareId
        )
      }
    `,
    {
      name: "DeclinePendingEnvironmentShare",
    }
  )(withMobileDialog({ breakpoint: "xs" })(PendingShares))
)
