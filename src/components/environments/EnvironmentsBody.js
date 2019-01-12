import React, { Component } from "react"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import Paper from "@material-ui/core/Paper"
import BottomNavigation from "@material-ui/core/BottomNavigation"
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction"
import AppBar from "@material-ui/core/AppBar"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"
import ButtonBase from "@material-ui/core/ButtonBase"
import SwipeableViews from "react-swipeable-views"
import CenteredSpinner from "../CenteredSpinner"
import EnvironmentCard from "./EnvironmentCard"
import CreateEnvironment from "./CreateEnvironment"
import Helmet from "react-helmet"
import PendingShares from "./PendingShares"
import PendingOwnerChanges from "./PendingOwnerChanges"

export default class EnvironmentsBody extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    pendingSharesOpen: false,
    pendingOwnerChangesOpen: false,
    copyMessageOpen: false,
    searchText: "",
    slideIndex: 0,
  }

  render() {
    const {
      userData: { error, loading, user },
    } = this.props

    let yourEnvironmentsList = ""
    let sharedEnvironmentsList = ""

    let nightMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("nightMode") === "true"

    let devMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("devMode") === "true"

    if (user) {
      yourEnvironmentsList = (
        <Grid
          container
          justify="center"
          spacing={16}
          className="notSelectable defaultCursor"
          style={{
            width: "100%",
            margin: "0",
          }}
        >
          {user.environments
            .filter(environment => environment.myRole === "OWNER")
            .filter(environment =>
              environment.name
                .toLowerCase()
                .includes(this.props.searchText.toLowerCase())
            )
            .map(environment => (
              <Grid key={environment.id} item>
                <EnvironmentCard
                  userData={this.props.userData}
                  environment={environment}
                  nightMode={nightMode}
                  devMode={devMode}
                  showMessage={() => this.setState({ copyMessageOpen: true })}
                  lastEnvironment={!user.environments[1]}
                  client={this.props.client}
                />
              </Grid>
            ))}
          {user.pendingOwnerChanges[0] && (
            <Grid key="pendingEnvironmentShares" item>
              <ButtonBase focusRipple style={{ borderRadius: "4px" }}>
                <Paper
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? {
                          backgroundColor: "#2f333d",
                          width: "256px",
                          height: "192px",
                          cursor: "pointer",
                          textAlign: "center",
                          color: "white",
                        }
                      : {
                          backgroundColor: "#fff",
                          width: "256px",
                          height: "192px",
                          cursor: "pointer",
                          textAlign: "center",
                        }
                  }
                  onClick={() =>
                    this.setState({ pendingOwnerChangesOpen: true })
                  }
                >
                  <div
                    style={{
                      paddingTop: "47px",
                      paddingBottom: "47px",
                    }}
                  >
                    <Icon style={{ fontSize: "64px" }}>people</Icon>
                    <br />
                    <Typography
                      variant="h5"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : {}
                      }
                    >
                      {user.pendingOwnerChanges.length > 99
                        ? "99+ transfer requests"
                        : user.pendingOwnerChanges.length +
                          (user.pendingOwnerChanges.length === 1
                            ? " transfer request"
                            : " transfer requests")}
                    </Typography>
                  </div>
                </Paper>
              </ButtonBase>
            </Grid>
          )}
          <Grid key="create" item>
            <ButtonBase
              focusRipple
              style={{ borderRadius: "4px" }}
              onClick={() => this.setState({ createOpen: true })}
            >
              <Paper
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? {
                        backgroundColor: "#2f333d",
                        width: "256px",
                        height: "192px",
                        cursor: "pointer",
                        textAlign: "center",
                        color: "white",
                        borderRadius: "4px",
                      }
                    : {
                        backgroundColor: "#fff",
                        width: "256px",
                        height: "192px",
                        cursor: "pointer",
                        textAlign: "center",
                        borderRadius: "4px",
                      }
                }
              >
                <div
                  style={{
                    paddingTop: "47px",
                    paddingBottom: "47px",
                    borderRadius: "4px",
                  }}
                >
                  <Icon style={{ fontSize: "64px" }}>add</Icon>
                  <br />
                  <Typography
                    variant="h5"
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "white" }
                        : {}
                    }
                  >
                    New environment
                  </Typography>
                </div>
              </Paper>
            </ButtonBase>
          </Grid>
        </Grid>
      )

      sharedEnvironmentsList = (
        <Grid
          container
          justify="center"
          spacing={16}
          className="notSelectable defaultCursor"
          style={{
            width: "100%",
            margin: "0",
          }}
        >
          {user.environments
            .filter(environment => environment.myRole !== "OWNER")
            .filter(environment =>
              environment.name
                .toLowerCase()
                .includes(this.props.searchText.toLowerCase())
            )
            .map(environment => (
              <Grid key={environment.id} item>
                <EnvironmentCard
                  userData={this.props.userData}
                  environment={environment}
                  nightMode={nightMode}
                  devMode={devMode}
                  showMessage={() => this.setState({ copyMessageOpen: true })}
                  lastEnvironment={!user.environments[1]}
                  client={this.props.client}
                />
              </Grid>
            ))}
          {user.pendingEnvironmentShares[0] && (
            <Grid key="pendingEnvironmentShares" item>
              <ButtonBase focusRipple style={{ borderRadius: "4px" }}>
                <Paper
                  style={
                    typeof Storage !== "undefined" &&
                    localStorage.getItem("nightMode") === "true"
                      ? {
                          backgroundColor: "#2f333d",
                          width: "256px",
                          height: "192px",
                          cursor: "pointer",
                          textAlign: "center",
                          color: "white",
                        }
                      : {
                          backgroundColor: "#fff",
                          width: "256px",
                          height: "192px",
                          cursor: "pointer",
                          textAlign: "center",
                        }
                  }
                  onClick={() => this.setState({ pendingSharesOpen: true })}
                >
                  <div
                    style={{
                      paddingTop: "47px",
                      paddingBottom: "47px",
                    }}
                  >
                    <Icon
                      style={{
                        fontSize: "48px",
                        marginBottom: "8px",
                        marginTop: "8px",
                      }}
                    >
                      share
                    </Icon>
                    <br />
                    <Typography
                      variant="h5"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : {}
                      }
                    >
                      {user.pendingEnvironmentShares.length > 99
                        ? "99+ sharing requests"
                        : user.pendingEnvironmentShares.length +
                          (user.pendingEnvironmentShares.length === 1
                            ? " sharing request"
                            : " sharing requests")}
                    </Typography>
                  </div>
                </Paper>
              </ButtonBase>
            </Grid>
          )}
        </Grid>
      )
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora</title>
        </Helmet>
        {this.props.mobile ? (
          <div
            style={
              nightMode
                ? user &&
                  (user.environments.filter(
                    environment => environment.myRole !== "OWNER"
                  )[0] ||
                    user.pendingEnvironmentShares[0])
                  ? {
                      width: "100vw",
                      height: "calc(100vh - 128px)",
                      backgroundColor: "#21252b",
                    }
                  : {
                      width: "100vw",
                      height: "calc(100vh - 64px)",
                      backgroundColor: "#21252b",
                    }
                : user &&
                  (user.environments.filter(
                    environment => environment.myRole !== "OWNER"
                  )[0] ||
                    user.pendingEnvironmentShares[0])
                ? {
                    width: "100vw",
                    height: "calc(100vh - 128px)",
                    backgroundColor: "#f2f2f2",
                  }
                : {
                    width: "100vw",
                    height: "calc(100vh - 64px)",
                    backgroundColor: "#f2f2f2",
                  }
            }
          >
            <div
              style={{
                width: "100%",
                height: "64px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                style={{
                  width: "calc(100% - 32px)",
                  maxWidth: "400px",
                }}
              >
                <Input
                  id="search-environments"
                  placeholder="Search environments"
                  color="primary"
                  className="notSelectable"
                  value={this.props.searchText}
                  style={nightMode ? { color: "white" } : { color: "black" }}
                  onChange={event =>
                    this.props.searchEnvironments(event.target.value)
                  }
                  disabled={loading || error || (user && !user.environments[0])}
                  startAdornment={
                    <InputAdornment
                      position="start"
                      style={{ cursor: "default" }}
                    >
                      <Icon
                        style={
                          nightMode
                            ? user && user.environments[0]
                              ? { color: "white" }
                              : { color: "white", opacity: "0.5" }
                            : user && user.environments[0]
                            ? { color: "black" }
                            : { color: "black", opacity: "0.5" }
                        }
                      >
                        search
                      </Icon>
                    </InputAdornment>
                  }
                  endAdornment={
                    this.props.searchText ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => this.props.searchEnvironments("")}
                          onMouseDown={this.handleMouseDownSearch}
                          style={
                            nightMode ? { color: "white" } : { color: "black" }
                          }
                          tabIndex="-1"
                        >
                          <Icon>clear</Icon>
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                />
              </FormControl>
            </div>
            {error && "Unexpected error"}
            {loading && (
              <div
                style={{
                  overflowY: "auto",
                  height: "calc(100vh - 128px)",
                }}
              >
                <CenteredSpinner style={{ paddingTop: "32px" }} />
              </div>
            )}
            {user &&
              (user.environments.filter(
                environment => environment.myRole !== "OWNER"
              )[0] || user.pendingEnvironmentShares[0] ? (
                <SwipeableViews
                  index={this.state.slideIndex}
                  onChangeIndex={slideIndex => this.setState({ slideIndex })}
                >
                  <div
                    style={
                      nightMode
                        ? {
                            overflowY: "auto",
                            height: "calc(100vh - 192px)",
                            background: "#21252b",
                          }
                        : {
                            overflowY: "auto",
                            height: "calc(100vh - 192px)",
                            background: "#f2f2f2",
                          }
                    }
                  >
                    <div
                      style={{
                        height: "100%",
                        overflowY: "auto",
                      }}
                    >
                      <Grid
                        container
                        justify="center"
                        spacing={16}
                        className="notSelectable defaultCursor"
                        style={{
                          width: "calc(100% - 16px)",
                          marginLeft: "8px",
                          marginRight: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        {yourEnvironmentsList}
                      </Grid>
                    </div>
                  </div>
                  <div
                    style={{
                      overflowY: "auto",
                      height: "calc(100vh - 192px)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        overflowY: "auto",
                      }}
                    >
                      <Grid
                        container
                        justify="center"
                        spacing={16}
                        className="notSelectable defaultCursor"
                        style={{
                          width: "calc(100% - 16px)",
                          marginLeft: "8px",
                          marginRight: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        {sharedEnvironmentsList}
                      </Grid>
                    </div>
                  </div>
                </SwipeableViews>
              ) : (
                <div
                  style={{
                    overflowY: "auto",
                    height: "calc(100vh - 128px)",
                  }}
                >
                  <Typography
                    variant="h4"
                    className="notSelectable defaultCursor"
                    style={
                      nightMode
                        ? {
                            textAlign: "center",
                            lineHeight: "64px",
                            height: "64px",
                            color: "white",
                          }
                        : {
                            textAlign: "center",
                            lineHeight: "64px",
                            height: "64px",
                            color: "black",
                          }
                    }
                  >
                    Your environments
                  </Typography>
                  <div
                    style={{ height: "calc(100vh - 192px)", overflowY: "auto" }}
                  >
                    <Grid
                      container
                      justify="center"
                      spacing={16}
                      className="notSelectable defaultCursor"
                      style={{
                        width: "calc(100% - 16px)",
                        marginLeft: "8px",
                        marginRight: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      {yourEnvironmentsList}
                    </Grid>
                  </div>
                </div>
              ))}
            {user &&
              (user.environments.filter(
                environment => environment.myRole !== "OWNER"
              )[0] ||
                user.pendingEnvironmentShares[0]) && (
                <AppBar
                  position="static"
                  style={{
                    marginBottom: "0px",
                    marginTop: "auto",
                    height: "64px",
                  }}
                >
                  <BottomNavigation
                    color="primary"
                    onChange={(event, slideIndex) =>
                      this.setState({ slideIndex })
                    }
                    value={this.state.slideIndex}
                    showLabels
                    style={
                      nightMode
                        ? {
                            height: "64px",
                            backgroundColor: "#2f333d",
                          }
                        : {
                            height: "64px",
                            backgroundColor: "#fff",
                          }
                    }
                  >
                    <BottomNavigationAction
                      icon={<Icon>person</Icon>}
                      label="Your environments"
                      style={
                        nightMode
                          ? this.state.slideIndex === 0
                            ? { color: "#fff" }
                            : { color: "#fff", opacity: 0.5 }
                          : this.state.slideIndex === 0
                          ? { color: "#0083ff" }
                          : { color: "#757575" }
                      }
                    />
                    <BottomNavigationAction
                      icon={<Icon>group</Icon>}
                      label="Shared with you"
                      style={
                        nightMode
                          ? this.state.slideIndex === 1
                            ? { color: "#fff" }
                            : { color: "#fff", opacity: 0.5 }
                          : this.state.slideIndex === 1
                          ? { color: "#0083ff" }
                          : { color: "#757575" }
                      }
                    />
                  </BottomNavigation>
                </AppBar>
              )}
          </div>
        ) : (
          <React.Fragment>
            <div
              style={
                nightMode
                  ? {
                      width: "100%",
                      height: "64px",
                      backgroundColor: "#21252b",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      width: "100%",
                      height: "64px",
                      backgroundColor: "#f2f2f2",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              <FormControl
                style={{
                  width: "calc(100% - 32px)",
                  maxWidth: "400px",
                }}
              >
                <Input
                  id="adornment-name-login"
                  placeholder="Search environments"
                  color="primary"
                  className="notSelectable"
                  value={this.props.searchText}
                  style={nightMode ? { color: "white" } : { color: "black" }}
                  onChange={event =>
                    this.props.searchEnvironments(event.target.value)
                  }
                  disabled={loading || error || (user && !user.environments[0])}
                  startAdornment={
                    <InputAdornment
                      position="start"
                      style={{ cursor: "default" }}
                    >
                      <Icon
                        style={
                          typeof Storage !== "undefined" &&
                          localStorage.getItem("nightMode") === "true"
                            ? user && user.environments[0]
                              ? { color: "white" }
                              : { color: "white", opacity: "0.5" }
                            : user && user.environments[0]
                            ? { color: "black" }
                            : { color: "black", opacity: "0.5" }
                        }
                      >
                        search
                      </Icon>
                    </InputAdornment>
                  }
                  endAdornment={
                    this.props.searchText ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => this.props.searchEnvironments("")}
                          style={
                            typeof Storage !== "undefined" &&
                            localStorage.getItem("nightMode") === "true"
                              ? { color: "white" }
                              : { color: "black" }
                          }
                          tabIndex="-1"
                        >
                          <Icon>clear</Icon>
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                />
              </FormControl>
            </div>
            <div
              style={
                nightMode
                  ? {
                      width: "100vw",
                      height: "calc(100vh - 128px)",
                      backgroundColor: "#21252b",
                      overflowY: "auto",
                    }
                  : {
                      width: "100vw",
                      height: "calc(100vh - 128px)",
                      backgroundColor: "#f2f2f2",
                      overflowY: "auto",
                    }
              }
            >
              {user && (
                <List subheader={<li />}>
                  <li key="yourEnvironments">
                    <ul style={{ padding: "0" }}>
                      <ListSubheader
                        style={
                          nightMode
                            ? { backgroundColor: "#21252b" }
                            : { backgroundColor: "#f2f2f2" }
                        }
                      >
                        <Typography
                          variant="h4"
                          className="notSelectable defaultCursor"
                          style={
                            nightMode
                              ? {
                                  textAlign: "center",
                                  lineHeight: "64px",
                                  height: "64px",
                                  color: "white",
                                }
                              : {
                                  textAlign: "center",
                                  lineHeight: "64px",
                                  height: "64px",
                                  color: "black",
                                }
                          }
                        >
                          Your environments
                        </Typography>
                      </ListSubheader>
                      {yourEnvironmentsList}
                    </ul>
                  </li>
                  {user &&
                    (user.environments.filter(
                      environment => environment.myRole !== "OWNER"
                    )[0] ||
                      user.pendingEnvironmentShares[0]) && (
                      <li key="yourEnvironments">
                        <ul style={{ padding: "0" }}>
                          {user.environments
                            .filter(
                              environment => environment.myRole !== "OWNER"
                            )
                            .filter(environment =>
                              environment.name
                                .toLowerCase()
                                .includes(this.props.searchText.toLowerCase())
                            )[0] && (
                            <ListSubheader
                              style={
                                nightMode
                                  ? { backgroundColor: "#21252b" }
                                  : { backgroundColor: "#f2f2f2" }
                              }
                            >
                              <Typography
                                variant="h4"
                                className="notSelectable defaultCursor"
                                style={
                                  nightMode
                                    ? {
                                        textAlign: "center",
                                        lineHeight: "64px",
                                        height: "64px",
                                        color: "white",
                                      }
                                    : {
                                        textAlign: "center",
                                        lineHeight: "64px",
                                        height: "64px",
                                        color: "black",
                                      }
                                }
                              >
                                Shared with you
                              </Typography>
                            </ListSubheader>
                          )}
                          {sharedEnvironmentsList}
                        </ul>
                      </li>
                    )}
                </List>
              )}
            </div>
          </React.Fragment>
        )}
        <CreateEnvironment
          open={this.state.createOpen}
          close={() => this.setState({ createOpen: false })}
        />
        {user && user.pendingEnvironmentShares && (
          <PendingShares
            open={this.state.pendingSharesOpen}
            close={() => this.setState({ pendingSharesOpen: false })}
            pendingEnvironmentShares={user.pendingEnvironmentShares}
          />
        )}
        {user && user.pendingOwnerChanges && (
          <PendingOwnerChanges
            open={this.state.pendingOwnerChangesOpen}
            close={() => this.setState({ pendingOwnerChangesOpen: false })}
            pendingOwnerChanges={user.pendingOwnerChanges}
          />
        )}
      </React.Fragment>
    )
  }
}
