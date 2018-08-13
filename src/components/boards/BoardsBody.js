import React, { Component } from "react"
import {
  Typography,
  Icon,
  Grid,
  Button,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core"
import GetLinkSuccess from "../GetLinkSuccess"
import CenteredSpinner from "../CenteredSpinner"
import BoardCard from "./BoardCard"
import CreateBoard from "./CreateBoard"

export default class BoardsBody extends Component {
  state = {
    anchorEl: null,
    createOpen: false,
    copyMessageOpen: false,
  }

  render() {
    const {
      userData: { error, user, loading },
    } = this.props

    let boardsList = ""

    let nightMode = false

    let devMode = false

    if (loading) {
      boardsList = <CenteredSpinner />
    }

    if (error) {
      boardsList = "Unexpected error"
    }

    if (user) {
      nightMode = user.nightMode
      devMode = user.devMode

      boardsList = user.boards.map(board => (
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
            <Button
              variant="extendedFab"
              color="primary"
              style={{ position: "absolute", right: "20px", bottom: "20px" }}
              onClick={() => this.setState({ createOpen: true })}
            >
              <Icon style={{ marginRight: "16px" }}>add</Icon>
              Create board
            </Button>
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
