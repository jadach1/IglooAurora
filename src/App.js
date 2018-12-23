import React, { Component } from "react"
import AuthenticatedApp from "./AuthenticatedApp"
import UnauthenticatedMain from "./UnauthenticatedMain"
import UnauthenticatedMainMobile from "./UnauthenticatedMainMobile"
import jwt from "jsonwebtoken"
import { Route, Switch, Redirect } from "react-router-dom"
import Error404 from "./Error404"
import RecoveryFetcher from "./RecoveryFetcher"
import { Online, Offline } from "react-detect-offline"
import OfflineScreen from "./OfflineScreen"
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider"
import createMuiTheme from "@material-ui/core/styles/createMuiTheme"

// Material-UI customizations that do not change between light mode and night mode
const sharedStyles = {
  MuiDialogActions: {
    action: {
      marginRight: "4px",
    },
  },
  MuiListItemText: {
    root: {
      cursor: "default",
      webkitTouchCallout: "none",
      webkitUserSelect: "none",
      khtmlUserSelect: "none",
      mozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    },
  },
  MuiList: {
    padding: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  MuiBadge: {
    colorPrimary: {
      backgroundColor: "#ff4081",
    },
  },
  MuiCircularProgress: {
    colorPrimary: {
      color: "#0083ff",
    },
    colorSecondary: {
      color: "#fff",
    },
  },
  MuiTooltip: {
    tooltip: {
      cursor: "default",
      webkitTouchCallout: "none",
      webkitUserSelect: "none",
      khtmlUserSelect: "none",
      mozUserSelect: "none",
      msUserSelect: "none",
      userSelect: "none",
    },
  },
  MuiSwitch: {
    colorSecondary: {
      "&$checked": {
        color: "#0083ff",
        "& + $bar": {
          backgroundColor: "#0083ff",
        },
      },
    },
  },
}

const lightTheme = createMuiTheme({
  palette: {
    default: { main: "#fff" },
    primary: { light: "#0083ff", main: "#0057cb" },
    secondary: { main: "#ff4081" },
    error: { main: "#f44336" },
  },
  overrides: {
    MuiDialogTitle: {
      root: {
        fontSize: "1.3125rem",
        lineHeight: "1.16667em",
        fontWeight: 500,
        cursor: "default",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      },
    },
    MuiButton: {
      containedPrimary: {
        backgroundColor: "#0083ff",
      },
    },
    MuiListItemIcon: {
      root: {
        color: "black",
      },
    },
    MuiCheckbox: {
      colorPrimary: {
        "&$checked": { color: "#0083ff" },
      },
    },
    MuiRadio: {
      colorPrimary: {
        "&$checked": {
          color: "#0083ff",
        },
        color: "black",
      },
    },
    ...sharedStyles,
  },
})

const darkTheme = createMuiTheme({
  palette: {
    default: { main: "#fff" },
    primary: { light: "#0083ff", main: "#0057cb" },
    secondary: { main: "#ff4081" },
    error: { main: "#f44336" },
  },
  overrides: {
    MuiDialog: {
      paper: {
        backgroundColor: "#2f333d",
        color: "white",
      },
    },
    MuiDialogTitle: {
      root: {
        color: "white",
        fontSize: "1.3125rem",
        lineHeight: "1.16667em",
        fontWeight: 500,
        cursor: "default",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      },
    },
    MuiButton: {
      containedPrimary: {
        backgroundColor: "#0083ff",
      },
      text: {
        color: "white",
      },
    },
    MuiMenu: {
      paper: {
        backgroundColor: "#2f333d",
      },
    },
    MuiMenuItem: {
      root: {
        color: "white",
      },
    },
    MuiPopover: {
      paper: {
        backgroundColor: "#2f333d",
      },
    },
    MuiListItemIcon: {
      root: {
        color: "white",
      },
    },
    MuiInput: {
      root: {
        color: "white",
      },
    },
    MuiFormControlLabel: {
      label: {
        color: "white",
        "&$disabled": {
          color: "white",
          opacity: "0.5",
        },
      },
    },
    MuiCheckbox: {
      colorPrimary: {
        "&$checked": { color: "#0083ff" },
      },
      colorSecondary: {
        color: "white",
      },
    },
    MuiRadio: {
      colorPrimary: {
        "&$checked": {
          color: "#0083ff",
        },
        "&$disabled": {
          color: "white",
          opacity: "0.5",
        },
        color: "white",
      },
    },
    ...sharedStyles,
  },
})

//TODO: ?
function setupWebPush(token) {
  const applicationServerPublicKey =
    "BOZG_RBpt8yVp6J1JN08zCEPSFbYC_aHQQKNY0isQDnozk9GXZAiSHMnnXowvfacQeh38j2TQAyp9yT0qpUXS6Y"

  function urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // checks whether the browser supports push service workers and push notifications
  if ("serviceWorker" in navigator && "PushManager" in window) {
    navigator.serviceWorker.register("webPushSw.js").then(function(swReg) {
      // checks whether user is already subscribed to push notifications
      swReg.pushManager.getSubscription().then(function(subscription) {
        const isSubscribed = !(subscription === null)

        if (isSubscribed) {
          sendSubscriptionToServer(subscription)
        } else {
          // subscribes user
          const applicationServerKey = urlB64ToUint8Array(
            applicationServerPublicKey
          )

          swReg.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey: applicationServerKey,
            })
            .then(function(subscription) {
              sendSubscriptionToServer(subscription)
            })
        }
      })
    })
  }

  function sendSubscriptionToServer(subscription) {
    // the server URL changes based on whether the server setting is set to "auto" or "manual"
    const serverUrl =
      typeof Storage !== "undefined" && localStorage.getItem("server") !== ""
        ? localStorage.getItem("server") + "/webPushSubscribe"
        : `http://igloo-production.herokuapp.com/webPushSubscribe`

    //TODO: ?
    fetch(serverUrl, {
      body: JSON.stringify(subscription),
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
        authorization: "Bearer " + token,
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer",
    })
  }
}

