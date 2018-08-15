import React, { Component } from "react"
import BoardsHeader from "./components/boards/BoardsHeader"
import BoardsBody from "./components/boards/BoardsBody"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import SettingsDialog from "./components/settings/SettingsDialog"
import { hotkeys } from "react-keyboard-shortcuts"
import EmailNotVerified from "./components/EmailNotVerified"

class Boards extends Component {
  state = {
    slideIndex: 0,
    settingsOpen: false,
    searchText: "",
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
    const {
      userData: { user },
    } = this.props

    let emailIsVerified = false

    if (user) {
      emailIsVerified = user.emailIsVerified
    }

    return (
      <MuiThemeProvider>
        <BoardsHeader
          logOut={this.props.logOut}
          openSettings={() => this.setState({ settingsOpen: true })}
          changeText={text => this.setState({ searchText: text })}
          searchText={this.state.searchText}
        />
        <BoardsBody
          userData={this.props.userData}
          selectBoard={this.props.selectBoard}
          searchText={this.state.searchText}
        />
        <SettingsDialog
          isOpen={this.state.settingsOpen}
          closeSettingsDialog={() => {
            this.setState({ settingsOpen: false })
          }}
          handleChange={this.handleSettingsTabChanged}
          slideIndex={this.state.slideIndex}
        />
        {!emailIsVerified && <EmailNotVerified mobile={false} />}
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(Boards)
