import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import SvgIcon from "@material-ui/core/SvgIcon"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import QrReader from "react-qr-reader"
import TextField from "@material-ui/core/TextField"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import Clear from "@material-ui/icons/Clear"
import isUUID from "is-uuid"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import MenuItem from "@material-ui/core/MenuItem"
import SwitchCamera from "@material-ui/icons/SwitchCamera"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class AddDevice extends Component {
  state = { authDialogOpen: false, camera: "environment" }

  claimDevice(unclaimedDeviceId, name, environmentId) {
    this.props.ClaimDevice({
      variables: {
        unclaimedDeviceId,
        name,
        environmentId,
      },
      optimisticResponse: {
        __typename: "Mutation",
        claimDevice: {
          unclaimedDeviceId,
          name,
          environmentId,
        },
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.state.environment &&
      nextProps.userData.user &&
      nextProps.userData.user.environments.length
    ) {
      this.setState({ environment: nextProps.userData.user.environments[0].id })
    }

    if (this.props.open !== nextProps.open && nextProps.open === true) {
      this.setState({
        name: "",
        nameEmpty: "",
        code: "",
        codeEmpty: "",
      })
    }
  }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
          className="notSelectable defaultCursor"
        >
          <DialogTitle disableTypography>Pair a device</DialogTitle>
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    height: "100%",
                    background: "#2f333d",
                  }
                : {
                    height: "100%",
                  }
            }
          >
            <List>
              <ListItem
                button
                style={{ paddingLeft: "24px" }}
                onClick={() => {
                  this.props.close()
                  this.setState({ qrOpen: true, qrErrpr: false })
                }}
              >
                <ListItemIcon>
                  <SvgIcon>
                    <svg
                      style={{ width: "24px", height: "24px" }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6M4,11H6V13H4V11M9,11H13V15H11V13H9V11M11,6H13V10H11V6M2,2V6H0V2A2,2 0 0,1 2,0H6V2H2M22,0A2,2 0 0,1 24,2V6H22V2H18V0H22M2,18V22H6V24H2A2,2 0 0,1 0,22V18H2M22,22V18H24V22A2,2 0 0,1 22,24H18V22H22Z" />
                    </svg>
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText primary="Scan QR code" />
              </ListItem>
              <ListItem
                button
                style={{ paddingLeft: "24px" }}
                onClick={() => {
                  this.props.close()
                  this.setState({ manualCodeOpen: true, qrErrpr: false })
                }}
              >
                <ListItemIcon>
                  <SvgIcon>
                    <svg
                      style={{ width: "24px", height: "24px" }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z" />
                    </svg>
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText primary="Insert code manually" />
              </ListItem>
            </List>
          </div>
          <DialogActions>
            <Button onClick={this.props.close}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.qrOpen}
          onClose={() => this.setState({ qrOpen: false })}
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
          className="notSelectable defaultCursor"
        >
          <DialogTitle disableTypography>
            Scan QR code
            <IconButton
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
              onClick={() =>
                this.setState(oldState => ({
                  camera: oldState.camera === "user" ? "environment" : "user",
                }))
              }
            >
              <SwitchCamera />
            </IconButton>
          </DialogTitle>
          <div style={{ height: "100%" }}>
            {this.state.qrErrpr && "Unexpected error"}
            <QrReader
              delay={1000}
              showViewFinder={false}
              facingMode={this.state.camera}
              onError={() => this.setState({ qrErrpr: true })}
              onScan={unclaimedDeviceId =>
                isUUID.v4(unclaimedDeviceId) &&
                this.setState({
                  qrOpen: false,
                  authDialogOpen: true,
                  unclaimedDeviceId,
                })
              }
            />
          </div>
          <DialogActions>
            <Button onClick={() => this.setState({ qrOpen: false })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.manualCodeOpen}
          onClose={() => this.setState({ manualCodeOpen: false })}
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
          className="notSelectable defaultCursor"
        >
          <DialogTitle disableTypography>Insert code manually</DialogTitle>
          <div style={{ height: "100%" }}>
            <TextField
              id="add-device-code"
              label="Code"
              value={this.state.code}
              variant="outlined"
              error={this.state.codeEmpty || this.state.codeError}
              helperText={
                this.state.codeEmpty
                  ? "This field is required"
                  : this.state.codeError
                  ? this.state.codeError
                  : " "
              }
              onChange={event =>
                this.setState({
                  code: event.target.value,
                  codeEmpty: event.target.value === "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && !this.state.codeEmpty)
                  this.setState({ manualCodeOpen: false })
              }}
              style={{
                width: "calc(100% - 48px)",
                margin: "0 24px",
              }}
              InputLabelProps={this.state.cpde && { shrink: true }}
              InputProps={{
                endAdornment: this.state.code && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        this.setState({ code: "", codeEmpty: true })
                      }
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <DialogActions>
            <Button onClick={() => this.setState({ manualCodeOpen: false })}>
              Never mind
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                isUUID.v4(this.state.code)
                  ? this.setState({
                      manualCodeOpen: false,
                      authDialogOpen: true,
                      unclaimedDeviceId: this.state.code,
                    })
                  : this.setState({ codeError: "This isn't a valid code" })
              }}
              color="primary"
              disabled={!this.state.code}
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.authDialogOpen}
          onClose={() => this.setState({ authDialogOpen: false })}
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          className="notSelectable defaultCursor"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Add device</DialogTitle>
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                    background: "#2f333d",
                  }
                : {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                  }
            }
          >
            <List
              style={{
                padding: "0",
              }}
            >
              {[
                "Read and write access to itself",
                "Read and write access to other devices",
              ].map(auth => (
                <ListItem>{auth}</ListItem>
              ))}
            </List>
          </div>
          <DialogActions>
            <Button onClick={() => this.setState({ authDialogOpen: false })}>
              Decline
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                this.setState({
                  authDialogOpen: false,
                  deviceDetailsOpen: true,
                })
              }
              color="primary"
            >
              Accept
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.deviceDetailsOpen}
          onClose={() => this.setState({ deviceDetailsOpen: false })}
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
          className="notSelectable defaultCursor"
        >
          <DialogTitle disableTypography>Add device details</DialogTitle>
          <div style={{ height: "100%" }}>
            <TextField
              id="claim-device-name"
              label="Name"
              value={this.state.name}
              variant="outlined"
              error={this.state.nameEmpty}
              helperText={this.state.nameEmpty ? "This field is required" : " "}
              onChange={event =>
                this.setState({
                  name: event.target.value,
                  nameEmpty: event.target.value === "",
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter" && !this.state.nameEmpty) {
                  this.claimDevice(
                    this.state.unclaimedDeviceId,
                    this.state.name,
                    this.state.environment
                  )
                  this.setState({ deviceDetailsOpen: false })
                }
              }}
              style={{
                width: "calc(100% - 48px)",
                margin: "0 24px",
              }}
              InputLabelProps={this.state.name && { shrink: true }}
              InputProps={{
                endAdornment: this.state.name && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        this.setState({ name: "", nameEmpty: true })
                      }
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(0, 0, 0, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              value={this.state.environment}
              onChange={event => {
                this.setState({
                  environment: event.target.value,
                })
              }}
              label="Environment"
              variant="outlined"
              select
              required
              style={{
                width: "calc(100% - 48px)",
                margin: "0 24px",
                marginBottom: "16px",
              }}
              InputLabelProps={this.state.environment && { shrink: true }}
              disabled={
                this.props.userData.user &&
                this.props.userData.user.environments.length < 2
              }
            >
              {this.props.userData.user &&
                this.props.userData.user.environments
                  .filter(
                    environment =>
                      environment.myRole === "ADMIN" ||
                      environment.myRole === "OWNER"
                  )
                  .map(environment => (
                    <MenuItem value={environment.id}>
                      {environment.name}
                    </MenuItem>
                  ))}
            </TextField>
          </div>
          <DialogActions>
            <Button onClick={() => this.setState({ deviceDetailsOpen: false })}>
              Go back
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                this.claimDevice(
                  this.state.unclaimedDeviceId,
                  this.state.name,
                  this.state.environment
                )
                this.setState({ deviceDetailsOpen: false })
              }}
              color="primary"
              disabled={!this.state.name || !this.state.environment}
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ClaimDevice(
      $unclaimedDeviceId: ID!
      $name: String!
      $environmentId: ID!
    ) {
      claimDevice(
        unclaimedDeviceId: $unclaimedDeviceId
        name: $name
        environmentId: $environmentId
      ) {
        id
        name
      }
    }
  `,
  {
    name: "ClaimDevice",
  }
)(withMobileDialog({ breakpoint: "xs" })(AddDevice))
