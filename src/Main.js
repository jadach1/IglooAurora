import React, { Component } from "react";
import Sidebar from "./Sidebar";

class Main extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="main">
        <div className="sidebarHeader" />
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="mainBodyHeader" />
        <div className="mainBody">
          <div className="large" />
          <div />
          <div className="tall" />
          <div className="tall" />
          <div />
          <div className="wide" />
          <div className="tall" />
          <div className="wide" />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default Main;
