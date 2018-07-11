import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Avatar from "material-ui-next/Avatar"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const nameDialogContentStyle = {
  width: "350px",
}

const colorsArray = [
  "#0057cb",
  "#f50057",
  "#23a82c",
  "#7100db",
  "#f20505",
  "#18ba77",
]

let random

export default class ChangeNameDialog extends React.Component {
  state = {
    nameDialogOpen: false,
    content: "",
  }

  closeNameDialog = () => {
    this.setState({ nameDialogOpen: false })
  }

  getInitials = string => {
    var names = string.trim().split(" "),
      initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }
    return initials
  }

  componentDidMount() {
    random = Math.floor(Math.random() * colorsArray.length)
  }

  render() {
    const nameDialogActions = [
      <MuiThemeProvider theme={theme}>
        <Button
          onClick={this.props.handleNameDialogClose}
          style={{ marginRight: "4px" }}
        >
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          label="Change"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.handleNameSnackOpen}
        >
          Change
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Manage your profile"
          actions={nameDialogActions}
          open={this.props.confirmationDialogOpen}
          contentStyle={nameDialogContentStyle}
          onRequestClose={this.props.handleNameDialogClose}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <Avatar
            style={{
              backgroundColor: colorsArray[random],
              width: "96px",
              height: "96px",
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "48px",
            }}
            className="defaultCursor"
          >
            {this.getInitials(this.state.content)}
          </Avatar>
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="User name"
            style={{ width: "100%" }}
            onChange={event => this.setState({ content: event.target.value })}
            onKeyPress={event => {
              if (event.key === "Enter") this.openNameSnack()
            }}
          />
        </Dialog>
      </React.Fragment>
    )
  }
}