class App extends Component {
  constructor() {
    let email = ""

    // gets the email of the last user that logged in
    if (typeof Storage !== "undefined") {
      email = localStorage.getItem("email") || ""
    }

    super()

    let bearer = ""
    // reuses previous session's bearer if present
    if (typeof Storage !== "undefined") {
      // looks for the bearer in both localStorage and sessionStorage:
      // - localStorage is used if the user prefers to be automatically logged in
      // - sessionStorage is used if they prefer to log out at the end of every session
      bearer =
        localStorage.getItem("bearer") || sessionStorage.getItem("bearer") || ""

      // asks for a new token 1 day before the expiration date
      if (bearer !== "") {
        const expirationDate = jwt.decode(bearer).exp
        const tomorrow = Math.floor(new Date() / 1000) + 86400
        if (expirationDate < tomorrow) {
          bearer = ""
          localStorage.setItem("bearer", "")
          sessionStorage.setItem("bearer", "")
        } else {
          setupWebPush(bearer)
        }
      }
    }

    // names of CSS classes for each of the unauthenticated screen backgrounds
    let unauthenticatedPictures = [
      "auroraLoginBackground",
      "woodsLoginBackground",
    ]

    this.state = {
      bearer,
      isMobile: null,
      from: "",
      redirectToReferrer: false,
      environmentId: "",
      loggedOut: false,
      loginEmail: email,
      loginEmailError: "",
      loginPassword: "",
      loginPasswordError: "",
      signupEmail: "",
      signupEmailError: "",
      signupPassword: "",
      signupPasswordError: "",
      name: "",
      nameError: "",
      // chooses a background for the unauthenticated screen at random
      // in case of error, the one with the aurora is displayed
      unauthenticatedPicture:
        unauthenticatedPictures[Math.floor(Math.random() * 2)] ||
        "auroraLoginBackground",
    }

    // keepLoggedIn is the parameter that determines whether the user is automatically logged back in every time
    // if keepLoggedIn wasn't assigned a value, it is set to true
    typeof Storage !== "undefined" &&
      localStorage.getItem("keepLoggedIn") === "" &&
      localStorage.setItem("keepLoggedIn", "true")
  }

  updateDimensions() {
    if (window.innerWidth < 900) {
      !this.state.isMobile && this.setState({ isMobile: true })
    } else {
      this.state.isMobile && this.setState({ isMobile: false })
    }
  }

  componentDidMount() {
    this.updateDimensions()
    window.addEventListener("resize", this.updateDimensions.bind(this))

    // a little easter egg for our most curious users
    console.log(
      "Hello! If you're reading this, you've probably got some experience with web development, so why don't you contribute to our open source repository?\nhttps://github.com/IglooCloud/IglooAurora"
    )
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    const signIn = (bearer, keepLoggedIn) => {
      this.setState({ bearer })

      // the bearer is saved to either localStorage or sessionStorage depending on the keepLoggedIn paramter
      // localStorage is kept even when the user closes the web app, sessionStorage is cleared when the session ends
      if (keepLoggedIn) {
        if (typeof Storage !== "undefined") {
          localStorage.setItem("bearer", bearer)
        }
      } else {
        if (typeof Storage !== "undefined") {
          sessionStorage.setItem("bearer", bearer)
        }
      }

      localStorage.setItem("keepLoggedIn", keepLoggedIn)

      setupWebPush(bearer)

      // redirectToReferrer is set to true, this means that the user will be redirected to the page they were on before being asked to log in
      this.setState({ redirectToReferrer: true, loginPassword: "" })
    }

    const logOut = () => {
      this.setState({ bearer: "", loggedOut: true })
      if (typeof Storage !== "undefined") {
        localStorage.setItem("bearer", "")
        sessionStorage.setItem("bearer", "")
      }
    }

    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      this.setState({ redirectToReferrer: false })

      return <Redirect to={this.state.from || "/"} />
    }

    if (localStorage.getItem("server") === null)
      localStorage.setItem("server", "")

