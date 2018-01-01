import React, {Component} from "react"

class SidebarHeader extends Component {
    render() {
        return (
            <img
                src="/assets/logo.svg"
                width="60px"
                height="60px"
                className="logo notSelectable"
            />
        )
    }
}

export default SidebarHeader
