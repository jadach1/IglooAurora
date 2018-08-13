import React, { Component } from "react"
import { Link } from "react-router-dom"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {
  Icon,
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
  Divider,
} from "@material-ui/core"
import DeleteBoard from "./DeleteBoard"
import RenameBoard from "./RenameBoard"
import BoardInfo from "./BoardInfo"

export default class BoardCard extends Component {
  state = { deleteOpen: false, renameOpen: false, infoOpen: false }

  handleMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
  }

  render() {
    return (
      <React.Fragment>
        <Card
          style={
            this.props.nightMode
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
                      this.props.nightMode
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    more_vert
                  </Icon>
                </IconButton>
              </Tooltip>
            }
            title={
              <Link
                to={"/dashboard?board=" + this.props.board.id}
                style={
                  this.props.nightMode
                    ? { color: "white", textDecoration: "none" }
                    : { color: "black", textDecoration: "none" }
                }
              >
                {this.props.board.customName}
              </Link>
            }
            subheader={
              <Link
                to={"/dashboard?board=" + this.props.board.id}
                style={
                  this.props.nightMode
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
                    this.props.nightMode
                      ? { color: "white" }
                      : { color: "black" }
                  }
                >
                  favorite_border
                </Icon>
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
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
          <Divider />
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
                  this.props.nightMode ? { color: "white" } : { color: "black" }
                }
              >
                notifications_off
              </Icon>
            </ListItemIcon>
            <ListItemText inset primary="Mute" />
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
