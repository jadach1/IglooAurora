import React from "react"
import CircularProgress from "@material-ui/core/CircularProgress"

export default props => (
  <div
    {...props}
    style={
      props.style
        ? { ...props.style, width: "100%", textAlign: "center", height: "100%" }
        : { width: "100%", textAlign: "center", height: "100%" }
    }
  >
    <br />
    <br />
    <CircularProgress />
  </div>
)
