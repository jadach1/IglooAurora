import React, {Component} from "react"
import Sidebar from "./Sidebar"
import SidebarHeader from "./SidebarHeader"
import MainBody from "./MainBody"
import MainBodyHeader from "./MainBodyHeader"
import AppBar from "material-ui/AppBar"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import "./App.css"
import "./Tiles.css"

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
                <div className="main">
                    <div className="sidebarHeader">
                        <SidebarHeader />
                    </div>
                    <div className="sidebar">
                        <Sidebar
                            selectDevice={id =>
                                this.setState({selectedDevice: id})
                            }
                        />
                    </div>

                    {this.state.selectedDevice !== ""
                        ? [
                              <MainBodyHeader
                                  deviceId={this.state.selectedDevice}
                              />,
                              <MainBody deviceId={this.state.selectedDevice} />,
                          ]
                        : [
                              <div className="mainBodyHeader" />,
                              <div className="mainBody" />,
                          ]}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Main
