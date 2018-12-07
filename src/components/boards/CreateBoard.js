import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import fox from "../../styles/assets/fox.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"
import denali from "../../styles/assets/denali.jpg"
import puffin from "../../styles/assets/puffin.jpg"
import treetops from "../../styles/assets/treetops.jpg"
import SwipeableViews from "react-swipeable-views"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class CreateBoard extends React.Component {
  state = {
    name: "",
    favorite: false,
    slideIndex: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open === true) {
      this.setState({ slideIndex: Math.floor(Math.random() * 5) })
    }
  }

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
        name: this.state.name,
        avatar: this.selectImage(this.state.slideIndex),
      },
      optimisticResponse: {
        __typename: "Mutation",
        CreateBoard: {
          name: this.state.name,
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
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Create board</DialogTitle>
        <div style={{ height: "100%" }}>
          <FormControl
            style={{
              width: "calc(100% - 48px)",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <Input
              id="adornment-name-login"
              placeholder="Board Name"
              value={this.state.name}
              onChange={event =>
                this.setState({
                  name: event.target.value,
                })
              }
              onKeyPress={event => {
                if (event.key === "Enter") this.createBoardMutation()
              }}
              endAdornment={
                this.state.name ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => this.setState({ name: "" })}
                      onMouseDown={this.handleMouseDownPassword}
                      tabIndex="-1"
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      <Icon>clear</Icon>
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
            />
          </FormControl>

          <br />
          <br />
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
                : { marginLeft: "24px", marginRight: "24px" }
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
        </div>
        <DialogActions>
          <Button onClick={this.props.close}>Never mind</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={this.createBoardMutation}
            disabled={!this.state.name}
          >
            Create board
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation CreateBoard($name: String!, $avatar: BoardPicture) {
      createBoard(name: $name, avatar: $avatar) {
        id
        name
        avatar
      }
    }
  `,
  {
    name: "CreateBoard",
  }
)(CreateBoard)
