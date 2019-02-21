import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Helmet from "react-helmet"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"

export default class PasswordVerification extends Component {
  state = { redirect: false, isMobile: false }

  updateDimensions() {
    if (window.innerWidth < 400) {
      !this.state.isMobile && this.setState({ isMobile: true })
    } else {
      this.state.isMobile && this.setState({ isMobile: false })
    }
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    document.body.style.backgroundColor = "#0057cb"

    if (this.state.redirect) {
      this.setState({ redirect: false })
      return <Redirect push to="/" />
    }

    return (
      <React.Fragment>
        <Helmet>
          <title>Igloo Aurora - Verify your email</title>
        </Helmet>
        <div
          style={{
            position: "absolute",
            margin: "auto",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            maxWidth: "465px",
            maxHeight: "636px",
            textAlign: "center",
            padding: "0 32px",
            backgroundColor: "#0057cb",
          }}
          className="notSelectable defaultCursor"
        >
          <Typography
            variant={this.state.isMobile ? "h5" : "h4"}
            style={{ color: "white", marginTop: "16px", marginBottom: "32px" }}
          >
            You should find a verification email in your inbox
          </Typography>
          <MuiThemeProvider
            theme={createMuiTheme({
              palette: {
                primary: { main: "#fff" },
              },
            })}
          >
            <Button
              variant="outlined"
              onClick={() => this.setState({ redirect: true })}
              color="primary"
            >
              Resend email
            </Button>
            <Button
              onClick={() => this.setState({ redirect: true })}
              color="primary"
              style={{ marginLeft: "4px" }}
            >
              Go back
            </Button>
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    )
  }
}
