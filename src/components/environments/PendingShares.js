import React from "react"
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

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

let PendingShares = props => {
  let AcceptPendingEnvironmentShare = id =>
    props.AcceptPendingEnvironmentShare({
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

  let DeclinePendingEnvironmentShare = id =>
    props.DeclinePendingEnvironmentShare({
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

  return (
    <Dialog
      open={props.open && props.pendingEnvironmentShares.length}
      onClose={props.close}
      fullScreen={window.innerWidth < MOBILE_WIDTH}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle disableTypography>Pending share requests</DialogTitle>
      <List style={{ width: "100%", height: "100%" }}>
        {props.pendingEnvironmentShares.map(environmentShare => (
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
                onClick={() => AcceptPendingEnvironmentShare(environmentShare.id)}
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
                onClick={() => DeclinePendingEnvironmentShare(environmentShare.id)}
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
        <Button onClick={props.close}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default graphql(
  gql`
    mutation AcceptPendingEnvironmentShare($pendingEnvironmentShareId: ID!) {
      acceptPendingEnvironmentShare(pendingEnvironmentShareId: $pendingEnvironmentShareId)
    }
  `,
  {
    name: "AcceptPendingEnvironmentShare",
  }
)(
  graphql(
    gql`
      mutation DeclinePendingEnvironmentShare($pendingEnvironmentShareId: ID!) {
        declinePendingEnvironmentShare(pendingEnvironmentShareId: $pendingEnvironmentShareId)
      }
    `,
    {
      name: "DeclinePendingEnvironmentShare",
    }
  )(PendingShares)
)
