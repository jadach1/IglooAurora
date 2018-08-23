import React from "react"
import Dialog from "material-ui/Dialog"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import {
  MuiThemeProvider,
  createMuiTheme,
  Button,
  Grid,
  FormControl,
  Input,
  InputAdornment,
  IconButton,
  Icon,
} from "material-ui-next/"
import SwipeableViews from "react-swipeable-views"
import fox from "../../styles/assets/fox.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"
import denali from "../../styles/assets/denali.jpg"
import puffin from "../../styles/assets/puffin.jpg"
import treetops from "../../styles/assets/treetops.jpg"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class RenameBoard extends React.Component {
  state = { customName: this.props.board.customName, slideIndex: 0 }

  selectImage = index => {
    switch (index) {
      case 0:
        return "denali"
      case 1:
        return "fox"

      case 2:
        return "treetops"

      case 3:
        return "puffin"

      case 4:
        return "northernLights"

      default:
        return "northernLights"
    }
  }

  rename = () => {
    this.props["Rename"]({
      variables: {
        id: this.props.board.id,
        customName: this.state.customName,
        avatar: this.selectImage(this.state.slideIndex),
      },
      optimisticResponse: {
        __typename: "Mutation",
        board: {
          __typename: this.props.board.__typename,
          id: this.props.board.id,
          customName: this.state.customName,
          avatar: this.selectImage(this.state.slideIndex),
        },
      },
    })
    this.props.close()
  }

  componentDidMount() {
    switch (this.props.board.avatar) {
      case "denali":
        this.setState({ slideIndex: 0 })
        break
      case "fox":
        this.setState({ slideIndex: 1 })
        break
      case "treetops":
        this.setState({ slideIndex: 2 })
        break
      case "puffin":
        this.setState({ slideIndex: 3 })
        break
      case "northernLights":
        this.setState({ slideIndex: 4 })
        break
      default:
        this.setState({ slideIndex: 0 })
        break
    }
  }

  render() {
    const renameBoardActions = [
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
          Customize
        </Button>
      </MuiThemeProvider>,
    ]

    return (
      <Dialog
        title="Customize board"
        actions={renameBoardActions}
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
        <br />
        <br />
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={value => {
            this.setState({
              slideIndex: value,
            })
          }}
        >
          <img
            src={denali}
            alt="Mt. Denali"
            className="notSelectable"
            style={{
              width: "100%",
            }}
          />
          <img
            src={fox}
            alt="Fox"
            className="notSelectable"
            style={{
              width: "100%",
            }}
          />
          <img
            src={treetops}
            alt="treetops"
            className="notSelectable"
            style={{
              width: "100%",
            }}
          />
          <img
            src={puffin}
            alt="Puffin"
            className="notSelectable"
            style={{
              width: "100%",
            }}
          />
          <img
            src={northernLights}
            alt="Northern lights"
            className="notSelectable"
            style={{
              width: "100%",
            }}
          />
        </SwipeableViews>
        <Button
          size="small"
          onClick={() =>
            this.setState(oldState => ({
              slideIndex: oldState.slideIndex - 1,
            }))
          }
          disabled={this.state.slideIndex === 0}
        >
          <Icon>keyboard_arrow_left</Icon>
          Back
        </Button>
        <Button
          size="small"
          onClick={() =>
            this.setState(oldState => ({
              slideIndex: oldState.slideIndex + 1,
            }))
          }
          disabled={this.state.slideIndex === 4}
          style={{ float: "right" }}
        >
          Next
          <Icon>keyboard_arrow_right</Icon>
        </Button>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation Rename($id: ID!, $customName: String, $avatar: String) {
      board(id: $id, customName: $customName, avatar: $avatar) {
        id
        customName
        avatar
      }
    }
  `,
  {
    name: "Rename",
  }
)(RenameBoard)
