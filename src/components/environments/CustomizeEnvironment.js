import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import SwipeableViews from "react-swipeable-views"
import fox from "../../styles/assets/fox.jpg"
import northernLights from "../../styles/assets/northernLights.jpg"
import denali from "../../styles/assets/denali.jpg"
import puffin from "../../styles/assets/puffin.jpg"
import treetops from "../../styles/assets/treetops.jpg"
import withMobileDialog from "@material-ui/core/withMobileDialog"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class CustomizeEnvironment extends React.Component {
  state = {
    nameEmpty: false,
    slideIndex: 0,
    initialSlideIndex: 0,
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

  rename = () => {
    this.props["Rename"]({
      variables: {
        id: this.props.environment.id,
        name: this.state.name,
        avatar: this.selectImage(this.state.slideIndex),
      },
      optimisticResponse: {
        __typename: "Mutation",
        environment: {
          __typename: this.props.environment.__typename,
          id: this.props.environment.id,
          name: this.state.name,
          avatar: this.selectImage(this.state.slideIndex),
        },
      },
    })
    this.props.close()
  }

  componentDidMount() {
    switch (this.props.environment.avatar) {
      case "DENALI":
        this.setState({ slideIndex: 0, initialSlideIndex: 0 })
        break
      case "FOX":
        this.setState({ slideIndex: 1, initialSlideIndex: 1 })
        break
      case "TREETOPS":
        this.setState({ slideIndex: 2, initialSlideIndex: 2 })
        break
      case "PUFFIN":
        this.setState({ slideIndex: 3, initialSlideIndex: 3 })
        break
      case "NORTHERN_LIGHTS":
        this.setState({ slideIndex: 4, initialSlideIndex: 4 })
        break
      default:
        this.setState({ slideIndex: 0, initialSlideIndex: 0 })
        break
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open && nextProps.open) {
      this.setState({ nameEmpty: false, name: nextProps.environment.name })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className="notSelectable defaultCursor"
        titleClassName="notSelectable defaultCursor"
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Customize environment</DialogTitle>
        <div style={{ height: "100%" }}>
          <TextField
            id="customize-environment-name"
            label="Name"
            value={this.state.name}
            variant="outlined"
            error={this.state.nameEmpty}
            helperText={this.state.nameEmpty ? "This field is required" : " "}
            onChange={event =>
              this.setState({
                name: event.target.value,
                nameEmpty: event.target.value === "",
              })
            }
            onKeyPress={event => {
              if (
                event.key === "Enter" &&
                !this.state.nameEmpty &&
                (this.state.initialSlideIndex !== this.state.slideIndex ||
                  this.props.environment.name !== this.state.name)
              )
                this.rename()
            }}
            style={{
              width: "calc(100% - 48px)",
              margin: "0 24px 16px 24px",
            }}
            InputProps={{
              endAdornment: this.state.name && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => this.setState({ name: "", nameEmpty: true })}
                    tabIndex="-1"
                    style={
                      typeof Storage !== "undefined" &&
                      localStorage.getItem("nightMode") === "true"
                        ? { color: "rgba(0, 0, 0, 0.46)" }
                        : { color: "rgba(0, 0, 0, 0.46)" }
                    }
                  >
                    <Icon>clear</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={value => {
              this.setState({
                slideIndex: value,
              })
            }}
            style={
              this.props.fullScreen
                ? {
                    width: "calc(100vw - 48px)",
                    marginLeft: "24px",
                    marginRight: "24px",
                  }
                : {
                    width: "calc(100% - 48px",
                    marginLeft: "24px",
                    marginRight: "24px",
                  }
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
            primary={true}
            buttonStyle={{ backgroundColor: "#0083ff" }}
            onClick={this.rename}
            disabled={
              !this.state.name ||
              (this.state.initialSlideIndex === this.state.slideIndex &&
                this.props.environment.name === this.state.name)
            }
          >
            Customize
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation Rename($id: ID!, $name: String, $avatar: EnvironmentPicture) {
      environment(id: $id, name: $name, avatar: $avatar) {
        id
        name
        avatar
      }
    }
  `,
  {
    name: "Rename",
  }
)(withMobileDialog({ breakpoint: "xs" })(CustomizeEnvironment))
