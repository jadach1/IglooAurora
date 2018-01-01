import React, {Component} from "react"
import {ApolloClient} from "apollo-client"
import {HttpLink} from "apollo-link-http"
import {
    InMemoryCache,
    IntrospectionFragmentMatcher,
} from "apollo-cache-inmemory"
import gql from "graphql-tag"
import Paper from "material-ui/Paper"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import TextField from "material-ui/TextField"
import FlatButton from "material-ui/FlatButton"

class UnAuthenticatedApp extends Component {
    constructor() {
        super()

        const link = new HttpLink({
            uri: "https://iglooql.herokuapp.com/graphql",
        })

        this.client = new ApolloClient({
            // By default, this client will send queries to the
            //  `/graphql` endpoint on the same host
            link,
            cache: new InMemoryCache(),
        })

        this.signIn = this.signIn.bind(this)
        this.state = {
            email: "",
            emailError: "",
            password: "",
            passwordError: "",
        }
    }

    async signIn() {
        try {
            const loginMutation = await this.client.mutate({
                mutation: gql`
                    mutation($email: String!, $password: String!) {
                        AuthenticateUser(email: $email, password: $password) {
                            id
                            token
                        }
                    }
                `,
                variables: {
                    email: this.state.email,
                    password: this.state.password,
                },
            })
            this.props.signIn(loginMutation.data.AuthenticateUser.token)
        } catch (e) {
            if (e.message === "GraphQL error: Wrong password") {
                this.setState({passwordError: "Incorrect password"})
            } else if (
                e.message ===
                "GraphQL error: User doesn't exist. Use `SignupUser` to create one"
            ) {
                this.setState({
                    emailError:
                        "This account does not exist, maybe you want to Sign Up?",
                })
            } else {
                console.log(e)
            }
        }
    }
    render() {
        return (
            <MuiThemeProvider>
                <div className="loginBackground">
                    <Paper className="loginForm" zDepth={3}>
                        <div className="leftSide">
                            <img
                                src="/assets/logo.svg"
                                width="120px"
                                height="120px"
                                className="logo notSelectable"
                            />
                            One platform for all your devices <br />
                            [phrase in progress]
                        </div>
                        <div className="rightSide">
                            <h1>Welcome back</h1>
                            <TextField
                                hintText="Email"
                                floatingLabelText="Email"
                                errorText={this.state.emailError}
                                value={this.state.email}
                                onChange={event =>
                                    this.setState({email: event.target.value})
                                }
                                onKeyPress={event => {
                                    if (event.key === "Enter") this.signIn()
                                }}
                            />
                            <br />
                            <TextField
                                hintText="Password"
                                floatingLabelText="Password"
                                errorText={this.state.passwordError}
                                type="password"
                                value={this.state.password}
                                onChange={event =>
                                    this.setState({
                                        password: event.target.value,
                                    })
                                }
                                onKeyPress={event => {
                                    if (event.key === "Enter") this.signIn()
                                }}
                            />
                            <br />
                            <br />
                            <br />
                            <FlatButton
                                label="Sign in"
                                fullWidth={true}
                                onClick={this.signIn}
                            />
                        </div>
                    </Paper>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default UnAuthenticatedApp
