import React from "react"
import Typography from "@material-ui/core/Typography"
import polarBear from "./styles/assets/polarBear.svg"

export default class OfflineScreen extends React.Component {
  render() {
    document.body.style.backgroundColor = "#0057cb"

    return (
      <div
        style={
          this.props.isMobile
            ? {
                width: "100vw",
                height: "100vh",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
            : {
                width: "400px",
                height: "100vh",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }
        }
      >
        <div
          style={
            this.props.isMobile
              ? {
                  margin: "auto",
                  textAlign: "center",
                  width: "88vw",
                  maxWidth: "400px",
                  paddingTop: "32px",
                  paddingBottom: "32px",
                }
              : {
                  margin: "auto",
                  textAlign: "center",
                  width: "400px",
                  paddingTop: "32px",
                  paddingBottom: "32px",
                }
          }
          className="notSelectable defaultCursor"
        >
          <Typography variant="h3" style={{ color: "white" }}>
            You are not connected, try again in a while
          </Typography>
          <br />
          <br />
          <br />
          <br />
          <img
            alt="Sleeping Polar Bear"
            src={polarBear}
            className="notSelectable"
          />
          <br />
          <br />
          <br />
          <br />
          <Typography variant="h5" gutterBottom style={{ color: "white" }}>
            In the meantime, why don't you have a nap?
          </Typography>
        </div>
      </div>
    )
  }
}
