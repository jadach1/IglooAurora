import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import moment from "moment"
import FlatButton from "material-ui/FlatButton"
import Icon from "material-ui-next/Icon"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class DeviceInfo extends React.Component {
  state = { showHidden: false }

  render() {
    const infoActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close}>Close</Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Device information"
        actions={infoActions}
        open={this.props.infoOpen}
        onRequestClose={this.props.close}
        titleClassName="notSelectable"
        contentStyle={{
          width: "400px",
        }}
      >
        <b>Created: </b>
        {moment
          .utc(this.props.createdAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
          .fromNow()}
        <br />
        <br />
        <b>Last updated: </b>
        {moment
          .utc(this.props.updatedAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
          .fromNow()}
        <br />
        <br />
        <b>ID: </b> {this.props.id}
      </Dialog>
    )
  }
}

export default DeviceInfo
