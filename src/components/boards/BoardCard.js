import React, { Component } from "react"
import { Link } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {
  Icon,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  MuiThemeProvider,
  Badge,
  createMuiTheme,
  Paper,
  Typography,
  Toolbar,
} from "@material-ui/core"
import DeleteBoard from "./DeleteBoard"
import RenameBoard from "./RenameBoard"
import BoardInfo from "./BoardInfo"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import iceberg from "../../styles/assets/iceberg.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"

class BoardCard extends Component {
  state = { deleteOpen: false, renameOpen: false }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  toggleFavorite = favorite =>
    this.props.ToggleFavorite({
      variables: {
        id: this.props.board.id,
        favorite,
      },
      optimisticResponse: {
        __typename: "Mutation",
        board: {
          id: this.props.board.id,
          favorite,
          __typename: "Board",
        },
      },
    })

  toggleQuietMode = quietMode =>
    this.props.ToggleQuietMode({
      variables: {
        id: this.props.board.id,
        quietMode,
      },
      optimisticResponse: {
        __typename: "Mutation",
        board: {
          id: this.props.board.id,
          quietMode,
          __typename: "Board",
        },
      },
    })

  render() {
    return (
      <React.Fragment>
        <Paper
          style={
            this.props.nightMode
              ? { backgroundColor: "#2f333d", width: "256px", height: "192px" }
              : { backgroundColor: "#fff", width: "256px", height: "192px" }
          }
        >
          <Toolbar
            style={{
              height: "64px",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <Link
              to={"/dashboard?board=" + this.props.board.id}
              style={
                this.props.nightMode
                  ? { color: "white", textDecoration: "none" }
                  : { color: "black", textDecoration: "none" }
              }
            >
              <Typography
                variant="title"
                className="notSelectable"
                style={
                  this.props.nightMode
                    ? {
                        color: "white",
                        marginLeft: "-8px",
                      }
                    : {
                        color: "black",
                        marginLeft: "-8px",
                      }
                }
              >
                {this.props.board.customName}
              </Typography>
            </Link>
            <MuiThemeProvider
              theme={createMuiTheme({
                palette: {
                  primary: { main: "#ff4081" },
                },
              })}
            >
              {this.props.board.notificationsCount ? (
                <Badge
                  badgeContent={this.props.board.notificationsCount}
                  color="primary"
                  style={{ marginLeft: "24px" }}
                />
              ) : (
                ""
              )}
            </MuiThemeProvider>
            <Tooltip
              id="tooltip-bottom"
              title="Add to favourites"
              placement="bottom"
            >
              <IconButton
                style={{ marginRight: "0", marginLeft: "auto" }}
                onClick={() => this.toggleFavorite(!this.props.board.favorite)}
              >
                <Icon
                  style={
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  {this.props.board.favorite ? "favorite" : "favorite_border"}
                </Icon>
              </IconButton>
            </Tooltip>
            <Tooltip id="tooltip-bottom" title="More" placement="bottom">
              <IconButton
                onClick={this.handleMenuOpen}
                style={{
                  marginRight: "-16px",
                  marginLeft: "0",
                }}
              >
                <Icon
                  style={
                    this.props.nightMode
                      ? {
                          color: "white",
                        }
                      : {
                          color: "black",
                        }
                  }
                >
                  more_vert
                </Icon>
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Link
            to={"/dashboard?board=" + this.props.board.id}
            style={
              this.props.nightMode
                ? { color: "white", textDecoration: "none" }
                : { color: "black", textDecoration: "none" }
            }
          >
            {this.props.board.avatar === "iceberg" && (
              <img
                src={iceberg}
                alt="Iceberg"
                className="notSelectable"
                style={{
                  width: "100%",
                  height: "128px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              />
            )}
            {this.props.board.avatar === "northernLights" && (
              <img
                src={northernLights}
                alt="Northern lights"
                className="notSelectable"
                style={{
                  width: "100%",
                  height: "128px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
                tifi
              />
            )}
          </Link>
        </Paper>
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
              this.setState({ infoOpen: true })
              this.handleMenuClose()
            }}
          >
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
                      title: this.props.board.customName + " on Igloo Aurora",
                      url:
                        window.location.href + "?board=" + this.props.board.id,
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
              text={window.location.href + "?board=" + this.props.board.id}
            >
              <MenuItem
                className="notSelectable"
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
                onClick={() => {
                  this.setState({ anchorEl: null })
                  this.props.showMessage()
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
          <Divider />
          <MenuItem
            className="notSelectable"
            style={
              this.props.nightMode ? { color: "white" } : { color: "black" }
            }
            onClick={() => {
              this.toggleQuietMode(this.props.board.quietMode ? false : true)
              this.handleMenuClose()
            }}
          >
            <ListItemIcon>
              <Icon
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                {this.props.board.quietMode
                  ? "notifications"
                  : "notifications_off"}
              </Icon>
            </ListItemIcon>
            <ListItemText
              inset
              primary={this.props.board.quietMode ? "Unmute" : "Mute"}
            />
          </MenuItem>
          <Divider />
          <MenuItem
            className="notSelectable"
            style={
              this.props.nightMode ? { color: "white" } : { color: "black" }
            }
            onClick={() => {
              this.setState({ renameOpen: true })
              this.handleMenuClose()
            }}
          >
            <ListItemIcon>
              <Icon
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                mode_edit
              </Icon>
            </ListItemIcon>
            <ListItemText inset primary="Rename" />
          </MenuItem>
          <MenuItem
            className="notSelectable"
            style={
              this.props.nightMode ? { color: "white" } : { color: "black" }
            }
            onClick={() => {
              this.setState({ deleteOpen: true })
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
        <BoardInfo
          open={this.state.infoOpen}
          close={() => this.setState({ infoOpen: false })}
          board={this.props.board}
          devMode={this.props.devMode}
        />
        <RenameBoard
          open={this.state.renameOpen}
          close={() => this.setState({ renameOpen: false })}
          board={this.props.board}
        />
        <DeleteBoard
          open={this.state.deleteOpen}
          close={() => this.setState({ deleteOpen: false })}
          board={this.props.board}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ToggleFavorite($id: ID!, $favorite: Boolean) {
      board(id: $id, favorite: $favorite) {
        id
        favorite
      }
    }
  `,
  {
    name: "ToggleFavorite",
  }
)(
  graphql(
    gql`
      mutation ToggleQuietMode($id: ID!, $quietMode: Boolean) {
        board(id: $id, quietMode: $quietMode) {
          id
          quietMode
        }
      }
    `,
    {
      name: "ToggleQuietMode",
    }
  )(BoardCard)
)
