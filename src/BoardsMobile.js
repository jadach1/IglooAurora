import React, { Component } from "react"
import BoardsHeader from "./components/boards/BoardsHeader"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import SettingsDialogMobile from "./components/settings/SettingsDialog"
import { hotkeys } from "react-keyboard-shortcuts"
import BoardsBodyMobile from "./components/boards/BoardsBodyMobile"
import EmailNotVerified from "./components/EmailNotVerified"

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
        />
        <BoardsBodyMobile
          userData={this.props.userData}
          selectBoard={this.props.selectBoard}
        />
        <SettingsDialogMobile
          isOpen={this.state.settingsOpen}
          closeSettingsDialog={() => {
            this.setState({ settingsOpen: false })
          }}
          handleChange={this.handleSettingsTabChanged}
          slideIndex={this.state.slideIndex}
          handleChangeBTIndex={this.handleChangeBTIndex}
        />
        {!emailIsVerified && <EmailNotVerified mobile={true} />}
      </MuiThemeProvider>
    )
  }
}

export default hotkeys(BoardsMobile)
