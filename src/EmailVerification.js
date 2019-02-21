import React, { Component } from "react"
import { Link } from "react-router-dom"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Helmet from "react-helmet"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import logo from "./styles/assets/logo.svg"
import gql from "graphql-tag"

export default class PasswordVerification extends Component {
  state = { redirect: false, isMobile: false }

  resendEmail = async () => {
    try {
      await this.props.client.mutate({
        mutation: gql`
          mutation ResendVerificationEmail {
            resendVerificationEmail
          }
        `,
      })
    } catch (e) {
      this.setState({
        error: "Unexpected error",
      })
    }
  }

  updateDimensions = () => {
    if (window.innerWidth < 400) {
      !this.state.isMobile && this.setState({ isMobile: true })
    } else {
      this.state.isMobile && this.setState({ isMobile: false })
    }
  }

  componentDidMount = () => {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
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
            maxWidth: "332px",
            maxHeight: "395px",
            textAlign: "center",
            padding: "0 32px",
            backgroundColor: "#0057cb",
          }}
          className="notSelectable defaultCursor"
        >
          <img
            src={logo}
            alt="Igloo logo"
            className="notSelectable nonDraggable"
            draggable="false"
            style={{
              maxWidth: "192px",
              marginBottom: "72px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <Typography
            variant={this.state.isMobile ? "h5" : "h4"}
            style={{ color: "white", marginTop: "16px", marginBottom: "32px" }}
          >
            Look for a log in link in your inbox
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
              color="primary"
              style={{ marginBottom: "8px" }}
              fullWidth
              onClick={this.resendEmail}
            >
              Resend email
            </Button>
            <br />
            <Button color="primary" component={Link} to="/" fullWidth>
              Go back
            </Button>
          </MuiThemeProvider>
        </div>
      </React.Fragment>
    )
  }
}
