import React from "react"
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Grow,
  Slide,
} from "@material-ui/core"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

const MOBILE_WIDTH = 500

class LeaveDevice extends React.Component {
  deleteDeviceMutation = () => {
    this.props["DeleteDevice"]({
      variables: {
        id: this.props.device.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteDevice: {
          id: this.props.device.id,
        },
      },
    })
    this.props.close()
  }

  stopSharing = () => {
    this.props.StopSharing({
      variables: {
        deviceId: this.props.device.id,
        email: this.props.userData.user.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stopSharing: {
          id: this.props.device.id,
          email: this.props.userData.user.email,
          __typename: "Device",
        },
      },
    })
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle style={{ width: "350px" }}>Leave device</DialogTitle>
        <div style={{ paddingLeft: "24px", height: "100%" }}>
          Are you sure you want to leave {this.props.device.customName}?
        </div>
        <br />
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              onClick={this.stopSharing}
            >
              Leave device
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation StopSharing($email: String!, $deviceId: ID!) {
      stopSharingDevice(email: $email, deviceId: $deviceId) {
        id
      }
    }
  `,
  {
    name: "StopSharing",
  }
)(
  graphql(
    gql`
      mutation DeleteDevice($id: ID!) {
        deleteDevice(id: $id)
      }
    `,
    {
      name: "DeleteDevice",
    }
  )(LeaveDevice)
)
