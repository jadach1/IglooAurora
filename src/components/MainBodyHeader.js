import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Dialog from "material-ui/Dialog"
import NotificationsDrawer from "./NotificationsDrawer"
import DeviceInfo from "./DeviceInfo"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {
  Typography,
  Button,
  Tooltip,
  Icon,
  IconButton,
} from "@material-ui/core"

class MainBodyHeader extends Component {
  state = {
    open: false,
    infoOpen: false,
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const actions = [<Button onClick={this.handleClose}>Close</Button>]

    const { loading, error, device } = this.props.data

    if (loading) {
      return <div className="mainBodyHeader" />
    }

    if (error) {
      return <div className="mainBodyHeader" />
    }

    return (
      <React.Fragment>
        <div
          className="mainBodyHeader notSelectable"
          style={{
            color: "white",
            height: "64px",
          }}
        >
          {device.icon ? (
            <img
              className="deviceIconBig"
              src={device.icon}
              alt="device logo"
            />
          ) : (
            <i
              className="deviceIconBig material-icons"
              style={{ cursor: "default" }}
            >
              lightbulb_outline
            </i>
          )}
          <Typography
            variant="headline"
            className="title"
            style={{
              cursor: "default",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color:"white",
              lineHeight:"64px"
            }}
          >
            {device.customName}
          </Typography>
          <div
            style={{
              padding: "0",
              marginLeft: "auto",
              marginRight: "8px",
              float: "right",
              gridArea: "buttons",
            }}
          >
            {navigator.share ? (
              <Tooltip id="tooltip-bottom" title="Share" placement="bottom">
                <IconButton
                  style={{
                    color: "white",
                  }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: device.customName + " on Igloo Aurora",
                          url: window.location.href,
                        })
                    }
                  }}
                >
                  <Icon>share</Icon>
                </IconButton>
              </Tooltip>
            ) : (
              ""
            )}
            {!navigator.share ? (
              <Tooltip id="tooltip-bottom" title="Get link" placement="bottom">
                <CopyToClipboard text={window.location.href}>
                  <IconButton
                    style={{
                      color: "white",
                    }}
                    onClick={() => this.props.openSnackBar()}
                  >
                    <Icon>link</Icon>
                  </IconButton>
                </CopyToClipboard>
              </Tooltip>
            ) : (
              ""
            )}
            {/* <Tooltip
              id="tooltip-bottom"
              title="See on the map"
              placement="bottom"
            >
              <IconButton
                style={{
                  color: "white",
                }}
              >
                <Icon>place</Icon>
              </IconButton>
            </Tooltip> */}
            <Tooltip
              id="tooltip-bottom"
              title="Device information"
              placement="bottom"
            >
              <IconButton
                onClick={() => this.setState({ infoOpen: true })}
                style={{
                  color: "white",
                }}
              >
                <Icon>info</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip
              id="tooltip-bottom"
              title="Rearrange cards"
              placement="bottom"
            >
              <IconButton
                onClick={this.handleOpen}
                style={{
                  color: "white",
                }}
              >
                <Icon>mode_edit</Icon>
              </IconButton>
            </Tooltip>
            <NotificationsDrawer
              device={device}
              drawer={this.props.drawer}
              changeDrawerState={this.props.changeDrawerState}
              hiddenNotifications={this.props.hiddenNotifications}
              showHiddenNotifications={this.props.showHiddenNotifications}
              nightMode={this.props.nightMode}
            />
          </div>
        </div>
        <Dialog
          title="Rearrange cards"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          className="notSelectable"
        >
          [FILL WITH DRAG 'N' DROPPABLE LIST]
        </Dialog>
        <DeviceInfo
          infoOpen={this.state.infoOpen}
          close={() => this.setState({ infoOpen: false })}
          id={device.id}
          updatedAt={device.updatedAt}
          createdAt={device.createdAt}
          devMode={this.props.devMode}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query($id: ID!) {
      device(id: $id) {
        id
        customName
        icon
        updatedAt
        createdAt
      }
    }
  `,
  {
    options: ({ deviceId }) => ({
      variables: {
        id: deviceId,
      },
    }),
  }
)(MainBodyHeader)
