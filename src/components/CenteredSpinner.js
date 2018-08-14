import React from "react"
import CircularProgress from "material-ui/CircularProgress"

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
    <CircularProgress color="#0083ff" />
  </div>
)
