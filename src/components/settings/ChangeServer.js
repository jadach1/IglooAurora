import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
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
import isUrl from "is-url"
import Cloud from "@material-ui/icons/Cloud"
import Delete from "@material-ui/icons/Delete"
import CloudDone from "@material-ui/icons/CloudDone"
import Add from "@material-ui/icons/Add"
import Clear from "@material-ui/icons/Clear"
import MoreVert from "@material-ui/icons/MoreVert"
import Create from "@material-ui/icons/Create"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

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
      localStorage.setItem("accountList", "[]")
      this.props.forceUpdate()
    }

    !this.props.isUnauthenticated && this.props.logOut()
  }

  addServer = () => {
    let url = this.state.url
    if (url.substring(0, 4) && url.substring(0, 4) !== "http") {
      url = "https://" + url
    }

    if (typeof Storage !== "undefined") {
      localStorage.setItem("server", url)

      isUrl(url) &&
        (localStorage.getItem("serverList")
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
  }

  editServer = () => {
    let url = this.state.editUrl
    if (url.substring(0, 4) && url.substring(0, 4) !== "http") {
      url = "https://" + url
    }

    if (typeof Storage !== "undefined") {
      localStorage.setItem("server", url)

      if (isUrl(url) && localStorage.getItem("serverList")) {
        let tempList = JSON.parse(localStorage.getItem("serverList"))
        tempList.forEach(server => {
          if (server.url === this.state.menuTarget.url) {
            server.url = this.state.editUrl
            server.name = this.state.editName
          }
        })

        localStorage.setItem("serverList", JSON.stringify(tempList))
      }
    }
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
            <Cloud />
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
              onClick={event =>
                this.setState({
                  menuTarget: server,
                  anchorEl: event.currentTarget,
                })
              }
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "white" }
                  : { color: "black" }
              }
            >
              <MoreVert />
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
            !this.state.newServerOpen &&
            !this.state.editServerOpen
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
                  <CloudDone />
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
                      https://bering.igloo.ooo
                    </font>
                  }
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
                  <Add />
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
          <DialogTitle disableTypography>Add server</DialogTitle>
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
                      <Clear />
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
                      <Clear />
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
        <Dialog
          open={this.state.editServerOpen}
          onClose={() =>
            this.setState({
              editServerOpen: false,
              editUrl: "",
              editUrlEmpty: false,
              editName: "",
              editNameEmpty: false,
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
          <DialogTitle disableTypography>Edit server</DialogTitle>
          <div style={{ height: "100%", padding: "0 24px" }}>
            <TextField
              id="edit-custom-server-name"
              label="Server name"
              value={this.state.editName}
              variant="outlined"
              error={this.state.editNameEmpty || this.state.editNameError}
              helperText={
                this.state.editNameEmpty
                  ? "This field is required"
                  : this.state.editNameError || " "
              }
              onChange={event =>
                this.setState({
                  editName: event.target.value,
                  editNameEmpty: event.target.value === "",
                  editNameError: "",
                })
              }
              onKeyPress={event => {
                if (
                  event.key === "Enter" &&
                  this.state.editName &&
                  this.state.editUrl &&
                  typeof Storage !== "undefined" &&
                  isUrl(this.state.editUrl) &&
                  this.state.editUrl !== "https://bering.igloo.ooo" &&
                  this.state.editUrl !== "bering.igloo.ooo" &&
                  this.state.editUrl !== "http://bering.igloo.ooo" &&
                  this.state.editUrl !== "http://bering.igloo.ooo/" &&
                  this.state.editUrl !== "bering.igloo.ooo/" &&
                  this.state.editUrl !== "https://bering.igloo.ooo/"
                ) {
                  this.editServer()
                  this.setState({
                    editServerOpen: false,
                    editUrl: "",
                    editUrlEmpty: false,
                    editName: "",
                    editNameEmpty: false,
                  })
                }
              }}
              style={{
                marginTop: "16px",
                width: "100%",
              }}
              InputLabelProps={this.state.editName && { shrink: true }}
              InputProps={{
                endAdornment: this.state.editName && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        this.setState({ editName: "" })
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
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="edit-custom-server-url"
              label="Server URL"
              value={this.state.editUrl}
              variant="outlined"
              error={this.state.editUrlEmpty || this.state.editUrlError}
              helperText={
                this.state.editUrlEmpty
                  ? "This field is required"
                  : this.state.editUrlError || " "
              }
              onChange={event =>
                this.setState({
                  editUrl: event.target.value,
                  editUrlEmpty: event.target.value === "",
                  editUrlError: "",
                })
              }
              onKeyPress={event => {
                if (
                  event.key === "Enter" &&
                  this.state.editName &&
                  this.state.editUrl &&
                  typeof Storage !== "undefined" &&
                  isUrl(this.state.editUrl) &&
                  this.state.editUrl !== "https://bering.igloo.ooo" &&
                  this.state.editUrl !== "bering.igloo.ooo" &&
                  this.state.editUrl !== "http://bering.igloo.ooo"
                ) {
                  this.editServer()
                  this.setState({
                    editServerOpen: false,
                    editUrl: "",
                    editUrlEmpty: false,
                    editName: "",
                    editNameEmpty: false,
                  })
                }
              }}
              style={{
                marginTop: "16px",
                width: "100%",
              }}
              InputLabelProps={this.state.editUrl && { shrink: true }}
              InputProps={{
                endAdornment: this.state.editUrl && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        this.setState({ editUrl: "" })
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
                      <Clear />
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
                  editServerOpen: false,
                  editUrl: "",
                  editUrlEmpty: false,
                  editName: "",
                  editameEmpty: false,
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
                this.editServer()
                this.setState({
                  editServerOpen: false,
                  editUrl: "",
                  editUrlEmpty: false,
                  editName: "",
                  editNameEmpty: false,
                })
              }}
              disabled={
                !this.state.editName ||
                !this.state.editUrl ||
                typeof Storage === "undefined" ||
                !isUrl(this.state.editUrl) ||
                this.state.editUrl === "https://bering.igloo.ooo" ||
                this.state.editUrl === "bering.igloo.ooo" ||
                this.state.editUrl === "http://bering.igloo.ooo"
              }
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
        <Menu
          id="server-menu-target"
          anchorEl={this.state.anchorEl}
          open={this.state.anchorEl}
          onClose={() => this.setState({ anchorEl: null })}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() =>
              this.setState({
                editServerOpen: true,
                anchorEl: false,
                editName: this.state.menuTarget.name,
                editUrl: this.state.menuTarget.url,
              })
            }
          >
            <ListItemIcon>
              <Create />
            </ListItemIcon>
            <ListItemText
              inset
              primary={
                <span
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  Edit
                </span>
              }
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.deleteServer(this.state.menuTarget.url)
              this.setState({ anchorEl: false })
            }}
          >
            <ListItemIcon>
              <Delete style={{ color: "#f44336" }} />
            </ListItemIcon>
            <ListItemText inset>
              <span style={{ color: "#f44336" }}>Delete</span>
            </ListItemText>
          </MenuItem>
        </Menu>
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
            MuiList: {
              padding: {
                paddingTop: 0,
                paddingBottom: 0,
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
