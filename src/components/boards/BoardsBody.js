import React, { Component } from "react"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import Paper from "@material-ui/core/Paper"
import List from "@material-ui/core/List"
import ListSubheader from "@material-ui/core/ListSubheader"
import CenteredSpinner from "../CenteredSpinner"
import BoardCard from "./BoardCard"
import CreateBoard from "./CreateBoard"
import Helmet from "react-helmet"
import PendingShares from "./PendingShares"

export default class BoardsBody extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    pendingSharesOpen: false,
    copyMessageOpen: false,
    searchText: "",
  }

  render() {
    const {
      userData: { error, user, loading },
    } = this.props

    let boardsList = ""
    let yourBoardsList = ""

    let nightMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("nightMode") === "true"

    let devMode =
      typeof Storage !== "undefined" &&
      localStorage.getItem("devMode") === "true"

    if (loading) {
      yourBoardsList = <CenteredSpinner />
    }

    if (error) {
      yourBoardsList = "Unexpected error"
    }

    if (user) {
      yourBoardsList = user.boards
        .filter(board => board.myRole === "OWNER")
        .filter(board =>
          board.customName
            .toLowerCase()
            .includes(this.props.searchText.toLowerCase())
        )
        .map(board => (
          <Grid key={board.id} item>
            <BoardCard
              userData={this.props.userData}
              board={board}
              nightMode={nightMode}
              devMode={devMode}
              showMessage={() => this.setState({ copyMessageOpen: true })}
              lastBoard={!user.boards[1]}
            />
          </Grid>
        ))

      boardsList = user.boards
        .filter(board => board.myRole !== "OWNER")
        .filter(board =>
          board.customName
            .toLowerCase()
            .includes(this.props.searchText.toLowerCase())
        )
        .map(board => (
          <Grid key={board.id} item>
            <BoardCard
              userData={this.props.userData}
              board={board}
              nightMode={nightMode}
              devMode={devMode}
              showMessage={() => this.setState({ copyMessageOpen: true })}
              lastBoard={!user.boards[1]}
            />
          </Grid>
        ))
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora</title>
        </Helmet>
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
          <FormControl style={{ width: "400px" }}>
            <Input
              id="adornment-name-login"
              placeholder="Search boards"
              color="primary"
              className="notSelectable"
              value={this.props.searchText}
              style={nightMode ? { color: "white" } : { color: "black" }}
              onChange={event => this.props.searchBoards(event.target.value)}
              disabled={loading || error || (user && !user.boards[0])}
              startAdornment={
                <InputAdornment position="start" style={{ cursor: "default" }}>
                  <Icon
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? user && user.boards[0]
                          ? { color: "white" }
                          : { color: "white", opacity: "0.5" }
                        : user && user.boards[0]
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
                      onClick={() => this.props.searchBoards("")}
                      onMouseDown={this.handleMouseDownSearch}
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
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
          {error && "Unexpected error"}
          {loading && <CenteredSpinner large style={{ paddingTop: "32px" }} />}
          {user && (
            <List subheader={<li />}>
              <li key="yourBoards">
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
                              paddingTop: "8px",
                              paddingBottom: "8px",
                              marginBottom: "8px",
                              color: "white",
                            }
                          : {
                              textAlign: "center",
                              paddingTop: "8px",
                              paddingBottom: "8px",
                              marginBottom: "8px",
                              color: "black",
                            }
                      }
                    >
                      Your boards
                    </Typography>
                  </ListSubheader>
                  <Grid
                    container
                    justify="center"
                    spacing={16}
                    className="notSelectable defaultCursor"
                    style={{
                      width: "calc(100vw - 64px)",
                      marginLeft: "32px",
                      marginRight: "32px",
                    }}
                  >
                    {yourBoardsList}
                    <Grid key="create" item>
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
                        onClick={() => this.setState({ createOpen: true })}
                      >
                        <div
                          style={{ paddingTop: "50px", paddingBottom: "50px" }}
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
                            Create new board
                          </Typography>
                        </div>
                      </Paper>
                    </Grid>
                  </Grid>
                </ul>
              </li>
              {(boardsList[0] || user.pendingBoardShares[0]) && (
                <li key="yourBoards">
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
                                marginTop: "8px",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                                marginBottom: "8px",
                                color: "white",
                              }
                            : {
                                textAlign: "center",
                                marginTop: "8px",
                                paddingTop: "8px",
                                paddingBottom: "8px",
                                marginBottom: "8px",
                                color: "black",
                              }
                        }
                      >
                        Shared with you
                      </Typography>
                    </ListSubheader>
                    <Grid
                      container
                      justify="center"
                      spacing={16}
                      className="notSelectable defaultCursor"
                      style={{
                        width: "calc(100vw - 64px)",
                        marginLeft: "32px",
                        marginRight: "32px",
                      }}
                    >
                      {boardsList}
                      {user.pendingBoardShares[0] && (
                        <Grid key="boardShares" item>
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
                              this.setState({ pendingSharesOpen: true })
                            }
                          >
                            <div
                              style={{
                                paddingTop: "50px",
                                paddingBottom: "50px",
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
                                {user.pendingBoardShares.length > 99
                                  ? "99+ pending requests"
                                  : user.pendingBoardShares.length +
                                    (user.pendingBoardShares.length === 1
                                      ? " pending request"
                                      : " pending requests")}
                              </Typography>
                            </div>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </ul>
                </li>
              )}
            </List>
          )}
        </div>
        <CreateBoard
          open={this.state.createOpen}
          close={() => this.setState({ createOpen: false })}
        />
        {user && user.pendingBoardShares && (
          <PendingShares
            open={this.state.pendingSharesOpen}
            close={() => this.setState({ pendingSharesOpen: false })}
            pendingBoardShares={user.pendingBoardShares}
          />
        )}
      </React.Fragment>
    )
  }
}
