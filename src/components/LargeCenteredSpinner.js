import React from "react"
import CircularProgress from "@material-ui/core/CircularProgress"

export default props => (
  <div
    {...props}
    style={
      props.style
        ? { ...props.style, width: "100%", textAlign: "center" }
        : { width: "100%", textAlign: "center" }
    }
  >
    <br />
    <br />
    <CircularProgress style={{ margin: "20px 0 0 0" }} size={80} />
  </div>
)
