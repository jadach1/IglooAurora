import React from "react"
import Typography from "@material-ui/core/Typography"

export default function ReadOnlyFloatTile(props) {
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
        {props.value}{" "}
        <font
          style={
            typeof Storage !== "undefined" &&
            localStorage.getItem("nightMode") === "true"
              ? { color: "#c1c2c5" }
              : { color: "#7a7a7a" }
          }
        >
          {props.valueDetails}
        </font>
      </Typography>
    </div>
  )
}
