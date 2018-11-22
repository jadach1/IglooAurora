import React from "react"
import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"
import Icon from "@material-ui/core/Icon"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import CenteredSpinner from "../CenteredSpinner"
import moment from "moment"
import Moment from "react-moment"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import FormControl from "@material-ui/core/FormControl"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import ToggleIcon from "material-ui-toggle-icon"

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class AuthDialog extends React.Component {
  state = {
    authSnackOpen: false,
    authDialogOpen: false,
    tokenName: "",
    password: "",
    token: "",
  }

  constructor() {
    super()

    const link = new HttpLink({
      uri:
        typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
          ? localStorage.getItem("server") + "/graphql"
          : `http://iglooql.herokuapp.com/graphql`,
    })

    this.client = new ApolloClient({
      // By default, this client will send queries to the
      //  `/graphql` endpoint on the same host
      link,
      cache: new InMemoryCache(),
    })
  }

  deletePermanentToken = tokenID => {
    this.props["DeletePermanentAccesToken"]({
      variables: {
        id: tokenID,
      },
      optimisticResponse: {
        __typename: "Mutation",
        DeletePermanentAccesToken: {
          id: tokenID,
        },
      },
    })
  }

  openAuthDialog = () => {
    this.setState({ authDialogOpen: true })
    this.props.handleAuthDialogClose()
  }

  closeAuthDialog = () => {
    this.setState({ authDialogOpen: false })
  }

  async getPermanentToken() {
    const tokenMutation = await this.client.mutate({
      mutation: gql`
        mutation GeneratePermanentAccessToken($customName: String!) {
          GeneratePermanentAccessToken(customName: $customName) {
            token
          }
        }
      `,
      variables: {
        customName: this.state.tokenName,
      },
    })

    this.setState({
      token: tokenMutation.data.GeneratePermanentAccessToken.token,
    })
  }

  render() {
    let tokenList = ""

    if (this.props.tokenData.error) tokenList = "Unexpected error"

    if (this.props.tokenData.loading || (this.props.tokenData.user && !this.props.tokenData.user.permanentTokens)) tokenList = <CenteredSpinner />

    if (this.props.tokenData.user && this.props.tokenData.user.permanentTokens)
      tokenList = (
        <List style={{ padding: "0" }}>
          {this.props.tokenData.user.permanentTokens.map(token => (
            <ListItem button>
              <ListItemIcon>
                <Icon>vpn_key</Icon>
              </ListItemIcon>
              <ListItemText
                primary={token.customName}
                secondary={
                  token.lastUsed ? (
                    <React.Fragment>
                      Last used{" "}
                      <Moment fromNow>
                        {moment.utc(
                          token.lastUsed.split(".")[0],
                          "YYYY-MM-DDTh:mm:ss"
                        )}
                      </Moment>
                    </React.Fragment>
                  ) : (
                    "Never used"
                  )
                }
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => this.deletePermanentToken(token.id)}>
                  <Icon>delete</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem
            button
            onClick={() =>
              this.setState({ nameOpen: true, authDialogOpen: false })
            }
          >
            <ListItemIcon>
              <Icon>add</Icon>
            </ListItemIcon>
            <ListItemText primary="Get a new permanent token" />
          </ListItem>
        </List>
      )

    return (
      <React.Fragment>
        <Dialog
          open={this.props.confirmationDialogOpen}
          onClose={this.props.handleAuthDialogClose}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Type your password
          </DialogTitle>
          <div
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
              height: "100%",
            }}
          >
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-password-login"
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                placeholder="Password"
                onChange={event =>
                  this.setState({
                    password: event.target.value,
                    passwordError: "",
                    isPasswordEmpty: event.target.value === "",
                  })
                }
                error={
                  this.state.passwordError || this.state.isPasswordEmpty
                    ? true
                    : false
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.openAuthDialog()
                }}
                endAdornment={
                  this.state.password ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
                      >
                        {/* fix for ToggleIcon glitch on Edge */}
                        {document.documentMode ||
                        /Edge/.test(navigator.userAgent) ? (
                          this.state.showPassword ? (
                            <Icon>visibility_off</Icon>
                          ) : (
                            <Icon>visibility</Icon>
                          )
                        ) : (
                          <ToggleIcon
                            on={this.state.showPassword || false}
                            onIcon={<Icon>visibility_off</Icon>}
                            offIcon={<Icon>visibility</Icon>}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
            <br />
            <br />
          </div>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={this.props.handleAuthDialogClose}
                style={{ marginRight: "4px" }}
              >
                Never Mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                onClick={this.openAuthDialog}
              >
                Proceed
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.authDialogOpen}
          onClose={this.closeAuthDialog}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Manage authorizations
          </DialogTitle>
          <div
            style={{
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingBottom: "0px",
              height: "100%",
            }}
          >
            {tokenList}
          </div>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme}>
              <Button onClick={this.closeAuthDialog}>Close</Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.nameOpen}
          onClose={() => this.setState({ nameOpen: false })}
          className="notSelectable"
          TransitionComponent={Transition}
          fullScreen={window.innerWidth < MOBILE_WIDTH}
        >
          <DialogTitle style={{ width: "350px" }}>
            Choose a token name
          </DialogTitle>
          <div
            style={{
              paddingRight: "24px",
              paddingLeft: "24px",
              height: "100%",
            }}
          >
            <FormControl style={{ width: "100%" }}>
              <Input
                id="adornment-password-login"
                value={this.state.tokenName}
                placeholder="Token"
                onChange={event =>
                  this.setState({
                    tokenName: event.target.value,
                  })
                }
                onKeyPress={event => {
                  if (event.key === "Enter") this.getPermanentToken()
                }}
                endAdornment={
                  this.state.tokenName ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => this.setState({ tokenName: "" })}
                        onMouseDown={this.handleMouseDownPassword}
                        tabIndex="-1"
                      >
                        <Icon>close</Icon>
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }
              />
            </FormControl>
            <br />
            <br />
          </div>
          <DialogActions style={{ marginLeft: "8px", marginRight: "8px" }}>
            <MuiThemeProvider theme={theme}>
              <Button
                onClick={() =>
                  this.setState({ nameOpen: false, authDialogOpen: true })
                }
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                disabled={!this.state.tokenName}
                onClick={() => {
                  this.getPermanentToken()
                  this.setState({ nameOpen: false, authDialogOpen: true })
                }}
              >
                Get token
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    query {
      user {
        id
        permanentTokens {
          id
          customName
          lastUsed
        }
      }
    }
  `,
  { name: "tokenData" }
)(
  graphql(
    gql`
      mutation DeletePermanentAccesToken($id: ID!) {
        DeletePermanentAccesToken(id: $id)
      }
    `,
    {
      name: "DeletePermanentAccesToken",
    }
  )(AuthDialog)
)
