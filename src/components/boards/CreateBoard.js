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
import fox from "../../styles/assets/fox.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"
import denali from "../../styles/assets/denali.jpg"
import puffin from "../../styles/assets/puffin.jpg"
import treetops from "../../styles/assets/treetops.jpg"
import SwipeableViews from "react-swipeable-views"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
  },
})

class CreateBoard extends React.Component {
  state = { customName: "", favorite: false, slideIndex: 0 }

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

  createBoardMutation = () => {
    this.props.CreateBoard({
      variables: {
        customName: this.state.customName,
        favorite: this.state.favorite,
        avatar: this.selectImage(this.state.slideIndex),
      },
      optimisticResponse: {
        __typename: "Mutation",
        CreateBoard: {
          customName: this.state.customName,
          favorite: this.state.favorite,
          avatar: this.selectImage(this.state.slideIndex),
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
        <br /> <br />
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
    mutation CreateBoard(
      $customName: String!
      $favorite: Boolean
      $avatar: String
    ) {
      CreateBoard(
        customName: $customName
        favorite: $favorite
        avatar: $avatar
      ) {
        id
        customName
        favorite
        avatar
      }
    }
  `,
  {
    name: "CreateBoard",
  }
)(CreateBoard)
