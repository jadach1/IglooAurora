import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class AddDevice extends Component {
  state = { authDialogOpen: false }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          fullWidth
          maxWidth="xs"
          className="notSelectable defaultCursor"
        >
          <DialogTitle disableTypography>Add device</DialogTitle>
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                    background: "#2f333d",
                  }
                : {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                  }
            }
          >
            a
          </div>
          <DialogActions>
            <Button onClick={this.props.close}>Never mind</Button>
            <Button
              variant="contained"
              onClick={() => {
                this.props.close()
                this.setState({ authDialogOpen: true })
              }}
              color="primary"
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.authDialogOpen}
          onClose={() => this.setState({ authDialogOpen: false })}
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
          className="notSelectable defaultCursor"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle disableTypography>Add device</DialogTitle>
          <div
            style={
              typeof Storage !== "undefined" &&
              localStorage.getItem("nightMode") === "true"
                ? {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                    background: "#2f333d",
                  }
                : {
                    height: "100%",
                    paddingRight: "24px",
                    paddingLeft: "24px",
                  }
            }
          >
            <List>
              {[
                "Read and write access to itself",
                "Read and write access to other devices",
              ].map(auth => (
                <ListItem>{auth}</ListItem>
              ))}
            </List>
          </div>
          <DialogActions>
            <Button onClick={this.props.close}>Never mind</Button>
            <Button
              variant="contained"
              onClick={() => this.props.close()}
              color="primary"
            >
              Authorize
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
