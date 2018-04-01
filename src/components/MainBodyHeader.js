import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import IconButton from "material-ui/IconButton"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import Tooltip from "material-ui-next/Tooltip"
import NotificationsDrawer from "./NotificationsDrawer"

const drawerWidth = 240

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 430,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  toolbar: theme.mixins.toolbar,
})

class MainBodyHeader extends Component {
  state = {
    open: false,
    drawer: false,
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
            <i className="deviceIconBig material-icons">lightbulb_outline</i>
          )}
          <p className="title">{device.customName}</p>
          <IconButton
            onClick={this.handleOpen}
            className="mainBodyHeaderIcon"
            style={{
              padding: "0",
              width: "32px",
              height: "32px",
              marginTop: "14px",
            }}
          >
            <Tooltip
              id="tooltip-bottom"
              title="Rearrange cards"
              placement="bottom"
            >
              <i className="material-icons">mode_edit</i>
            </Tooltip>
          </IconButton>
          <NotificationsDrawer
            changeDrawerState={() =>
              this.setState(
                this.state.drawer ? { drawer: false } : { drawer: true }
              )
            }
            open={this.state.drawer}
            device={device}
          />
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
