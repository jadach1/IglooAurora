import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import RadioGroup from "@material-ui/core/RadioGroup"
import Radio from "@material-ui/core/Radio"
import FormControlLabel from "@material-ui/core/FormControlLabel"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class ChangeEnvironment extends React.Component {
  state = { newEnvironment: "" }

  changeEnvironment = value => {
    this.props.ChangeEnvironment({
      variables: {
        id: this.props.device.id,
        environmentId: value,
      },
      optimisticResponse: {
        __typename: "Mutation",
        device: {
          __typename: this.props.device.__typename,
          id: this.props.device.id,
          environmentId: value,
        },
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userData.user) {
      this.setState({
        newEnvironment:
          nextProps.userData.user.environments.filter(environment =>
            environment.devices.filter(
              device =>
                device &&
                device.id &&
                this.props.device &&
                this.props.device.id &&
                device.id === this.props.device.id
            )
          )[0] &&
          nextProps.userData.user.environments.filter(environment =>
            environment.devices.filter(
              device =>
                device &&
                device.id &&
                this.props.device &&
                this.props.device.id &&
                device.id === this.props.device.id
            )
          )[0].id,
      })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        className="notSelectable defaultCursor"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Move device</DialogTitle>
        <RadioGroup
          onChange={(event, value) => {
            this.setState({ newEnvironment: value })
            this.changeEnvironment(value)
          }}
          value={this.state.newEnvironment}
          style={{ paddingLeft: "24px", paddingRight: "24px" }}
        >
          {this.props.environments &&
            this.props.environments
              .sort(function(a, b) {
                return a.myRole === "ONWER"
                  ? b.myRole === "OWNER"
                    ? 0
                    : -1
                  : b.myRole === "OWNER"
                  ? 1
                  : 0
              })
              .map(environment => (
                <FormControlLabel
                  control={<Radio color="primary" />}
                  value={environment.id}
                  label={environment.name}
                  disabled={environment.myRole !== "OWNER"}
                />
              ))}
        </RadioGroup>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeEnvironment($id: ID!, $environmentId: ID!) {
      moveDevice(deviceId: $id, newEnvironmentId: $environmentId) {
        id
      }
    }
  `,
  {
    name: "ChangeEnvironment",
  }
)(ChangeEnvironment)
