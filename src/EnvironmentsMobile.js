import React, { Component } from "react"
import EnvironmentsHeader from "./components/environments/EnvironmentsHeader"
import SettingsDialog from "./components/settings/SettingsDialog"
import { hotkeys } from "react-keyboard-shortcuts"
import EnvironmentsBodyMobile from "./components/environments/EnvironmentsBodyMobile"

class EnvironmentsMobile extends Component {
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
        <EnvironmentsHeader
          logOut={this.props.logOut}
          openSettings={this.props.openSettings}
          closeSettings={this.props.closeSettings}
          areSettingsOpen={this.props.areSettingsOpen}
          user={this.props.userData.user}
        />
        <EnvironmentsBodyMobile
          userData={this.props.userData}
          selectEnvironment={this.props.selectEnvironment}
          searchEnvironments={this.props.searchEnvironments}
          searchText={this.props.environmentsSearchText}
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

export default hotkeys(EnvironmentsMobile)