    return (
      <MuiThemeProvider
        theme={
          typeof Storage !== "undefined" &&
          localStorage.getItem("nightMode") === "true"
            ? darkTheme
            : lightTheme
        }
      >
        {/* this.forceUpdate makes sure that the application reacts to the changes of the variables stored  */}
        <Online onChange={() => this.forceUpdate()}>
          <Switch>
            <Route
              path="/"
              exact
              render={props => {
                if (this.state.bearer) {
                  return (
                    <AuthenticatedApp
                      bearer={this.state.bearer}
                      logOut={logOut}
                      isMobile={this.state.isMobile}
                      forceUpdate={() => this.forceUpdate()}
                    />
                  )
                } else {
                  // if the bearer is not present because the user chose to log out in this session, their referrer is not saved
                  // the referrer is the address of the page on which the user was before being asked to log in
                  if (!this.state.loggedOut) {
                    // this check avoids redirecting the user to aurora.igloo.ooo/?environmentundefined in case there is nothing after ?environment=
                    window.location.href.split("?environment=")[1] &&
                      this.setState({
                        from:
                          "/?environment=" +
                          window.location.href.split("?environment=")[1],
                      })
                  }
                  // the user is redirected to the log in screen if someone already logged in on their machine
                  return typeof Storage !== "undefined" &&
                    localStorage.getItem("email") ? (
                    <Redirect to="/login" />
                  ) : (
                    <Redirect to="/signup" />
                  )
                }
              }}
            />
            <Route
              path="/login"
              render={() =>
                this.state.bearer ? (
                  <Redirect to="/" />
                ) : this.state.isMobile ? (
                  <UnauthenticatedMainMobile
                    isLogin
                    signIn={signIn}
                    password={this.state.loginPassword}
                    changePassword={loginPassword =>
                      this.setState({ loginPassword })
                    }
                    passwordError={this.state.loginPasswordError}
                    changePasswordError={loginPasswordError =>
                      this.setState({ loginPasswordError })
                    }
                    email={this.state.loginEmail}
                    changeEmail={loginEmail => this.setState({ loginEmail })}
                    emailError={this.state.loginEmailError}
                    changeEmailError={loginEmailError =>
                      this.setState({ loginEmailError })
                    }
                    changeSignupEmail={signupEmail =>
                      this.setState({ signupEmail })
                    }
                    forceUpdate={() => this.forceUpdate()}
                  />
                ) : (
                  <UnauthenticatedMain
                    isLogin
                    signIn={signIn}
                    password={this.state.loginPassword}
                    changePassword={loginPassword =>
                      this.setState({ loginPassword: loginPassword })
                    }
                    passwordError={this.state.loginPasswordError}
                    changePasswordError={loginPasswordError =>
                      this.setState({ loginPasswordError })
                    }
                    email={this.state.loginEmail}
                    changeEmail={loginEmail => this.setState({ loginEmail })}
                    emailError={this.state.loginEmailError}
                    changeEmailError={loginEmailError =>
                      this.setState({ loginEmailError })
                    }
                    changeSignupEmail={signupEmail =>
                      this.setState({ signupEmail })
                    }
                    unauthenticatedPicture={this.state.unauthenticatedPicture}
                    forceUpdate={() => this.forceUpdate()}
                  />
                )
              }
            />
            <Route
              path="/signup"
              render={() =>
                this.state.bearer ? (
                  <Redirect to="/" />
                ) : this.state.isMobile ? (
                  <UnauthenticatedMainMobile
                    signIn={signIn}
                    name={this.state.name}
                    changeName={name => this.setState({ name })}
                    password={this.state.signupPassword}
                    changePassword={signupPassword =>
                      this.setState({ signupPassword })
                    }
                    email={this.state.signupEmail}
                    changeEmail={signupEmail => this.setState({ signupEmail })}
                    emailError={this.state.signupEmailError}
                    changeEmailError={signupEmailError =>
                      this.setState({ signupEmailError })
                    }
                    changeLoginEmail={loginEmail =>
                      this.setState({ loginEmail })
                    }
                    forceUpdate={() => this.forceUpdate()}
                  />
                ) : (
                  <UnauthenticatedMain
                    signIn={signIn}
                    name={this.state.name}
                    changeName={name => this.setState({ name })}
                    password={this.state.signupPassword}
                    changePassword={signupPassword =>
                      this.setState({ signupPassword })
                    }
                    email={this.state.signupEmail}
                    changeEmail={signupEmail => this.setState({ signupEmail })}
                    emailError={this.state.signupEmailError}
                    changeEmailError={signupEmailError =>
                      this.setState({ signupEmailError })
                    }
                    changeLoginEmail={loginEmail =>
                      this.setState({ loginEmail })
                    }
                    unauthenticatedPicture={this.state.unauthenticatedPicture}
                    forceUpdate={() => this.forceUpdate()}
                  />
                )
              }
            />
            <Route
              path="/recovery"
              render={() => <RecoveryFetcher mobile={this.state.isMobile} />}
            />
            <Route render={() => <Error404 isMobile={this.state.isMobile} />} />
          </Switch>
        </Online>
        <Offline>
          <OfflineScreen isMobile={this.state.isMobile} />
        </Offline>
      </MuiThemeProvider>
    )
  }
}

export default App
