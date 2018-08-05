import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const contentStyle = {
  width: "350px",
}

class GDPRDataDownload extends React.Component {
  render() {
    const {
      userData: { user },
    } = this.props

    const actions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <MuiThemeProvider theme={theme}>
          <Button
            variant="raised"
            color="primary"
            label="Download"
            primary={true}
            buttonStyle={{ backgroundColor: "#0083ff" }}
            disabled={!user}
          >
            Download
          </Button>
        </MuiThemeProvider>
      </MuiThemeProvider>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Download your data"
          actions={actions}
          open={this.props.open}
          contentStyle={contentStyle}
          onRequestClose={this.props.close}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          Download you data and trasfer it to another service
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        id
      }
    }
  `,
  { name: "userData" }
)(GDPRDataDownload)
