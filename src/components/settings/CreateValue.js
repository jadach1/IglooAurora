import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import TextField from "material-ui/TextField"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

export default class CreateValue extends React.Component {
  state = { customName: false }

  render() {
    const actions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close}>Never mind</Button>
        <Button
          variant="raised"
          color="primary"
          label="Change"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.props.close}
          disabled={!this.state.customName}
        >
          Create
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title="Create value"
          actions={actions}
          open={this.props.open}
          contentStyle={{ width: "350px" }}
          onRequestClose={this.props.close}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <TextField
            floatingLabelShrinkStyle={{ color: "#0083ff" }}
            underlineFocusStyle={{ borderColor: "#0083ff" }}
            floatingLabelText="Value name"
            style={{ width: "100%" }}
            onKeyPress={event => {
              if (event.key === "Enter") this.openNameDialog()
            }}
            onChange={event =>
              this.setState({ customName: event.target.value })
            }
          />
        </Dialog>
      </React.Fragment>
    )
  }
}
