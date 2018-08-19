import React from "react"
import Dialog from "material-ui/Dialog"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import {
  FormControlLabel,
  Checkbox,
  Icon,
  Button,
  MuiThemeProvider,
  createMuiTheme,
  Grid,
  FormControl,
  Input,
  InputAdornment,
  IconButton,
} from "@material-ui/core"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class CreateBoard extends React.Component {
  state = { customName: "", favorite: false }

  createBoardMutation = () => {
    this.props.CreateBoard({
      variables: {
        customName: this.state.customName,
        favorite: this.state.favorite,
      },
      optimisticResponse: {
        __typename: "Mutation",
        CreateBoard: {
          customName: this.state.customName,
          favorite: this.state.favorite,
          __typename: "Board",
        },
      },
    })
    this.props.close()
  }

  render() {
    const createBoardActions = [
      <MuiThemeProvider theme={theme}>
        <Button onClick={this.props.close} style={{ marginRight: "4px" }}>
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          primary={true}
          buttonStyle={{ backgroundColor: "#0083ff" }}
          onClick={this.createBoardMutation}
          disabled={!this.state.customName}
        >
          Create board
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Create board"
        actions={createBoardActions}
        open={this.props.open}
        onRequestClose={this.props.close}
        className="notSelectable"
        contentStyle={{
          width: "350px",
        }}
        titleClassName="notSelectable defaultCursor"
      >
        <MuiThemeProvider theme={theme}>
          <Grid
            container
            spacing={0}
            alignItems="flex-end"
            style={{ width: "100%" }}
          >
            <Grid item style={{ marginRight: "16px" }}>
              <Icon>widgets</Icon>
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
                    if (event.key === "Enter") this.createBoardMutation()
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
        <br />
        <FormControlLabel
          control={
            <MuiThemeProvider
              theme={createMuiTheme({
                palette: {
                  secondary: { main: "#0083ff" },
                },
              })}
            >
              <Checkbox
                onChange={event =>
                  this.setState({ favorite: event.target.checked })
                }
                icon={<Icon>star_border</Icon>}
                checkedIcon={<Icon>star</Icon>}
              />
            </MuiThemeProvider>
          }
          label="Set as favorite"
        />
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation CreateBoard($customName: String!, $favorite: Boolean) {
      CreateBoard(customName: $customName, favorite: $favorite) {
        id
        customName
        favorite
      }
    }
  `,
  {
    name: "CreateBoard",
  }
)(CreateBoard)
