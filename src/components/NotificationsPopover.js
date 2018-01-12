import React from "react"
import RaisedButton from "material-ui/RaisedButton"
import Popover from "material-ui/Popover"

export default class NotificationPopover extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  openPopover = event => {
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  closePopover = () => {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <Popover
        open={this.state.openPopover}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
        targetOrigin={{ horizontal: "middle", vertical: "top" }}
        onRequestClose={this.closePopover}
      />
    )
  }
}
