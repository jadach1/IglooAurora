import React from "react"
import CircularProgress from "@material-ui/core/CircularProgress"

export default props => (
  <div
    {...props}
    style={
      props.style
        ? {
            ...props.style,
            width: "100%",
            textAlign: "center",
          }
        : { width: "100%", textAlign: "center" }
    }
  >
    <CircularProgress size={props.large ? 96 : 48} />
  </div>
)
