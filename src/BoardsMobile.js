import React, { Component } from "react"
import BoardsHeader from "./components/boards/BoardsHeader"
import SettingsDialog from "./components/settings/SettingsDialog"
import { hotkeys } from "react-keyboard-shortcuts"
import BoardsBodyMobile from "./components/boards/BoardsBodyMobile"

class BoardsMobile extends Component {
  state = {
    slideIndex: 0,
    settingsOpen: false,
  }

  hot_keys = {
    "alt+1": {
      priority: 1,
      handler: event => {
        if (this.props.settingsOpen) this.setState({ slideIndex: 0 })
      },
    },
    "alt+2": {
      priority: 1,
      handler: event => {
        if (this.props.settingsOpen) this.setState({ slideIndex: 1 })
      },
    },
    "alt+3": {
      priority: 1,
      handler: event => {
        if (
          this.props.settingsOpen &&
          typeof Storage !== "undefined" &&
          localStorage.getItem("devMode") === "true"
        )
          this.setState({ slideIndex: 2 })
      },
    },
  }

  handleSettingsTabChanged = (event, value) => {
    this.setState({
      slideIndex: value,
    })
  }

  handleChangeBTIndex = (event, value) => {
    this.setState({ slideIndex: value })
  }

  render() {
    return (
      <React.Fragment>
        <BoardsHeader
          logOut={this.props.logOut}
          openSettings={this.props.openSettings}
          closeSettings={this.props.closeSettings}
          areSettingsOpen={this.props.areSettingsOpen}
          user={this.props.userData.user}
        />
        <BoardsBodyMobile
          userData={this.props.userData}
          selectBoard={this.props.selectBoard}
          searchBoards={this.props.searchBoards}
          searchText={this.props.boardsSearchText}
          client={this.props.client}
        />
        <SettingsDialog
          isOpen={this.props.settingsOpen}
          closeSettingsDialog={this.props.closeSettings}
          handleChange={this.handleSettingsTabChanged}
          slideIndex={this.state.slideIndex}
          handleChangeBTIndex={this.handleChangeBTIndex}
          userData={this.props.userData}
          logOut={this.props.logOut}
          handleSwipe={index => {
            this.setState({ slideIndex: index })
          }}
          forceUpdate={this.props.forceUpdate}
          client={this.props.client}
        />
      </React.Fragment>
    )
  }
}

export default hotkeys(BoardsMobile)
