import React, { Component } from "react";
import Sidebar from "./Sidebar";
import SidebarHeader from "./SidebarHeader";
import Tile from "./Tile";
import AppBar from "material-ui/AppBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FlatButton from "material-ui/FlatButton";
import "./App.css";
import "./Tiles.css";

class Main extends Component {
  constructor() {
    super();

    this.state = {
      showHidden: false
    };
  }

  render() {
    const visibleItems = [
      <Tile value={true} hidden={false} title="Test" className="large" />,
      <Tile value={true} hidden={false} title="ABC" />,
      <Tile value={false} hidden={false} title="Ehi" className="tall" />,
      <Tile value={false} hidden={false} title="Dumb" className="wide" />,
      <Tile value={true} hidden={false} title="Clone" className="tall" />,
      <Tile value={false} hidden={false} title="Tall" className="tall" />,
      <Tile value={true} hidden={false} title="Wide" className="wide" />,
      <Tile value={true} hidden={false} title="Small" />,
      <Tile value={false} hidden={false} title="Still readin?" />,
      <Tile value={true} hidden={false} title="Man!!" />,
      <Tile value={false} hidden={false} title="Stop" />,
      <Tile value={false} hidden={false} title="This is" />,
      <Tile value={false} hidden={false} title="too long" />
    ];

    const hiddenItems = [
      <Tile value={false} hidden={true} title="As you" />,
      <Tile value={true} hidden={true} title="can see" />,
      <Tile value={true} hidden={true} title="this values" />,
      <Tile value={false} hidden={true} title="are hidden" />
    ];

    return (
      <MuiThemeProvider>
        <div className="main">
          <div className="sidebarHeader">
            <SidebarHeader />
          </div>
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
              label={this.state.showHidden ? "Show less" : "Show more"}
              fullWidth={true}
              className="divider"
            />
            <div className="itemsList hiddenItems">
              {this.state.showHidden ? hiddenItems : ""}
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
