import React, { Component } from "react"
import AuthenticatedApp from "./AuthenticatedApp"
import LoginMain from "./LoginMain"
import SignupMain from "./SignupMain"
import LoginMainMobile from "./LoginMainMobile"
import SignupMainMobile from "./SignupMainMobile"
import jwt from "jsonwebtoken"
import { Route, Switch, Redirect } from "react-router-dom"
import Error404 from "./Error404"
import MobileError404 from "./MobileError404"
import RecoveryFetcher from "./RecoveryFetcher"

function setupWebPush(token) {
  const applicationServerPublicKey =
    "BOZG_RBpt8yVp6J1JN08zCEPSFbYC_aHQQKNY0isQDnozk9GXZAiSHMnnXowvfacQeh38j2TQAyp9yT0qpUXS6Y"

  function urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, "+") //Changed to prevent no-useless-escapes console error, was /\-/g
      .replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // check support
  if ("serviceWorker" in navigator && "PushManager" in window) {
    // registering service worker
    navigator.serviceWorker.register("webPushSw.js").then(function(swReg) {
      // checking push subscription
      swReg.pushManager.getSubscription().then(function(subscription) {
        const isSubscribed = !(subscription === null)

        if (isSubscribed) {
          sendSubscriptionToServer(subscription)
        } else {
          // subscribing user
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
  } else {
  }

  function sendSubscriptionToServer(subscription) {
    const serverUrl =
      process.env.DEV_MODE === "SERVER"
        ? "localhost:3000/webPushSubscribe"
        : `http://iglooql.herokuapp.com/graphql`

    fetch(serverUrl, {
      body: JSON.stringify(subscription), // must match 'Content-Type' header
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
        authorization: "Bearer " + token,
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // *client, no-referrer
    })
  }
}

class App extends Component {
  constructor() {
    let email = ""

    if (typeof Storage !== "undefined") {
      email = localStorage.getItem("email") || ""
    }

    super()

    let bearer = ""
    // reuse previous session's bearer if present
    if (typeof Storage !== "undefined") {
      bearer =
        localStorage.getItem("bearer") || sessionStorage.getItem("bearer") || ""

      // ask for a new token 1 day before the expiration date
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
    this.state = {
      bearer,
      isMobile: null,
      from: "",
      redirectToReferrer: false,
      boardsCount: 0,
      boardId: "",
      loggedOut: false,
      loginEmail: email,
      loginEmailError: "",
      loginPassword: "",
      loginPasswordError: "",
      signupEmail: "",
      signupEmailError: "",
      signupPassword: "",
      signupPasswordError: "",
      fullName: "",
      fullNameError: "",
    }
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
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    const signIn = (bearer, keepLoggedIn) => {
      this.setState({ bearer })

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

      return (
        <Redirect
          to={
            this.state.from ||
            (this.state.boardsCount === 1
              ? "/dashboard?board=" + this.state.boardId
              : "/dashboard")
          }
        />
      )
    }

    return (
      <Switch>
        <Route
          path="/dashboard/"
          render={props => {
            if (this.state.bearer) {
              return (
                <AuthenticatedApp
                  bearer={this.state.bearer}
                  logOut={logOut}
                  isMobile={this.state.isMobile}
                />
              )
            } else {
              if (!this.state.loggedOut) {
                this.setState({ from: props.location.pathname })
              }

              return typeof Storage !== "undefined" &&
                localStorage.getItem("email") ? (
                <Redirect
                  to={{
                    pathname: "/login",
                  }}
                />
              ) : (
                <Redirect to={{ pathname: "/signup" }} />
              )
            }
          }}
        />
        <Route
          path="/login"
          render={() =>
            this.state.isMobile ? (
              <LoginMainMobile
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
              />
            ) : (
              <LoginMain
                signIn={signIn}
                setBoards={(count, id) =>
                  this.setState({ boardsCount: count, boardId: id })
                }
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
              />
            )
          }
        />
        <Route
          path="/signup"
          render={() =>
            this.state.isMobile ? (
              <SignupMainMobile
                signIn={signIn}
                fullName={this.state.fullName}
                changeFullName={fullName => this.setState({ fullName })}
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
                changeLoginEmail={loginEmail => this.setState({ loginEmail })}
              />
            ) : (
              <SignupMain
                signIn={signIn}
                fullName={this.state.fullName}
                changeFullName={fullName => this.setState({ fullName })}
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
                changeLoginEmail={loginEmail => this.setState({ loginEmail })}
              />
            )
          }
        />
        <Route
          path="/recovery"
          render={() => <RecoveryFetcher mobile={this.state.isMobile} />}
        />
        <Route
          exact
          path="/"
          render={() => {
            return <Redirect to="/dashboard" />
          }}
        />
        <Route
          render={() =>
            this.state.isMobile ? <MobileError404 /> : <Error404 />
          }
        />
      </Switch>
    )
  }
}

export default App
