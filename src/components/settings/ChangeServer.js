import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Icon from "@material-ui/core/Icon"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import IconButton from "@material-ui/core/IconButton"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import withMobileDialog from "@material-ui/core/withMobileDialog"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import isUrl from "nice-is-url"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class ChangeServer extends React.Component {
  state = { url: "", newServerOpen: false }

  selectUrl = url => {
    if (typeof Storage !== "undefined") {
      localStorage.setItem("server", url)
      localStorage.setItem("bearer", "")
      this.props.forceUpdate()
    }

    !this.props.isUnauthenticated && this.props.logOut()
  }

  addServer = () => {
    let url = this.state.url
    if (url.substring(0, 4) && url.substring(0, 4) !== "http") {
      url = "https://" + url
    }

    typeof Storage !== "undefined" &&
      (localStorage.getItem("serverList") && isUrl(url)
        ? localStorage.setItem(
            "serverList",
            JSON.stringify([
              { name: this.state.name, url },
              ...JSON.parse(localStorage.getItem("serverList")),
            ])
          )
        : localStorage.setItem(
            "serverList",
            JSON.stringify([{ name: this.state.name, url }])
          ))
  }

  deleteServer = url => {
    localStorage.getItem("serverList") &&
      localStorage.setItem(
        "serverList",
        JSON.stringify(
          JSON.parse(localStorage.getItem("serverList")).filter(
            server => server.url !== url
          )
        )
      )

    if (
      typeof Storage !== "undefined" &&
      localStorage.getItem("server") !== "https://bering.igloo.ooo"
    )
      this.selectUrl("https://bering.igloo.ooo")

    this.forceUpdate()
  }

  serverListContainsItem = () => {
    return (
      (typeof Storage !== "undefined" &&
        JSON.parse(localStorage.getItem("serverList")) &&
        JSON.parse(localStorage.getItem("serverList")).some(
          server => server.url === this.state.url
        )) ||
      (typeof Storage !== "undefined" &&
        JSON.parse(localStorage.getItem("serverList")) &&
        JSON.parse(localStorage.getItem("serverList")).some(
          server => server.url === "https://" + this.state.url
        ))
    )
  }

  render() {
    const dialogList =
      typeof Storage !== "undefined" &&
      localStorage.getItem("serverList") &&
      JSON.parse(localStorage.getItem("serverList")).map(server => (
        <ListItem
          button
          selected={localStorage.getItem("server") === server.url}
          onClick={() =>
            typeof Storage !== "undefined" &&
            localStorage.getItem("server") !== server.url &&
            this.selectUrl(server.url)
          }
        >
          <ListItemIcon>
            <Icon>cloud</Icon>
          </ListItemIcon>
          <ListItemText
            primary={
              <font
                style={
                  !this.props.unauthenticated &&
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : { color: "black" }
                }
              >
                {server.name}
              </font>
            }
            secondary={
              <font
                style={
                  !this.props.unauthenticated &&
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "#c1c2c5" }
                    : { color: "#7a7a7a" }
                }
              >
                {server.url}
              </font>
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => this.deleteServer(server.url)}
              style={
                !this.props.unauthenticated &&
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
            >
              <Icon>delete</Icon>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))

    const dialog = (
      <React.Fragment>
        <Dialog
          open={
            typeof Storage !== "undefined" &&
            this.props.open &&
            !this.state.newServerOpen
          }
          onClose={this.props.close}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Change connected server</DialogTitle>
          <div style={{ height: "100%" }}>
            <List
              style={{
                padding: "0",
              }}
            >
              <ListItem
                button
                selected={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("server") === "https://bering.igloo.ooo"
                }
                onClick={() =>
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("server") !==
                    "https://bering.igloo.ooo" &&
                  this.selectUrl("https://bering.igloo.ooo")
                }
              >
                <ListItemIcon>
                  <Icon>cloud_done</Icon>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <font
                      style={
                        !this.props.unauthenticated &&
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Default server
                    </font>
                  }
                  secondary={<font>https://bering.igloo.ooo</font>}
                />
              </ListItem>
              {dialogList}
              <ListItem
                button
                onClick={() =>
                  this.setState({
                    newServerOpen: true,
                  })
                }
              >
                <ListItemIcon>
                  <Icon>add</Icon>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <font
                      style={
                        !this.props.unauthenticated &&
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      New server
                    </font>
                  }
                />
              </ListItem>
            </List>
          </div>
          <DialogActions>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.newServerOpen}
          onClose={() =>
            this.setState({
              newServerOpen: false,
              url: "",
              urlEmpty: false,
              name: "",
              nameEmpty: false,
            })
          }
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Change connected server</DialogTitle>
          <div style={{ height: "100%", padding: "0 24px" }}>
            <TextField
              id="custom-server-name"
              label="Server name"
              value={this.state.name}
              variant="outlined"
              error={this.state.nameEmpty || this.state.nameError}
              helperText={
                this.state.nameEmpty
                  ? "This field is required"
                  : this.state.nameError || " "
              }
              onChange={event =>
                this.setState({
                  name: event.target.value,
                  nameEmpty: event.target.value === "",
                  nameError: "",
                })
              }
              onKeyPress={event => {
                if (
                  event.key === "Enter" &&
                  this.state.name &&
                  this.state.url &&
                  typeof Storage !== "undefined" &&
                  !this.serverListContainsItem() &&
                  isUrl(this.state.url) &&
                  this.state.url !== "https://bering.igloo.ooo" &&
                  this.state.url !== "bering.igloo.ooo" &&
                  this.state.url !== "http://bering.igloo.ooo" &&
                  this.state.url !== "http://bering.igloo.ooo/" &&
                  this.state.url !== "bering.igloo.ooo/" &&
                  this.state.url !== "https://bering.igloo.ooo/"
                ) {
                  this.addServer()
                  this.setState({
                    newServerOpen: false,
                    url: "",
                    urlEmpty: false,
                    name: "",
                    nameEmpty: false,
                  })
                }
              }}
              style={{
                marginTop: "16px",
                width: "100%",
              }}
              InputLabelProps={this.state.name && { shrink: true }}
              InputProps={{
                endAdornment: this.state.name && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        this.setState({ name: "" })
                      }}
                      style={
                        !this.props.unauthenticated &&
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(255, 255, 255, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                      tabIndex="-1"
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="custom-server-url"
              label="Server URL"
              value={this.state.url}
              variant="outlined"
              error={this.state.urlEmpty || this.state.urlError}
              helperText={
                this.state.urlEmpty
                  ? "This field is required"
                  : this.state.urlError || " "
              }
              onChange={event =>
                this.setState({
                  url: event.target.value,
                  urlEmpty: event.target.value === "",
                  urlError: "",
                })
              }
              onKeyPress={event => {
                if (
                  event.key === "Enter" &&
                  this.state.name &&
                  this.state.url &&
                  typeof Storage !== "undefined" &&
                  !this.serverListContainsItem() &&
                  isUrl(this.state.url) &&
                  this.state.url !== "https://bering.igloo.ooo" &&
                  this.state.url !== "bering.igloo.ooo" &&
                  this.state.url !== "http://bering.igloo.ooo"
                ) {
                  this.addServer()
                  this.setState({
                    newServerOpen: false,
                    url: "",
                    urlEmpty: false,
                    name: "",
                    nameEmpty: false,
                  })
                }
              }}
              style={{
                marginTop: "16px",
                width: "100%",
              }}
              InputLabelProps={this.state.url && { shrink: true }}
              InputProps={{
                endAdornment: this.state.url && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        this.setState({ url: "" })
                      }}
                      style={
                        !this.props.unauthenticated &&
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "rgba(255, 255, 255, 0.46)" }
                          : { color: "rgba(0, 0, 0, 0.46)" }
                      }
                      tabIndex="-1"
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <DialogActions>
            <Button
              onClick={() =>
                this.setState({
                  newServerOpen: false,
                  url: "",
                  urlEmpty: false,
                  name: "",
                  nameEmpty: false,
                })
              }
              style={{ marginRight: "4px" }}
            >
              Never mind
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.addServer()
                this.setState({
                  newServerOpen: false,
                  url: "",
                  urlEmpty: false,
                  name: "",
                  nameEmpty: false,
                })
              }}
              disabled={
                !this.state.name ||
                !this.state.url ||
                typeof Storage === "undefined" ||
                this.serverListContainsItem() ||
                !isUrl(this.state.url) ||
                this.state.url === "https://bering.igloo.ooo" ||
                this.state.url === "bering.igloo.ooo" ||
                this.state.url === "http://bering.igloo.ooo"
              }
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )

    return this.props.unauthenticated ? (
      <MuiThemeProvider
        theme={createMuiTheme({
          palette: {
            default: { main: "#fff" },
            primary: { light: "#0083ff", main: "#0057cb" },
            secondary: { main: "#ff4081" },
            error: { main: "#f44336" },
          },
          overrides: {
            MuiDialogTitle: {
              root: {
                fontSize: "1.3125rem",
                lineHeight: "1.16667em",
                fontWeight: 500,
                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
              },
            },
            MuiButton: {
              containedPrimary: {
                backgroundColor: "#0083ff",
              },
            },
            MuiListItemIcon: {
              root: {
                color: "black",
              },
            },
            MuiDialogActions: {
              action: {
                marginRight: "4px",
              },
            },
          },
        })}
      >
        {dialog}
      </MuiThemeProvider>
    ) : (
      dialog
    )
  }
}

export default withMobileDialog({ breakpoint: "xs" })(ChangeServer)
