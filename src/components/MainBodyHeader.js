import React, { Component } from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import IconButton from "material-ui/IconButton"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"

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
    const actions = [<FlatButton label="Close" onClick={this.handleClose} />]

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
            style={{ marginTop: "6px" }}
            tooltip="Rearrange tiles"
          >
            <i className="material-icons">mode_edit</i>
          </IconButton>
        </div>
        <Dialog
          title="Rearrange tiles"
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
