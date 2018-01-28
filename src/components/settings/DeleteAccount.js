import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import RaisedButton from "material-ui/RaisedButton"
import TextField from "material-ui/TextField"

const passwordDialogContentStyle = {
  width: "350px",
}

const deleteDialogContentStyle = {
  width: "360px",
}

export default class DeleteAccountDialog extends React.Component {
  render() {
    const deleteConfimedActions = [
      <FlatButton
        label="Never mind"
        onClick={this.props.closeDeleteConfirmed}
        keyboardFocused={true}
      />,
      <RaisedButton
        label="Delete"
        primary={true}
        buttonStyle={{ backgroundColor: "#F44336" }}
      />,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Are you sure you want to delete your account?"
          actions={[
            <FlatButton
              label="Never mind"
              keyboardFocused={true}
              onClick={this.props.closeDelete}
            />,
            <RaisedButton
              label={
                this.props.isDeleteDisabled
                  ? "Delete (" + this.props.timer + ")"
                  : "Delete"
              }
              primary={true}
              buttonStyle={{ backgroundColor: "#F44336" }}
              disabled={this.props.isDeleteDisabled}
              style={{ width: "120px" }}
              disabledLabelColor="#751f19"
              onClick={this.props.deleteConfirmed}
            />,
          ]}
          open={this.props.deleteOpen}
          contentStyle={deleteDialogContentStyle}
          onRequestClose={this.props.closeDelete}
          className="notSelectable"
        >
          Be careful, your data will be erased permanently
        </Dialog>
        <Dialog
          title="Type your password"
          actions={deleteConfimedActions}
          open={this.props.deleteConfirmedOpen}
          contentStyle={passwordDialogContentStyle}
          onRequestClose={this.props.closeDeleteConfirmed}
          className="notSelectable"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Password"
            type="password"
            style={{ width: "100%" }}
          />
        </Dialog>
      </React.Fragment>
    )
  }
}
