import React, {Component} from "react"

class MainBodyHeader extends Component {
    constructor() {
        super()
    }

    render() {
        return <div className="mainBodyHeader">{this.props.deviceId}</div>
    }
}

export default MainBodyHeader
