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

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
      <Slide direction="up" {...props} />
    )
}

class LeaveValue extends React.Component {
  deleteValueMutation = () => {
    this.props["DeleteValue"]({
      variables: {
        id: this.props.value.id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteValue: {
          id: this.props.value.id,
        },
      },
    })
    this.props.close()
  }

  stopSharing = () => {
    this.props.StopSharing({
      variables: {
        valueId: this.props.value.id,
        email: this.props.userData.user.email,
      },
      optimisticResponse: {
        __typename: "Mutation",
        stopSharing: {
          id: this.props.value.id,
          email: this.props.userData.user.email,
          __typename: "Value",
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
        <DialogTitle style={{ width: "350px" }}>Leave value</DialogTitle>
        <div style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}>
          Are you sure you want to leave {this.props.value.customName}?
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
              onClick={() => {
                this.stopSharing()
                this.props.close()
              }}
            >
              Leave value
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation StopSharing($email: String!, $valueId: ID!) {
      stopSharingValue(email: $email, valueId: $valueId) {
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
      mutation DeleteValue($id: ID!) {
        deleteValue(id: $id)
      }
    `,
    {
      name: "DeleteValue",
    }
  )(LeaveValue)
)
