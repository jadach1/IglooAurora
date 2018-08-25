import React, { Component } from "react"
import BoardsHeader from "./components/boards/BoardsHeader"
import SettingsDialogMobile from "./components/settings/SettingsDialogMobile"
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
        this.setState({ slideIndex: 0 })
      },
    },

    "alt+2": {
      priority: 1,
      handler: event => {
        this.setState({ slideIndex: 1 })
      },
    },
    "alt+3": {
      priority: 1,
      handler: event => {
        this.setState({ slideIndex: 2 })
      },
    },
  }

  handleSettingsTabChanged = value => {
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
          openSettings={() => this.setState({ settingsOpen: true })}
        />
        <BoardsBodyMobile
          userData={this.props.userData}
          selectBoard={this.props.selectBoard}
          searchBoards={this.props.searchBoards}
          searchText={this.props.boardsSearchText}
        />
        <SettingsDialogMobile
          isOpen={this.state.settingsOpen}
          closeSettingsDialog={() => {
            this.setState({ settingsOpen: false })
          }}
          handleChange={this.handleSettingsTabChanged}
          slideIndex={this.state.slideIndex}
          handleChangeBTIndex={this.handleChangeBTIndex}
          userData={this.props.userData}
        />
      </React.Fragment>
    )
  }
}

export default hotkeys(BoardsMobile)
