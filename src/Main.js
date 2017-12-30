import React, {Component} from "react"
import Sidebar from "./Sidebar"

class Main extends Component {
    constructor() {
        super()

        this.state = {
            showHidden: false,
        }
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
            <div />,
        ]

        const hiddenItem = [<div />, <div />, <div />, <div />, <div />]

        return (
            <div className="main">
                <div className="sidebarHeader" />
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="mainBodyHeader" />
                <div className="mainBody">
                    {visibleItems}
                    <div className="divider" />
                </div>
            </div>
        )
    }
}

export default Main
