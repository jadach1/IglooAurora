import React from "react"
import Dialog from "material-ui/Dialog"
import FlatButton from "material-ui/FlatButton"
import RaisedButton from "material-ui/RaisedButton"
import { Tabs, Tab } from "material-ui/Tabs"
import TextField from "material-ui/TextField"

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
}

const deleteDialogContentStyle = {
  width: "500px",
}

export default class SettingsDialog extends React.Component {
  state = {
    deleteDialogOpen: false,
  }

  handleDeleteDialogOpen = () => {
    this.setState({ deleteDialogOpen: true })
  }

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false })
  }

  render() {
    const actions = [
      <FlatButton label="Discard" primary={true} />,
      <RaisedButton
        label="Apply"
        primary={true}
        buttonStyle={{ backgroundColor: "#0083ff" }}
      />,
    ]

    const deleteDialogActions = [
      <FlatButton
        label="Discard"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleDeleteDialogClose}
      />,
      <RaisedButton
        label="Delete"
        primary={true}
        buttonStyle={{ backgroundColor: "#F44336" }}
      />,
    ]

    return (
      <Dialog
        actions={actions}
        modal={false}
        open={this.props.isOpen}
        onRequestClose={this.props.closeSettingsDialog}
      >
        <Tabs>
          <Tab label="General">
            <div>
              <h2 style={styles.headline}>Tab One</h2>
            </div>
          </Tab>
          <Tab label="Account">
            <div>
              <h2 style={styles.headline}>Change your password</h2>
              <TextField hintText="Old Password" />
              <br />
              <br />
              <TextField hintText="New Password" />
              <h2 style={styles.headline}>Delete your account</h2>
              <RaisedButton
                label="Delete your account"
                primary={true}
                onClick={this.handleDeleteDialogOpen}
                buttonStyle={{ backgroundColor: "#F44336" }}
              />
            </div>
          </Tab>
        </Tabs>
        <Dialog
          title="Are you sure you want to delete your account?"
          actions={deleteDialogActions}
          modal={true}
          open={this.state.deleteDialogOpen}
          contentStyle={deleteDialogContentStyle}
        >
          Lorem Ipsum
        </Dialog>
      </Dialog>
    )
  }
}
