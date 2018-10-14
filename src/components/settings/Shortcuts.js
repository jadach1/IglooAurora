import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  Paper,
  DialogActions,
  DialogTitle,
  Grow,
  Slide,
} from "@material-ui/core"

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class ChangeShortcutDialog extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.shortcutDialogOpen}
          onClose={this.props.handleShortcutDialogClose}
          className="notSelectable"
          TransitionComponent={Transition}
          titleClassName="defaultCursor"
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle
            className="notSelectable defaultCursor"
            style={window.innerWidth > MOBILE_WIDTH ? { width: "350px" } : null}
          >
            Keyboard shortcuts
          </DialogTitle>
          <div
            style={{
              paddingLeft: "24px",
              paddingRight: "24px",
              height: "100%",
            }}
          >
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Shortcut</TableCell>
                    <TableCell>Lorem Ipsum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Alt/Option + Number</TableCell>
                    <TableCell>
                      Select a device/Scroll through settings
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alt/Option + ,</TableCell>
                    <TableCell>Settings</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alt/Option + N</TableCell>
                    <TableCell>Notifications</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alt/Option + S</TableCell>
                    <TableCell>Show hidden cards/notifications</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alt/Option + Q</TableCell>
                    <TableCell>Log out</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
          <DialogActions style={{ marginRight: "8px" }}>
            <Button
              style={{ marginRight: "8px" }}
              onClick={this.props.handleShortcutDialogClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}
