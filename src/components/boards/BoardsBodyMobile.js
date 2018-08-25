import React, { Component } from "react"
import {
  Typography,
  Icon,
  Grid,
  Button,
  MuiThemeProvider,
  createMuiTheme,
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Zoom,
  IconButton,
  Input,
  InputAdornment,
  FormControl,
} from "@material-ui/core"
import CenteredSpinner from "../CenteredSpinner"
import BoardCard from "./BoardCard"
import CreateBoard from "./CreateBoard"
import SwipeableViews from "react-swipeable-views"

let zoomAnimation = false

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class BoardsBodyMobile extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    copyMessageOpen: false,
    slideIndex: 0,
    searchText: "",
  }

  handleSettingsTabChanged = (event, value) => {
    this.setState({
      slideIndex: value,
    })
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
            .includes(this.props.searchText.toLowerCase())
        )
        .map(board => (
          <Grid key={board.id} item>
            <BoardCard
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
          <div style={{ width: "100%", height: "64px" }}>
            <MuiThemeProvider theme={theme}>
              <FormControl
                style={{
                  margin: "16px 8px 0 16px",
                  width: "calc(100% - 32px)",
                }}
              >
                <Input
                  id="adornment-name-login"
                  placeholder="Search boards"
                  color="primary"
                  className="notSelectable"
                  value={this.props.searchText}
                  style={nightMode ? { color: "white" } : { color: "black" }}
                  onChange={event =>
                    this.props.searchBoards(event.target.value)
                  }
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
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleSettingsTabChanged}
          >
            <div
              style={{
                overflowY: "auto",
                height: "calc(100vh - 192px)",
              }}
            >
              <Typography
                variant="display1"
                className="notSelectable defaultCursor"
                style={
                  nightMode
                    ? {
                        textAlign: "center",
                        paddingTop: "8px",
                        marginBottom: "16px",
                        color: "white",
                      }
                    : {
                        textAlign: "center",
                        paddingTop: "8px",
                        marginBottom: "16px",
                        color: "black",
                      }
                }
              >
                Starred boards
              </Typography>
              <div style={{ height: "calc(100vh - 257px)", overflowY: "auto" }}>
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
              </div>
            </div>
            <div
              style={{
                overflowY: "auto",
                height: "calc(100vh - 192px)",
              }}
            >
              <Typography
                variant="display1"
                className="notSelectable defaultCursor"
                style={
                  nightMode
                    ? {
                        textAlign: "center",
                        marginTop: "8px",
                        marginBottom: "16px",
                        color: "white",
                      }
                    : {
                        textAlign: "center",
                        marginTop: "8px",
                        marginBottom: "16px",
                        color: "black",
                      }
                }
              >
                Recent boards
              </Typography>
              <div style={{ height: "calc(100vh - 257px)", overflowY: "auto" }}>
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
              </div>
            </div>
          </SwipeableViews>
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
              onChange={this.handleSettingsTabChanged}
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
                icon={<Icon>star</Icon>}
                label="Starred"
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
                icon={<Icon>history</Icon>}
                label="Recent"
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
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#ff4081" },
              },
            })}
          >
            <Zoom
              in={zoomAnimation && this.state.slideIndex === 1}
              style={
                this.state.slideIndex === 1
                  ? { transitionDelay: 200 }
                  : { transitionDelay: 0 }
              }
            >
              <Button
                variant="fab"
                color="primary"
                style={{
                  position: "absolute",
                  right: "20px",
                  bottom: "84px",
                }}
                onClick={() => this.setState({ createOpen: true })}
              >
                <Icon>add</Icon>
              </Button>
            </Zoom>
            <Zoom
              in={zoomAnimation && this.state.slideIndex === 0}
              style={
                this.state.slideIndex === 0
                  ? { transitionDelay: 200 }
                  : { transitionDelay: 0 }
              }
            >
              <Button
                variant="fab"
                color="primary"
                style={{
                  position: "absolute",
                  right: "20px",
                  bottom: "84px",
                }}
                onClick={() => this.setState({ createOpen: true })}
              >
                <Icon>add</Icon>
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

export default BoardsBodyMobile
