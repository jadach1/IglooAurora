import React from "react"
import Fade from "@material-ui/core/Fade"
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
    {props.noDelay ? (
      <CircularProgress size={props.large ? 96 : 48} />
    ) : (
      <Fade
        in={true}
        style={{
          transitionDelay: "800ms",
        }}
        unmountOnExit
      >
        <CircularProgress size={props.large ? 96 : 48} />
      </Fade>
    )}
  </div>
)
