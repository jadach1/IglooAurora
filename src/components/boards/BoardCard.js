import React, { Component } from "react"
import { Link } from "react-router-dom"
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
import ShareBoard from "./ShareBoard"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import fox from "../../styles/assets/fox.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"
import denali from "../../styles/assets/denali.jpg"
import puffin from "../../styles/assets/puffin.jpg"
import treetops from "../../styles/assets/treetops.jpg"

class BoardCard extends Component {
  state = { deleteOpen: false, renameOpen: false, shareOpen: false }

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
              ? {
                  backgroundColor: "#2f333d",
                  width: "256px",
                  height: "192px",
                }
              : {
                  backgroundColor: "#fff",
                  width: "256px",
                  height: "192px",
                }
          }
        >
          <Toolbar
            style={{
              height: "64px",
              paddingLeft: "0",
              paddingRight: "24px",
            }}
          >
            <Link
              to={"/dashboard?board=" + this.props.board.id}
              style={
                this.props.nightMode
                  ? {
                      color: "white",
                      textDecoration: "none",
                      height: "64px",
                      paddingLeft: "24px",
                    }
                  : {
                      color: "black",
                      textDecoration: "none",
                      height: "64px",
                      paddingLeft: "24px",
                    }
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
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: "136px",
                        marginRight: "23px",
                        lineHeight: "64px",
                      }
                    : {
                        color: "black",
                        marginLeft: "-8px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        width: "136px",
                        marginRight: "23px",
                        lineHeight: "64px",
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
                />
              ) : (
                ""
              )}
            </MuiThemeProvider>
            <Tooltip id="tooltip-bottom" title="More" placement="bottom">
              <IconButton
                onClick={this.handleMenuOpen}
                style={{
                  marginLeft: "23px",
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
            {this.props.board.avatar === "DENALI" && (
              <img
                src={denali}
                alt="Mt. Denali"
                className="notSelectable"
                style={{
                  width: "100%",
                  height: "128px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              />
            )}
            {this.props.board.avatar === "FOX" && (
              <img
                src={fox}
                alt="Fox"
                className="notSelectable"
                style={{
                  width: "100%",
                  height: "128px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              />
            )}
            {this.props.board.avatar === "TREETOPS" && (
              <img
                src={treetops}
                alt="treetops"
                className="notSelectable"
                style={{
                  width: "100%",
                  height: "128px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              />
            )}
            {this.props.board.avatar === "PUFFIN" && (
              <img
                src={puffin}
                alt="Puffin"
                className="notSelectable"
                style={{
                  width: "100%",
                  height: "128px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px",
                }}
              />
            )}
            {this.props.board.avatar === "NORTHERN_LIGHTS" && (
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
          <MenuItem
            className="notSelectable"
            style={
              this.props.nightMode ? { color: "white" } : { color: "black" }
            }
            onClick={() => {
              this.setState({ anchorEl: null })
              this.setState({ shareOpen: true })
            }}
          >
            <ListItemIcon>
              <Icon
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                share
              </Icon>
            </ListItemIcon>
            <ListItemText inset primary="Share" />
          </MenuItem>
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
              this.toggleFavorite(!this.props.board.favorite)
              this.handleMenuClose()
            }}
          >
            <ListItemIcon>
              <Icon
                style={
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                {!this.props.board.favorite ? "star" : "star_border"}
              </Icon>
            </ListItemIcon>
            <ListItemText
              inset
              primary={!this.props.board.favorite ? "Star" : "Unstar"}
            />
          </MenuItem>
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
            <ListItemText inset primary="Customize" />
          </MenuItem>
          {!this.props.lastBoard && (
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
                <span style={{ color: "#f44336" }}>Delete</span>
              </ListItemText>
            </MenuItem>
          )}
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
        <ShareBoard
          open={this.state.shareOpen}
          close={() => this.setState({ shareOpen: false })}
          board={this.props.board}
          nightMode={this.props.nightMode}
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
