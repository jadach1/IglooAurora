import React, { Component } from "react"
import {
  Typography,
  Icon,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core"
import { Link } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
import GetLinkSuccess from "./GetLinkSuccess"
import CenteredSpinner from "./CenteredSpinner"

export default class BoardsBody extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    copyMessageOpen: false,
  }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    const {
      userData: { error, user, loading },
    } = this.props

    let boardsList = ""
    let nightMode = false

    if (loading) {
      boardsList = <CenteredSpinner />
    }

    if (error) {
      boardsList = "Unexpected error"
    }

    if (user) {
      nightMode = user.nightMode

      boardsList = user.boards.map(board => (
        <React.Fragment>
          <Grid key={board.id} item>
            <Card
              style={
                nightMode
                  ? { backgroundColor: "#2f333d" }
                  : { backgroundColor: "#fff" }
              }
            >
              <CardHeader
                action={
                  <Tooltip id="tooltip-bottom" title="More" placement="bottom">
                    <IconButton onClick={this.handleMenuOpen}>
                      <Icon
                        style={
                          nightMode ? { color: "white" } : { color: "black" }
                        }
                      >
                        more_vert
                      </Icon>
                    </IconButton>
                  </Tooltip>
                }
                title={
                  <Link
                    to={"/dashboard?board=" + board.id}
                    style={
                      nightMode
                        ? { color: "white", textDecoration: "none" }
                        : { color: "black", textDecoration: "none" }
                    }
                  >
                    {board.customName}
                  </Link>
                }
                subheader={
                  <Link
                    to={"/dashboard?board=" + board.id}
                    style={
                      nightMode
                        ? {
                            color: "white",
                            opacity: "0.5",
                            textDecoration: "none",
                          }
                        : {
                            color: "black",
                            opacity: "0.5",
                            textDecoration: "none",
                          }
                    }
                  >
                    August 11, 2018
                  </Link>
                }
              />
              <CardMedia
                image="../styles/assets/loginBackground.jpg"
                title="Contemplative Reptile"
                style={{ cursor: "pointer" }}
              />
              <CardActions disableActionSpacing>
                <Tooltip
                  id="tooltip-bottom"
                  title="Add to favourites"
                  placement="bottom"
                >
                  <IconButton style={{ marginRight: "0", marginLeft: "auto" }}>
                    <Icon
                      style={
                        nightMode ? { color: "white" } : { color: "black" }
                      }
                    >
                      favorite_border
                    </Icon>
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            open={this.state.anchorEl}
            onClose={this.handleMenuClose}
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
              className="notSelectable"
              style={
                this.props.nightMode ? { color: "white" } : { color: "black" }
              }
              onClick={() => {
                this.handleMenuClose()
              }}
            >
              <ListItemIcon>
                <Icon
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  info
                </Icon>
              </ListItemIcon>
              <ListItemText inset primary="Information" />
            </MenuItem>
            <MenuItem
              className="notSelectable"
              style={
                this.props.nightMode ? { color: "white" } : { color: "black" }
              }
              onClick={() => {
                this.handleOpen()
                this.handleMenuClose()
              }}
            >
              <ListItemIcon>
                <Icon
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  mode_edit
                </Icon>
              </ListItemIcon>
              <ListItemText inset primary="Rename" />
            </MenuItem>
            {navigator.share ? (
              <MenuItem
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: board.customName + " on Igloo Aurora",
                        url: window.location.href + "?board=" + board.id,
                      })
                      .then(() => console.log("Successful share"))
                      .catch(error => console.log("Error sharing", error))
                  }
                }}
              >
                <ListItemIcon>
                  <Icon
                    style={
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    share
                  </Icon>
                </ListItemIcon>
                <ListItemText inset primary="Share" />
              </MenuItem>
            ) : (
              ""
            )}
            {!navigator.share ? (
              <CopyToClipboard
                text={window.location.href + "?board=" + board.id}
              >
                <MenuItem
                  className="notSelectable"
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                  onClick={() => {
                    this.setState({ anchorEl: null, copyMessageOpen: true })
                  }}
                >
                  <ListItemIcon>
                    <Icon
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      link
                    </Icon>
                  </ListItemIcon>
                  <ListItemText inset primary="Get Link" />
                </MenuItem>
              </CopyToClipboard>
            ) : (
              ""
            )}
            <MenuItem
              className="notSelectable"
              style={nightMode ? { color: "white" } : { color: "black" }}
              onClick={() => {
                this.handleOpen()
                this.handleMenuClose()
              }}
            >
              <ListItemIcon>
                <Icon style={{ color: "#f44336" }}>delete</Icon>
              </ListItemIcon>
              <ListItemText inset>
                <span style={{ color: "#f44336" }}>Delete board</span>
              </ListItemText>
            </MenuItem>
          </Menu>
        </React.Fragment>
      ))
    }

    return (
      <div
        style={
          nightMode
            ? {
                width: "100vw",
                height: "calc(100vh - 64px)",
                backgroundColor: "#21252b",
              }
            : {
                width: "100vw",
                height: "calc(100vh - 64px)",
                backgroundColor: "#f2f2f2",
              }
        }
      >
        <Typography
          variant="display1"
          className="notSelectable defaultCursor"
          style={
            nightMode
              ? {
                  textAlign: "center",
                  paddingTop: "32px",
                  marginBottom: "32px",
                  color: "white",
                }
              : {
                  textAlign: "center",
                  paddingTop: "32px",
                  marginBottom: "32px",
                  color: "black",
                }
          }
        >
          Favorite boards
        </Typography>
        <Typography
          variant="display1"
          className="notSelectable defaultCursor"
          style={
            nightMode
              ? {
                  textAlign: "center",
                  marginTop: "32px",
                  marginBottom: "32px",
                  color: "white",
                }
              : {
                  textAlign: "center",
                  marginTop: "32px",
                  marginBottom: "32px",
                  color: "black",
                }
          }
        >
          Recent boards
        </Typography>
        <Grid
          container
          justify="center"
          spacing={16}
          className="notSelectable defaultCursor"
          style={{ width: "100vw" }}
        >
          {boardsList}
        </Grid>
        <MuiThemeProvider
          theme={createMuiTheme({
            palette: {
              primary: { main: "#ff4081" },
            },
          })}
        >
          <Tooltip id="tooltip-bottom" title="Create board" placement="top">
            <Button
              variant="extendedFab"
              color="primary"
              style={{ position: "absolute", right: "20px", bottom: "20px" }}
              onClick={() => this.setState({ createOpen: true })}
            >
              <Icon style={{ marginRight: "16px" }}>add</Icon>
              Create board
            </Button>
          </Tooltip>
        </MuiThemeProvider>
        <GetLinkSuccess
          mobile={false}
          open={this.state.copyMessageOpen}
          close={() => this.setState({ copyMessageOpen: false })}
        />
      </div>
    )
  }
}
