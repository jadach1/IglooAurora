import React, { Component } from "react"
import {
  Typography,
  Icon,
  Grid,
  Button,
  MuiThemeProvider,
  createMuiTheme,
  Zoom,
  IconButton,
  TextField,
  InputAdornment,
} from "@material-ui/core"
import GetLinkSuccess from "../GetLinkSuccess"
import CenteredSpinner from "../CenteredSpinner"
import BoardCard from "./BoardCard"
import CreateBoard from "./CreateBoard"

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
      nightMode = user.nightMode
      devMode = user.devMode

      favoriteBoardsList = user.boards
        .filter(board => board.favorite)
        .filter(board =>
          board.customName
            .toLowerCase()
            .includes(this.state.searchText.toLowerCase())
        )
        .map(board => (
          <Grid key={board.id} item>
            <BoardCard
              board={board}
              nightMode={nightMode}
              devMode={devMode}
              showMessage={() => this.setState({ copyMessageOpen: true })}
            />
          </Grid>
        ))

      boardsList = user.boards
        .filter(board => !board.favorite)
        .filter(board =>
          board.customName
            .toLowerCase()
            .includes(this.state.searchText.toLowerCase())
        )
        .map(board => (
          <Grid key={board.id} item>
            <BoardCard
              board={board}
              nightMode={nightMode}
              devMode={devMode}
              showMessage={() => this.setState({ copyMessageOpen: true })}
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
            <TextField
              placeholder="Search boards"
              color="primary"
              className="notSelectable"
              style={{
                width: "400px",
              }}
              value={this.state.searchText}
              onChange={event =>
                this.setState({ searchText: event.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{ cursor: "default" }}
                  >
                    <Icon
                      style={
                        this.props.nightMode
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      search
                    </Icon>
                  </InputAdornment>
                ),
                endAdornment: this.state.searchText ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={this.handleClickCancelSearch}
                      onMouseDown={this.handleMouseDownSearch}
                    >
                      <Icon
                        style={
                          this.props.nightMode
                            ? { color: "white" }
                            : { color: "black" }
                        }
                      >
                        clear
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </MuiThemeProvider>
        </div>
        <div
          style={
            nightMode
              ? {
                  width: "100vw",
                  height: "calc(100vh - 128px)",
                  backgroundColor: "#21252b",
                }
              : {
                  width: "100vw",
                  height: "calc(100vh - 128px)",
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
          <Grid
            container
            justify="center"
            spacing={16}
            className="notSelectable defaultCursor"
            style={{ width: "100vw" }}
          >
            {favoriteBoardsList}
          </Grid>
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
                style={{ position: "absolute", right: "20px", bottom: "20px" }}
                onClick={() => this.setState({ createOpen: true })}
              >
                <Icon style={{ marginRight: "8px" }}>add</Icon>
                Create board
              </Button>
            </Zoom>
          </MuiThemeProvider>
        </div>
        <GetLinkSuccess
          mobile={false}
          open={this.state.copyMessageOpen}
          close={() => this.setState({ copyMessageOpen: false })}
        />
        <CreateBoard
          open={this.state.createOpen}
          close={() => this.setState({ createOpen: false })}
        />
      </React.Fragment>
    )
  }
}
