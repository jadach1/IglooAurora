import React, { Component } from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import { Offline, Online } from "react-detect-offline"
import "./styles/App.css"
import "./styles/Tiles.css"

class Main extends Component {
  constructor() {
    super()

    this.state = {
      showHidden: false,
      selectedDevice: "",
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <Online>
          <div className="main">
            <div className="invisibleHeader" key="invisibleHeader" />
            <SidebarHeader logOut={this.props.logOut} key="sidebarHeader" />
            <div className="sidebar" key="sidebar">
              <Sidebar
                selectDevice={id => this.setState({ selectedDevice: id })}
              />
            </div>
            {this.state.selectedDevice !== "" ? (
              <MainBodyHeader
                deviceId={this.state.selectedDevice}
                key="mainBodyHeader"
              />
            ) : (
              <div className="mainBodyHeader" key="mainBodyHeader" />
            )}
            {this.state.selectedDevice !== "" ? (
              <MainBody deviceId={this.state.selectedDevice} />
            ) : (
              <div className="mainBody" />
            )}
          </div>
        </Online>

        <Offline key="offlineMainBody">
          <div className="main">
            <div className="invisibleHeader" key="invisibleHeader" />
            <SidebarHeader logOut={this.props.logOut} key="sidebarHeader" />
            <div className="sidebar" key="sidebar" />
            <div className="mainBodyHeader" key="mainBodyHeader" />
            <div className="offlineBody mainBody">
              <font size="6">You are not connected, try again in a while</font>
              <br />
              <font size="5">In the meantime why don't you have a nap?</font>
              <br />
              <img
                alt="Sleeping Polar Bear"
                src="/assets/polarBear.svg"
                width="400"
                height="400"
                className="logo notSelectable"
              />
            </div>
          </div>
        </Offline>
      </MuiThemeProvider>
    )
  }
}

export default Main
