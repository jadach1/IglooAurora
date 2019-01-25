import React, { Component } from "react"
import gql from "graphql-tag"
import Typography from "@material-ui/core/Typography"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import Avatar from "@material-ui/core/Avatar"
import PersonAdd from "@material-ui/icons/PersonAdd"
import ListItemText from "@material-ui/core/ListItemText"
import { Link } from "react-router-dom"
import Person from "@material-ui/icons/Person"
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline"

export default class AccountSwitcher extends Component {
  constructor() {
    super()

    this.state = {
      recoveryError: "",
      forgotPasswordOpen: false,
      isMailEmpty: false,
      isPasswordEmpty: false,
      showLoading: false,
      redirect: false,
    }

    this.signIn = this.signIn.bind(this)
    this.recover = this.recover.bind(this)
  }

  async signIn() {
    try {
      this.props.changePasswordError("")
      this.props.changeEmailError("")
      const loginMutation = await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            logIn(email: $email, password: $password) {
              token
              user {
                id
                email
                name
                profileIconColor
              }
            }
          }
        `,
        variables: {
          email: this.props.email,
          password: this.props.password,
        },
      })

      this.props.signIn(
        loginMutation.data.logIn.token,
        loginMutation.data.logIn.user
      )

      this.props.changePassword("")
    } catch (e) {
      this.setState({ showLoading: false })

      if (e.message === "GraphQL error: Wrong password") {
        this.props.changePasswordError("Wrong password")
      } else if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.props.changeEmailError("This account doesn't exist")
        this.props.changeSignupEmail(this.props.email)
      } else {
        this.props.changeEmailError("Unexpected error")
      }
    }
  }

  async recover(recoveryEmail) {
    try {
      this.setState({ recoveryError: "" })
      await this.props.client.mutate({
        mutation: gql`
          mutation($email: String!) {
            sendPasswordRecoveryEmail(email: $email)
          }
        `,
        variables: {
          email: recoveryEmail,
        },
      })
    } catch (e) {
      if (
        e.message ===
        "GraphQL error: User doesn't exist. Use `signUp` to create one"
      ) {
        this.setState({
          recoveryError: "This account does not exist",
        })
      } else {
      }
    }
  }

  getInitials = string => {
    if (string) {
      var names = string.trim().split(" "),
        initials = names[0].substring(0, 1).toUpperCase()

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
      }
      return initials
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="rightSide notSelectable"
          style={{ overflowY: "hidden", padding: "32px 0" }}
        >
          <Typography
            variant="h3"
            gutterBottom
            className="defaultCursor"
            style={{ color: "#0083ff", textAlign: "center" }}
          >
            Log in
          </Typography>
          <br />
          <List>
            {typeof Storage !== undefined &&
              localStorage.getItem("accountList") &&
              JSON.parse(localStorage.getItem("accountList")).map(account => (
                <ListItem
                  button
                  onClick={
                    account.token
                      ? () => {
                          this.props.signIn(account.token, account)
                        }
                      : () => {}
                  }
                >
                  <Avatar style={{ backgroundColor: account.profileIconColor }}>
                    {this.getInitials(account.name)}
                  </Avatar>
                  <ListItemText
                    style={{ cursor: "pointer" }}
                    primary={
                      <font>
                        {account.name}
                        {!account.token && (
                          <font style={{ color: "black", opacity: "0.54" }}>
                            {" "}
                            (signed out)
                          </font>
                        )}
                      </font>
                    }
                    secondary={account.email}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      style={
                        typeof Storage !== "undefined" &&
                        localStorage.getItem("nightMode") === "true"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      <RemoveCircleOutline
                        onClick={() => {
                          localStorage.setItem(
                            "accountList",
                            JSON.stringify(
                              JSON.parse(
                                localStorage.getItem("accountList")
                              ).filter(
                                listAccount => listAccount.id !== account.id
                              )
                            )
                          )
                          this.props.forceUpdate()
                        }}
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            <ListItem button component={Link} to="/login?from=accounts">
              <ListItemAvatar>
                <Avatar
                  style={{ backgroundColor: "transparent", color: "black" }}
                >
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Use existing account"
                style={{ cursor: "pointer" }}
              />
            </ListItem>
            <ListItem button component={Link} to="/signup?from=accounts">
              <ListItemAvatar>
                <Avatar
                  style={{ backgroundColor: "transparent", color: "black" }}
                >
                  <PersonAdd />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Create new account"
                style={{ cursor: "pointer" }}
              />
            </ListItem>
          </List>
        </div>
      </React.Fragment>
    )
  }
}
