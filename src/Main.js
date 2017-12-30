import React, { Component } from "react";
import Sidebar from "./Sidebar";
import SidebarHeader from "./SidebarHeader";
import AppBar from "material-ui/AppBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FlatButton from "material-ui/FlatButton";

class Main extends Component {
  constructor() {
    super();

    this.state = {
      showHidden: false
    };
  }

  render() {
    const visibleItems = [
      <div className="large" />,
      <div />,
      <div className="tall" />,
      <div className="tall" />,
      <div />,
      <div className="wide" />,
      <div className="tall" />,
      <div className="wide" />,
      <div />,
      <div />,
      <div />,
      <div />,
      <div />,
      <div />
    ];

    const hiddenItems = [<div />, <div />, <div />, <div />, <div />];

    return (
      <MuiThemeProvider>
        <div className="main">
          <div className="sidebarHeader" />
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="mainBodyHeader" />
          <div className="mainBody">
            <div className="itemsList">{visibleItems}</div>
            <FlatButton
              onClick={() =>
                this.setState(oldState => ({
                  showHidden: !oldState.showHidden
                }))
              }
              label="Show more"
              fullWidth={true}
              className="divider"
            />
            <div
              className="itemsList hiddenItems"
              style={{
                maxHeight: this.state.showHidden ? "100000px" : "0"
              }}
            >
              {this.state.showHidden ? hiddenItems : ""}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
