import React, { Component } from "react"
import { Link } from "react-router-dom"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Toolbar from "@material-ui/core/Toolbar"
import DeleteEnvironment from "./DeleteEnvironment"
import CustomizeEnvironment from "./CustomizeEnvironment"
import EnvironmentInfo from "./EnvironmentInfo"
import ShareEnvironment from "./ShareEnvironment"
import LeaveEnvironment from "./LeaveEnvironment"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import fox from "../../styles/assets/fox.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"
import denali from "../../styles/assets/denali.jpg"
import puffin from "../../styles/assets/puffin.jpg"
import treetops from "../../styles/assets/treetops.jpg"

class EnvironmentCard extends Component {
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
        id: this.props.environment.id,
        favorite,
      },
      optimisticResponse: {
        __typename: "Mutation",
        environment: {
          id: this.props.environment.id,
          favorite,
          __typename: "Environment",
        },
      },
    })

  toggleQuietMode = muted =>
    this.props.ToggleQuietMode({
      variables: {
        id: this.props.environment.id,
        muted,
      },
      optimisticResponse: {
        __typename: "Mutation",
        environment: {
          id: this.props.environment.id,
          muted,
          __typename: "Environment",
        },
      },
    })

  render() {
    let isShared =
      this.props.environment.myRole === "OWNER" &&
      (this.props.environment.admins[0] ||
        this.props.environment.editors[0] ||
        this.props.environment.spectators[0])

    return (
      <React.Fragment>
        <Paper
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
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
              to={"/?environment=" + this.props.environment.id}
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      color: "white",
                      textDecoration: "none",
                      height: "64px",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                    }
                  : {
                      color: "black",
                      textDecoration: "none",
                      height: "64px",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                    }
              }
            >
              <div
                style={{
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  paddingLeft: "16px",
                  width: "240px",
                }}
              >
                <Typography
                  variant="h6"
                  className="notSelectable"
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? {
                          color: "white",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          lineHeight: "64px",
                          width: "184px",
                        }
                      : {
                          color: "black",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          lineHeight: "64px",
                          width: "184px",
                        }
                  }
                >
                  {isShared && (
                    <Icon style={{ marginRight: "8px", marginBottom: "-5px" }}>
                      group
                    </Icon>
                  )}
                  {this.props.environment.name}
                </Typography>
              </div>
            </Link>
            <div
              style={{
                marginLeft: "-56px",
                borderRadius: "50%",
              }}
            >
              <Tooltip id="tooltip-bottom" title="More" placement="bottom">
                <IconButton onClick={this.handleMenuOpen}>
                  <Icon
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
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
            </div>
          </Toolbar>
          <Link
            to={"/?environment=" + this.props.environment.id}
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? { color: "white", textDecoration: "none" }
                : { color: "black", textDecoration: "none" }
            }
          >
            {this.props.environment.avatar === "DENALI" && (
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
            {this.props.environment.avatar === "FOX" && (
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
            {this.props.environment.avatar === "TREETOPS" && (
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
            {this.props.environment.avatar === "PUFFIN" && (
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
            {this.props.environment.avatar === "NORTHERN_LIGHTS" && (
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
            onClick={() => {
              this.setState({ infoOpen: true })
              this.handleMenuClose()
            }}
          >
            <ListItemIcon>
              <Icon>info</Icon>
            </ListItemIcon>
            <ListItemText inset primary="Information" disableTypography />
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              this.setState({ anchorEl: null })
              this.setState({ shareOpen: true })
            }}
          >
            <ListItemIcon>
              <Icon>share</Icon>
            </ListItemIcon>
            <ListItemText inset primary="Share" disableTypography />
          </MenuItem>
          {!(
            this.props.userData.user.email ===
            this.props.environment.owner.email
          ) && (
            <MenuItem
              onClick={() => {
                this.setState({ leaveOpen: true })
                this.handleMenuClose()
              }}
            >
              <ListItemIcon>
                <Icon>remove_circle</Icon>
              </ListItemIcon>
              <ListItemText
                inset
                primary="Leave"
                disableTypography
              />
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={() => {
              this.toggleQuietMode(this.props.environment.muted ? false : true)
              this.handleMenuClose()
            }}
            disabled={
              this.props.userData.user && this.props.userData.user.quietMode
            }
          >
            <ListItemIcon>
              <Icon>
                {this.props.environment.muted
                  ? "notifications"
                  : "notifications_off"}
              </Icon>
            </ListItemIcon>
            <ListItemText
              inset
              primary={this.props.environment.muted ? "Unmute" : "Mute"}
              disableTypography
            />
          </MenuItem>
          {this.props.environment.myRole !== "SPECTATOR" && (
            <React.Fragment>
              <Divider />
              <MenuItem
                onClick={() => {
                  this.setState({ renameOpen: true })
                  this.handleMenuClose()
                }}
              >
                <ListItemIcon>
                  <Icon>mode_edit</Icon>
                </ListItemIcon>
                <ListItemText inset primary="Customize" disableTypography />
              </MenuItem>
            </React.Fragment>
          )}
          {(this.props.environment.myRole === "OWNER" ||
            this.props.environment.myRole === "ADMIN") && (
            <MenuItem
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
        <EnvironmentInfo
          open={this.state.infoOpen}
          close={() => this.setState({ infoOpen: false })}
          environment={this.props.environment}
          devMode={this.props.devMode}
        />
        <CustomizeEnvironment
          open={this.state.renameOpen}
          close={() => this.setState({ renameOpen: false })}
          environment={this.props.environment}
        />
        <DeleteEnvironment
          open={this.state.deleteOpen}
          close={() => this.setState({ deleteOpen: false })}
          environment={this.props.environment}
        />
        <ShareEnvironment
          open={this.state.shareOpen}
          close={() => this.setState({ shareOpen: false })}
          environment={this.props.environment}
          userData={this.props.userData}
          nightMode={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
          }
          client={this.props.client}
        />
        <LeaveEnvironment
          open={this.state.leaveOpen}
          close={() => this.setState({ leaveOpen: false })}
          environment={this.props.environment}
          userData={this.props.userData}
          nightMode={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
          }
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ToggleQuietMode($id: ID!, $muted: Boolean) {
      environment(id: $id, muted: $muted) {
        id
        muted
      }
    }
  `,
  {
    name: "ToggleQuietMode",
  }
)(EnvironmentCard)
