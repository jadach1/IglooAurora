import React, {Component} from "react"
import Sidebar from "./Sidebar"
import SidebarHeader from "./SidebarHeader"
import Tile from "./Tile"
import AppBar from "material-ui/AppBar"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import FlatButton from "material-ui/FlatButton"

class Main extends Component {
    constructor() {
        super()

        this.state = {
            showHidden: false,
        }
    }

    render() {
        const visibleItems = [
            <Tile hidden={false} title="Test" className="large" />,
            <Tile hidden={false} title="ABC" />,
            <Tile hidden={false} title="Ehi" className="tall" />,
            <Tile hidden={false} title="Dumb" className="wide" />,
            <Tile hidden={false} title="Clone" className="tall" />,
            <Tile hidden={false} title="Tall" className="tall" />,
            <Tile hidden={false} title="Wide" className="wide" />,
            <Tile hidden={false} title="Small" />,
            <Tile hidden={false} title="Still readin?" />,
            <Tile hidden={false} title="Man!!" />,
            <Tile hidden={false} title="Stop" />,
            <Tile hidden={false} title="This is" />,
            <Tile hidden={false} title="too long" />,
        ]

        const hiddenItems = [
            <Tile hidden={true} title="As you" />,
            <Tile hidden={true} title="can see" />,
            <Tile hidden={true} title="this values" />,
            <Tile hidden={true} title="are hidden" />,
        ]

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
                                    showHidden: !oldState.showHidden,
                                }))
                            }
                            label={
                                this.state.showHidden
                                    ? "Show less"
                                    : "Show more"
                            }
                            fullWidth={true}
                            className="divider"
                        />
                        <div className="itemsList hiddenItems">
                            {this.state.showHidden ? hiddenItems : ""}
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Main
