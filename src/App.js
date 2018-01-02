import React, {Component} from "react"
import AuthenticatedApp from "./AuthenticatedApp"
import UnAuthenticatedApp from "./UnAuthenticatedApp"
import jwt from "jsonwebtoken"

class App extends Component {
    constructor() {
        super()

        let bearer = ""
        // reuse previous session's bearer if present
        if (typeof Storage !== "undefined") {
            bearer = localStorage.getItem("bearer") || ""

            // ask for a new token 1 day before the expiration date
            if (bearer !== "") {
                const expirationDate = jwt.decode(bearer).exp
                const tomorrow = Math.floor(new Date() / 1000) + 86400
                if (expirationDate < tomorrow) {
                    bearer = ""
                    localStorage.setItem("bearer", "")
                }
            }
        }
        this.state = {
            bearer,
        }
    }

    render() {
        const signIn = bearer => {
            this.setState({bearer})
            if (typeof Storage !== "undefined") {
                localStorage.setItem("bearer", bearer)
            }
        }

        const logOut = () => {
            this.setState({bearer: ""})
            if (typeof Storage !== "undefined") {
                localStorage.setItem("bearer", "")
            }
        }

        if (this.state.bearer === "") {
            return <UnAuthenticatedApp signIn={signIn} />
        } else {
            return (
                <AuthenticatedApp bearer={this.state.bearer} logOut={logOut} />
            )
        }
    }
}

export default App
