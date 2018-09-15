import React from "react"
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton,
  Icon,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Dialog,
  DialogTitle,
  DialogActions,
  Grow,
  Slide
} from "@material-ui/core"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#f44336" },
  },
})

function Transition(props) {
  return window.innerWidth > 900 ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ShareBoard extends React.Component {
  state = { menuOpen: false, menuTarget: null }

  getInitials = string => {
    if (string) {
      var names = string.trim().split(" "),
        initials = names[0].substring(0, 1).toUpperCase()

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < 900}
      >
        <DialogTitle style={{ width: "350px" }}>Share board</DialogTitle>
        <Typography variant="Title" style={{ paddingLeft: "24px" }}>
          This board is shared with:
        </Typography>
        <List subheader={<li />} style={{ overflow: "auto" }}>
          <li key="Owner">
            <ul style={{ padding: "0" }}>
              <ListSubheader style={{ backgroundColor: "white" }}>
                Owner
              </ListSubheader>
              {["Test 1"].map(item => (
                <ListItem key={item}>
                  <ListItemAvatar>
                    <Avatar>{this.getInitials(item)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={event =>
                        this.setState({
                          anchorEl: event.currentTarget,
                          menuTarget: item,
                        })
                      }
                    >
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </ul>
          </li>
          <li key="Admins">
            <ul style={{ padding: "0" }}>
              <ListSubheader style={{ backgroundColor: "white" }}>
                Admins
              </ListSubheader>
              {["Test 1"].map(item => (
                <ListItem key={item}>
                  <ListItemAvatar>
                    <Avatar>{this.getInitials(item)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={event =>
                        this.setState({
                          anchorEl: event.currentTarget,
                          menuTarget: item,
                        })
                      }
                    >
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#fff", color: "#000" }}>
                    <Icon>person_add</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add an admin" />
              </ListItem>
            </ul>
          </li>
          <li key="Editors">
            <ul style={{ padding: "0" }}>
              <ListSubheader style={{ backgroundColor: "white" }}>
                Editors
              </ListSubheader>
              {["Test 1"].map(item => (
                <ListItem key={item}>
                  <ListItemAvatar>
                    <Avatar>{this.getInitials(item)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={event =>
                        this.setState({
                          anchorEl: event.currentTarget,
                          menuTarget: item,
                        })
                      }
                    >
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#fff", color: "#000" }}>
                    <Icon>person_add</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add an editor" />
              </ListItem>
            </ul>
          </li>
          <li key="Spectators">
            <ul style={{ padding: "0" }}>
              <ListSubheader style={{ backgroundColor: "white" }}>
                Spectators
              </ListSubheader>
              {["Test 1"].map(item => (
                <ListItem key={item}>
                  <ListItemAvatar>
                    <Avatar>{this.getInitials(item)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={event =>
                        this.setState({
                          anchorEl: event.currentTarget,
                          menuTarget: item,
                        })
                      }
                    >
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <ListItem>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: "#fff", color: "#000" }}>
                    <Icon>person_add</Icon>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Add a spectator" />
              </ListItem>
            </ul>
          </li>
        </List>
        <Menu
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
          <MenuItem>
            <ListItemIcon>
              <Icon
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                edit
              </Icon>
            </ListItemIcon>
            <ListItemText inset primary="Change role" />
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Icon style={{ color: "#f44336" }}>remove_circle</Icon>
            </ListItemIcon>
            <ListItemText inset>
              <span style={{ color: "#f44336" }}>Stop sharing</span>
            </ListItemText>
          </MenuItem>
        </Menu>
        <DialogActions>
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close}>Close</Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}
