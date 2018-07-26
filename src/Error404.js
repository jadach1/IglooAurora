import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

export default class Error404 extends Component {
  state = { wannaGoAway: false }

  render() {
    const { wannaGoAway } = this.state

    if (wannaGoAway) {
      this.setState({ wannaGoAway: false })
      return <Redirect to="/aurora" />
    }

    return (
      <div
        className="notSelectable defaultCursor"
        style={
          this.props.nightMode
            ? {
                background: "#2f333d",
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
            : {
                background: "white",
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
        }
      >
        <div className="offlineBody mainBody">
          <div>
            <font size="6">You seem to be lost</font>
            <br />
            <br />
            <font size="5">
              Click on the button below and we'll bring you to a safe place
            </font>
            <br />
            <img
              alt="Sleeping Polar Bear"
              src="./styles/assets/polarBear.svg"
              width="400"
              className="logo notSelectable"
            />
            <br />
            <br />
            <MuiThemeProvider theme={theme}>
              <Button
                variant="raised"
                primary={true}
                onClick={() => this.setState({ wannaGoAway: true })}
                color="primary"
              >
                Take me away!
              </Button>
            </MuiThemeProvider>
          </div>
        </div>
      </div>
    )
  }
}
