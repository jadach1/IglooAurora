import React, { Component } from "react"
import Typography from "@material-ui/core/Typography"

class ReadOnlyStringCard extends Component {
  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "calc(100% - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? {
                  color: "white",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }
              : {
                  paddingLeft: "8px",
                  paddingRight: "8px",
                }
          }
        >
          {this.props.value}
        </Typography>
      </div>
    )
  }
}

export default ReadOnlyStringCard
