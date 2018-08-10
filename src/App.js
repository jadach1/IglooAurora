import React, { Component } from "react"
import AuthenticatedApp from "./AuthenticatedApp"
import UnAuthenticatedApp from "./UnAuthenticatedApp"
import UnAuthenticatedAppMobile from "./UnAuthenticatedAppMobile"
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
    console.log("Service Worker and Push is supported")

    // registering service worker
    navigator.serviceWorker
      .register("webPushSw.js")
      .then(function(swReg) {
        console.log("Service Worker is registered", swReg)

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

            console.log(
              swReg.pushManager
                .subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: applicationServerKey,
                })
                .then(function(subscription) {
                  sendSubscriptionToServer(subscription)
                })
                .catch(function(err) {
                  console.log("Failed to subscribe the user: ", err)
                })
            )
          }
        })
      })
      .catch(function(error) {
        console.error("Service Worker Error: ", error)
      })
  } else {
    console.warn("Push messaging is not supported")
  }

  function sendSubscriptionToServer(subscription) {
    fetch("https://iglooql.herokuapp.com/webPushSubscribe", {
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
        } else {
          setupWebPush(bearer)
        }
      }
    }
    this.state = {
      bearer,
      isMobile: null,
      from: "/aurora",
      redirectToReferrer: false,
    }
  }

  updateDimensions() {
    if (window.innerWidth < 900) {
      this.setState({ isMobile: true })
    } else {
      this.setState({ isMobile: false })
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
    const signIn = bearer => {
      this.setState({ bearer })
      if (typeof Storage !== "undefined") {
        localStorage.setItem("bearer", bearer)
      }
      setupWebPush(bearer)

      this.setState({ redirectToReferrer: true })
    }

    const logOut = () => {
      this.setState({ bearer: "" })
      if (typeof Storage !== "undefined") {
        localStorage.setItem("bearer", "")
      }
    }

    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
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
            this.setState({ from: props.location.pathname })

            return (
              <Redirect
                to={{
                  pathname: "/login",
                }}
              />
            )
          }
        }}
      />
    )

    const { redirectToReferrer } = this.state

    if (redirectToReferrer) {
      this.setState({ redirectToReferrer: false })
      return <Redirect to={this.state.from || "/aurora"} />
    }

    let recoveryFetcher = props => {
      return (
        <RecoveryFetcher
          token={props.match.params.token}
          mobile={this.state.isMobile}
        />
      )
    }

    return (
      <Switch>
        <PrivateRoute path="/aurora/" />
        <Route
          path="/login"
          render={() =>
            this.state.isMobile ? (
              <UnAuthenticatedAppMobile signIn={signIn} />
            ) : (
              <UnAuthenticatedApp signIn={signIn} />
            )
          }
        />
        <Route exact path="/recovery/:token" component={recoveryFetcher} />
        <Route
          exact
          path="/recovery/"
          component={() => <Redirect to="/aurora/" />}
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
