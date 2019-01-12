import React from "react"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import polarBear from "./styles/assets/polarBearWithBucket.svg"
import { Redirect } from "react-router-dom"

export default class PasswordRecoveryError extends React.Component {
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

    return (
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
          Yikes, it's an unexpected error!
        </Typography>
        <img
          alt="Sleeping Polar Bear"
          src={polarBear}
          className="notSelectable nonDraggable"
                  draggable="false"
                  style={{ maxWidth: "300px" }}
        />
        <Typography
          variant={this.state.isMobile ? "h6" : "h5"}
          style={{ color: "white", margin: "32px 0" }}
        >
          {this.props.error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.setState({ redirect: true })}
          style={{ marginBottom: "16px" }}
        >
          Take me away!
        </Button>
        {this.state.redirect && <Redirect push to="/" />}
      </div>
    )
  }
}
