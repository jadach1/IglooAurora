import React, {Component} from "react"
import Sidebar from "./components/Sidebar"
import SidebarHeader from "./components/SidebarHeader"
import MainBody from "./components/MainBody"
import MainBodyHeader from "./components/MainBodyHeader"
import AppBar from "material-ui/AppBar"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
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
                <div className="main">
                    <SidebarHeader logOut={this.props.logOut} />
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
