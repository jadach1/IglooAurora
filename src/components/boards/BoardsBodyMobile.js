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
} from "@material-ui/core"
import GetLinkSuccess from "../GetLinkSuccess"
import CenteredSpinner from "../CenteredSpinner"
import BoardCard from "./BoardCard"
import CreateBoard from "./CreateBoard"
import SwipeableViews from "react-swipeable-views"

let zoomAnimation = false

class BoardsBodyMobile extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    copyMessageOpen: false,
    slideIndex: 0,
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
        .map(board => (
          <Grid key={board.id} item>
            <BoardCard board={board} nightMode={nightMode} devMode={devMode} />
          </Grid>
        ))

      boardsList = user.boards.filter(board => !board.favorite).map(board => (
        <Grid key={board.id} item>
          <BoardCard board={board} nightMode={nightMode} devMode={devMode} />
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
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleSettingsTabChanged}
            enableMouseEvents
          >
            <div
              style={{
                overflowY: "auto",
                height: "calc(100vh - 128px)",
              }}
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
            </div>
            <div
              style={{
                overflowY: "auto",
                height: "calc(100vh - 128px)",
              }}
            >
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
            </div>
          </SwipeableViews>
          <AppBar
            color="default"
            position="static"
            style={{ marginBottom: "0px", marginTop: "auto", height: "64px" }}
          >
            <BottomNavigation
              onChange={this.handleSettingsTabChanged}
              value={this.state.slideIndex}
              showLabels
              style={{ height: "64px" }}
            >
              <BottomNavigationAction
                icon={<Icon>favorite</Icon>}
                label="Favourite"
                style={
                  this.state.slideIndex === 0
                    ? { color: "#0083ff" }
                    : { color: "#757575" }
                }
              />
              <BottomNavigationAction
                icon={<Icon>history</Icon>}
                label="Recent"
                style={
                  this.state.slideIndex === 1
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

export default BoardsBodyMobile
