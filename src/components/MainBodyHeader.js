import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import IconButton from "material-ui/IconButton"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import Tooltip from "material-ui-next/Tooltip"
import NotificationsDrawer from "./NotificationsDrawer"
import Icon from "material-ui-next/Icon"

class MainBodyHeader extends Component {
  state = {
    open: false,
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
      console.error(error)
      return <div className="mainBodyHeader" />
    }

    return (
      <React.Fragment>
        <div className="mainBodyHeader notSelectable">
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
          <p className="title" style={{ cursor: "default" }}>
            {device.customName}
          </p>
          <div className="mainBodyHeaderIcon">
            <Tooltip
              id="tooltip-bottom"
              title="See on the map"
              placement="bottom"
            >
              <IconButton
                className="mainBodyHeaderIcon"
                style={{
                  padding: "0",
                  margin: "0 5px 0 5px",
                  width: "32px",
                  height: "32px",
                }}
              >
                <Icon>place</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip
              id="tooltip-bottom"
              title="Rearrange cards"
              placement="bottom"
            >
              <IconButton
                onClick={this.handleOpen}
                className="mainBodyHeaderIcon"
                style={{
                  padding: "0",
                  margin: "0 5px 0 5px",
                  width: "32px",
                  height: "32px",
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
