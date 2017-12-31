import React, {Component} from "react"
import Sidebar from "./Sidebar"
import SidebarHeader from "./SidebarHeader"
import MainBody from "./MainBody"
import AppBar from "material-ui/AppBar"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import "./App.css"
import "./Tiles.css"

class Main extends Component {
    constructor() {
        super()

        this.state = {
            showHidden: false,
        }
    }

    render() {
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
                    <MainBody deviceId="03f5f343-6b27-4605-aff9-f2c4d9e3fd56" />
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Main
