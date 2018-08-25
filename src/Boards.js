import React, { Component } from "react"
import BoardsHeader from "./components/boards/BoardsHeader"
import BoardsBody from "./components/boards/BoardsBody"
import SettingsDialog from "./components/settings/SettingsDialog"
import { hotkeys } from "react-keyboard-shortcuts"

class Boards extends Component {
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

  render() {
    return (
      <React.Fragment>
        <BoardsHeader
          logOut={this.props.logOut}
          openSettings={() => this.setState({ settingsOpen: true })}
        />
        <BoardsBody
          userData={this.props.userData}
          selectBoard={this.props.selectBoard}
          searchBoards={this.props.searchBoards}
          searchText={this.props.boardsSearchText}
          snackBarHidden={this.props.snackBarHidden}
        />
        <SettingsDialog
          isOpen={this.state.settingsOpen}
          closeSettingsDialog={() => {
            this.setState({ settingsOpen: false })
          }}
          handleChange={this.handleSettingsTabChanged}
          slideIndex={this.state.slideIndex}
          userData={this.props.userData}
        />
      </React.Fragment>
    )
  }
}

export default hotkeys(Boards)
