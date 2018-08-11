import React, { Component } from "react"
import { Typography, Icon } from "material-ui-next"

export default class BoardsBody extends Component {
  render() {
    return (
      <React.Fragment className="notSelectable defaultCursor">
        <Typography variant="display1">
          <Icon>favorite</Icon>
          Favourite boards
        </Typography>
        <Typography variant="display1">
          <Icon>history</Icon>
          Recent boards
        </Typography>
      </React.Fragment>
    )
  }
}
