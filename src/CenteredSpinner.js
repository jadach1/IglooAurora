import React from "react"
import CircularProgress from "material-ui/CircularProgress"

export default props => (
    <div style={{width: "100%", textAlign: "center"}} {...props}>
        <CircularProgress style={{margin: "15px 0 0 0"}} />
    </div>
)
