import React from "react"

export default function ReadOnlyFloatTile(props) {
  return (
    <div className="readOnlyFloatTile">
      <div
        className="number"
        style={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? { color: "white" }
            : {}
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
          {" "}
          {props.valueDetails}
        </font>
      </div>
    </div>
  )
}
