import React, { Component } from "react"
import BoardsHeader from "./components/BoardsHeader"
import BoardsBody from "./components/BoardsBody"

class Boards extends Component {
  render() {
    return (
      <React.Fragment>
        <BoardsHeader logOut={this.props.logOut} />
        <BoardsBody
          userData={this.props.userData}
          selectBoard={this.props.selectBoard}
        />
      </React.Fragment>
    )
  }
}

export default Boards
