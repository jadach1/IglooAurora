import React from "react"
import Dialog from "material-ui/Dialog"
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
  ListItemIcon
} from "@material-ui/core"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#f44336" },
  },
})

export default class SahreBoard extends React.Component {
  showMenu() {
    return(
      <Menu>
        <MenuItem>
        <ListItemIcon>
              <Icon
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                info
              </Icon>
            </ListItemIcon>
            <ListItemText inset primary="Information" />
        </MenuItem>
        </Menu>
    )
  }

  render() {
    const shareBoardActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close}>Close</Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Share board"
        actions={shareBoardActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable defaultCursor"
        contentStyle={{
          width: "350px",
        }}
        bodyStyle={{
          padding: "0",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        <Typography variant="Title" style={{ paddingLeft: "24px" }}>
          This board is shared with:
        </Typography>
        <List subheader={<li />} style={{ height: "200px", overflow: "auto" }}>
          <li key="Owner">
            <ul style={{ padding: "0" }}>
              <ListSubheader style={{ backgroundColor: "white" }}>
                Owner
              </ListSubheader>
              {["Test 1"].map(item => (
                <ListItem key={item}>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={()=>this.showMenu()}>
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
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </ul>
          </li>
          <li key="Editors">
            <ul style={{ padding: "0" }}>
              <ListSubheader style={{ backgroundColor: "white" }}>
                Editors
              </ListSubheader>
              {["Test 1"].map(item => (
                <ListItem key={item}>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </ul>
          </li>
          <li key="Spectators">
            <ul style={{ padding: "0" }}>
              <ListSubheader style={{ backgroundColor: "white" }}>
                Spectators
              </ListSubheader>
              {["Test 1"].map(item => (
                <ListItem key={item}>
                  <ListItemText primary={item} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <Icon>more_vert</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </ul>
          </li>
        </List>
      </Dialog>
    )
  }
}
