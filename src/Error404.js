import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import Button from "@material-ui/core/Button"
import polarBearWithBucket from "./styles/assets/polarBearWithBucket.svg"
import Typography from "@material-ui/core/Typography"
import Helmet from "react-helmet"

export default class Error404 extends Component {
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
          <title>Igloo Aurora - Page not found</title>
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
            You seem to be lost
          </Typography>
          <img
            alt="Sleeping Polar Bear"
            src={polarBearWithBucket}
            className="notSelectable"
            style={{ maxHeight: "300px" }}
          />
          <Typography
            variant={this.state.isMobile ? "h6" : "h5"}
            gutterBottom
            style={{ color: "white", margin: "32px 0" }}
          >
            Click on the button below and we'll take you to a safe place
          </Typography>
          <Button
            variant="contained"
            onClick={() => this.setState({ redirect: true })}
            color="primary"
            style={{ marginBottom: "16px" }}
          >
            Take me away!
          </Button>
        </div>
      </React.Fragment>
    )
  }
}
