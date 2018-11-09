import React from "react"
import Typography from "@material-ui/core/Typography"
import polarBear from "./styles/assets/polarBear.svg"

export default class OfflineScreen extends React.Component {
  render() {
    document.body.style.backgroundColor = "#0057cb"

    return (
      <div
        style={{
          width: "400px",
          height: "100vh",
          margin: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: "auto",
            textAlign: "center",
            width: "400px",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
          className="notSelectable defaultCursor"
        >
          <Typography variant="display1" style={{ color: "white" }}>
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
          <Typography
            variant="headline"
            gutterBottom
            style={{ color: "white" }}
          >
            In the meantime, why don't you have a nap?
          </Typography>
        </div>
      </div>
    )
  }
}
