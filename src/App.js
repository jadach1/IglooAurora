import React, {Component} from "react"
import AuthenticatedApp from "./AuthenticatedApp"
import UnAuthenticatedApp from "./UnAuthenticatedApp"

class App extends Component {
    constructor() {
        super()
        this.state = {
            token: "",
        }
    }

    render() {
        if (this.state.token === "") {
            return (
                <UnAuthenticatedApp
                    signIn={bearer => this.setState({token: bearer})}
                />
            )
        } else {
            return (
                <AuthenticatedApp
                    bearer={this.state.token}
                    logOut={() => this.setState({token: ""})}
                />
            )
        }
    }
}

export default App
