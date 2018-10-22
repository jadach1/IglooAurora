import React, { Component } from "react"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"; import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Zoom from "@material-ui/core/Zoom"
import IconButton from "@material-ui/core/IconButton"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import CenteredSpinner from "../CenteredSpinner"
import BoardCard from "./BoardCard"
import CreateBoard from "./CreateBoard"
import LargeCenteredSpinner from "../LargeCenteredSpinner"

let zoomAnimation = false

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

export default class BoardsBody extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    copyMessageOpen: false,
    searchText: "",
  }

  componentDidMount() {
    zoomAnimation = true
  }

  render() {
    const {
      userData: { error, user, loading },
    } = this.props

    let boardsList = ""
    let favoriteBoardsList = ""

    let nightMode = false

    let devMode = false

    if (loading) {
      boardsList = <CenteredSpinner />
      favoriteBoardsList = <CenteredSpinner />
    }

    if (error) {
      boardsList = "Unexpected error"
      favoriteBoardsList = "Unexpected error"
    }

    if (user) {
      nightMode =
        typeof Storage !== "undefined" &&
        localStorage.getItem("nightMode") === "true"
      devMode = user.devMode

      favoriteBoardsList = user.boards
        .filter(board => board.favorite)
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
        .filter(board => !board.favorite)
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
          <MuiThemeProvider theme={theme}>
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
                  <InputAdornment
                    position="start"
                    style={{ cursor: "default" }}
                  >
                    <Icon
                      style={
                        nightMode
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
                          nightMode ? { color: "white" } : { color: "black" }
                        }
                      >
                        <Icon>clear</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
          </MuiThemeProvider>
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
          {loading && <LargeCenteredSpinner />}
          {user && (
            <React.Fragment>
              {user.boards.filter(board => board.favorite)[0] && (
                <React.Fragment>
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
                    Starred boards
                  </Typography>
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
                    {favoriteBoardsList}
                  </Grid>
                </React.Fragment>
              )}
              {user.boards.filter(board => !board.favorite)[0] && (
                <React.Fragment>
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
                    style={{
                      width: "calc(100vw - 64px)",
                      marginLeft: "32px",
                      marginRight: "32px",
                    }}
                  >
                    {boardsList}
                  </Grid>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#ff4081" },
              },
            })}
          >
            <Zoom
              in={zoomAnimation}
              style={
                this.state.slideIndex === 1
                  ? { transitionDelay: 200 }
                  : { transitionDelay: 0 }
              }
            >
              <Button
                variant="extendedFab"
                color="primary"
                style={{
                  position: "absolute",
                  right: "16px",
                  bottom: "16px",
                }}
                onClick={() => this.setState({ createOpen: true })}
              >
                <Icon style={{ marginRight: "8px" }}>add</Icon>
                Create board
              </Button>
            </Zoom>
          </MuiThemeProvider>
        </div>
        <CreateBoard
          open={this.state.createOpen}
          close={() => this.setState({ createOpen: false })}
        />
      </React.Fragment>
    )
  }
}
