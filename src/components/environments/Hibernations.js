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
import withMobileDialog from "@material-ui/core/withMobileDialog"
import CenteredSpinner from "../CenteredSpinner"
import Replay from "@material-ui/icons/Replay"
import Typography from "@material-ui/core/Typography"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class Hibernations extends Component {
  RestoreEnvironment = id =>
    this.props.RestoreEnvironment({
      variables: {
        environmentId: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        hibernatedEnvironment: {
          environmentId: id,
          __typename: "HibernatedEnvironment",
        },
      },
    })

  render() {
    let content = ""

    if (this.props.ownerChangesData.error)
      content = (
        <Typography
          variant="h5"
          className="notSelectable defaultCursor"
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? {
                  textAlign: "center",
                  marginTop: "32px",
                  marginBottom: "32px",
                  color: "white",
                }
              : {
                  textAlign: "center",
                  marginTop: "32px",
                  marginBottom: "32px",
                }
          }
        >
          Unexpected error
        </Typography>
      )

    if (this.props.ownerChangesData.loading) content = <CenteredSpinner />

    if (this.props.ownerChangesData.user)
      content = (
        <List style={{ width: "100%", height: "100%" }}>
          {["", ""].map(pendingOwnerChange => (
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
                    Real devices
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
                    {"Hibernated 2 months ago"}
                  </font>
                }
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginRight: "24px",
                }}
              />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => this.RestoreEnvironment(pendingOwnerChange.id)}
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  <Replay />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
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
        <DialogTitle disableTypography>Hibernated environments</DialogTitle>
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
    mutation RestoreEnvironment($environmentId: ID!) {
      restoreEnvironment(environmentId: $environmentId) {
        id
      }
    }
  `,
  {
    name: "RestoreEnvironment",
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
    )(Hibernations)
  )
)
