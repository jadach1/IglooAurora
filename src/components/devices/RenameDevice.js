import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Grow,
  Slide,
  Grid,
  Icon,
  FormControl,
  Input,
  InputAdornment,
  IconButton,
  MuiThemeProvider,
  createMuiTheme,
  Button,
} from "@material-ui/core"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class RenameDevice extends React.Component {
  state = { customName: this.props.device.customName }

  rename = () => {
    this.props["Rename"]({
      variables: {
        id: this.props.device.id,
        customName: this.state.customName,
      },
      optimisticResponse: {
        __typename: "Mutation",
        device: {
          __typename: this.props.device.__typename,
          id: this.props.device.id,
          customName: this.state.customName,
        },
      },
    })
    this.props.close()
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        className="notSelectable defaultCursor"
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={{ width: "350px" }}
        >
          Rename device
        </DialogTitle>
        <div style={{ height: "100%" }}>
          <MuiThemeProvider theme={theme}>
            <Grid
              container
              spacing={0}
              alignItems="flex-end"
              style={{
                width: "100%",
                paddingLeft: "24px",
                paddingRight: "24px",
              }}
            >
              <Grid item style={{ marginRight: "16px" }}>
                <Icon>lightbulb_outline</Icon>
              </Grid>
              <Grid item style={{ width: "calc(100% - 40px)" }}>
                <FormControl style={{ width: "100%" }}>
                  <Input
                    id="adornment-name-login"
                    placeholder="Board Name"
                    value={this.state.customName}
                    onChange={event =>
                      this.setState({
                        customName: event.target.value,
                      })
                    }
                    onKeyPress={event => {
                      if (event.key === "Enter") this.rename()
                    }}
                    endAdornment={
                      this.state.customName ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => this.setState({ customName: "" })}
                            onMouseDown={this.handleMouseDownPassword}
                            tabIndex="-1"
                          >
                            <Icon>clear</Icon>
                          </IconButton>
                        </InputAdornment>
                      ) : null
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </MuiThemeProvider>
        </div>
        <br />
        <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
          <MuiThemeProvider theme={theme}>
            <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
              Never mind
            </Button>
            <Button
              variant="raised"
              color="primary"
              primary={true}
              buttonStyle={{ backgroundColor: "#0083ff" }}
              onClick={this.rename}
              disabled={!this.state.customName}
            >
              Rename
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation Rename($id: ID!, $customName: String) {
      device(id: $id, customName: $customName) {
        id
        customName
      }
    }
  `,
  {
    name: "Rename",
  }
)(RenameDevice)
