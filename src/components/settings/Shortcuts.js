import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "material-ui-next/Table"
import Paper from "material-ui-next/Paper"

const shortcutDialogContentStyle = {
  width: "425px",
}

export default class ChangeShortcutDialog extends React.Component {
  render() {
    const shortcutDialogActions = [
      <Button onClick={this.props.handleShortcutDialogClose}>Close</Button>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Keyboard shortcuts"
          actions={shortcutDialogActions}
          open={this.props.shortcutDialogOpen}
          contentStyle={shortcutDialogContentStyle}
          onRequestClose={this.props.handleShortcutDialogClose}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
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
                  <TableCell>Select a device/Scroll through settings</TableCell>
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
        </Dialog>
      </React.Fragment>
    )
  }
}
