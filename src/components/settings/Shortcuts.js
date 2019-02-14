import React from "react"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import Paper from "@material-ui/core/Paper"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import withMobileDialog from "@material-ui/core/withMobileDialog"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class ShortcutDialog extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.shortcutDialogOpen}
          onClose={this.props.handleShortcutDialogClose}
          className="notSelectable"
          TransitionComponent={
            this.props.fullScreen ? SlideTransition : GrowTransition
          }
          titleClassName="defaultCursor"
          fullScreen={this.props.fullScreen}
          disableBackdropClick={this.props.fullScreen}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            style={
              this.props.fullScreen
                ? typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                  ? { width: "calc(100% - 48px)", background: "#2f333d" }
                  : { width: "calc(100% - 48px)", background: "#fff" }
                : typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                ? { background: "#2f333d" }
                : { background: "#fff" }
            }
          >
            <font
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? { color: "#fff" }
                  : {}
              }
            >
              Keyboard shortcuts
            </font>
          </DialogTitle>
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
            <Paper
              style={
                typeof Storage !== "undefined" &&
                localStorage.getItem("nightMode") === "true"
                  ? {
                      background: "#2f333d",
                    }
                  : {}
              }
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "#c1c2c5",
                            }
                          : {}
                      }
                    >
                      Shortcut
                    </TableCell>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "#c1c2c5",
                            }
                          : {}
                      }
                    >
                      Function
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Alt/Option + Number
                    </TableCell>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Select a device/Scroll through settings
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Alt/Option + ,
                    </TableCell>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Settings
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Alt/Option + N
                    </TableCell>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Notifications
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Alt/Option + S
                    </TableCell>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Show hidden cards/notifications
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Alt/Option + Q
                    </TableCell>
                    <TableCell
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? {
                              color: "white",
                            }
                          : {}
                      }
                    >
                      Log out
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
          <DialogActions>
            <Button onClick={this.props.handleShortcutDialogClose}>
              <font
                style={
                  typeof Storage !== "undefined" &&
                  localStorage.getItem("nightMode") === "true"
                    ? { color: "white" }
                    : {}
                }
              >
                Close
              </font>
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withMobileDialog({ breakpoint: "sm" })(ShortcutDialog)
