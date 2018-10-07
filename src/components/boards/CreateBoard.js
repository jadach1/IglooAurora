import React from "react"
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
  Dialog,
  DialogActions,
  DialogTitle,
  Grow,
  Slide,
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

const MOBILE_WIDTH = 500

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
      <Slide direction="up" {...props} />
    )
}

class CreateBoard extends React.Component {
  state = { customName: "", favorite: false, slideIndex: 0 }

  selectImage = index => {
    switch (index) {
      case 0:
        return "DENALI"
      case 1:
        return "FOX"

      case 2:
        return "TREETOPS"

      case 3:
        return "PUFFIN"

      case 4:
        return "NORTHERN_LIGHTS"

      default:
        return "NORTHERN_LIGHTS"
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
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable"
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        n
        start
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={{ width: "350px" }}
        >
          Create board
        </DialogTitle>
        <MuiThemeProvider theme={theme}>
          <Grid
            container
            spacing={0}
            alignItems="flex-end"
            style={{ width: "100%", paddingLeft: "24px", paddingRight: "24px" }}
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
          style={{ paddingLeft: "24px", paddingRight: "24px" }}
          label="Set as favorite"
        />
        <br />
        <p>Choose a board image</p>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={value => {
            this.setState({
              slideIndex: value,
            })
          }}
          style={
            window.innerWidth < MOBILE_WIDTH
              ? {
                width: "calc(100vw - 48px)",
                marginLeft: "24px",
                marginRight: "24px",
              }
              : { width: "350px", marginLeft: "24px", marginRight: "24px" }
          }
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
        <div>
          <Button
            size="small"
            onClick={() =>
              this.setState(oldState => ({
                slideIndex: oldState.slideIndex - 1,
              }))
            }
            disabled={this.state.slideIndex === 0}
            style={{ width: "73px", marginLeft: "24px" }}
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
            style={{
              width: "73px",
              float: "right",
              marginRight: "24px",
              marginLeft: "auto",
            }}
          >
            Next
            <Icon>keyboard_arrow_right</Icon>
          </Button>
        </div>
        <div style={{ height: "100%" }} />
        <DialogActions
          className="notSelectable defaultCursor"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        >
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
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation CreateBoard(
      $customName: String!
      $favorite: Boolean
      $avatar: BoardAvatar
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
