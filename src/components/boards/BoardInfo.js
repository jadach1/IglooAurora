import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import moment from "moment"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class BoardInfo extends React.Component {
  state = { showHidden: false }

  render() {
    const infoActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close}>Close</Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Board information"
        actions={infoActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        titleClassName="notSelectable defaultCursor"
        contentStyle={{
          width: "400px",
        }}
      >
        <b>Created: </b>
        {moment
          .utc(this.props.board.createdAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
          .fromNow()}
        <br />
        <br />
        <b>Last updated: </b>
        {moment
          .utc(this.props.board.updatedAt.split(".")[0], "YYYY-MM-DDTh:mm:ss")
          .fromNow()}
        {this.props.devMode ? (
          <React.Fragment>
            <br />
            <br />
            <b>ID: </b> {this.props.board.id}
          </React.Fragment>
        ) : (
          ""
        )}
      </Dialog>
    )
  }
}

export default BoardInfo
