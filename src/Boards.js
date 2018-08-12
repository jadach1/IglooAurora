import React, { Component } from "react"
import BoardsHeader from "./components/BoardsHeader"
import BoardsBody from "./components/BoardsBody"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"

class Boards extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <BoardsHeader logOut={this.props.logOut} />
        <BoardsBody
          userData={this.props.userData}
          selectBoard={this.props.selectBoard}
        />
      </MuiThemeProvider>
    )
  }
}

export default Boards
