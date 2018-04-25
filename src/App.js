import React, { Component } from "react"
import AuthenticatedApp from "./AuthenticatedApp"
import UnAuthenticatedApp from "./UnAuthenticatedApp"
import jwt from "jsonwebtoken"

function setupWebPush(token) {
  const applicationServerPublicKey =
    "BOZG_RBpt8yVp6J1JN08zCEPSFbYC_aHQQKNY0isQDnozk9GXZAiSHMnnXowvfacQeh38j2TQAyp9yT0qpUXS6Y"

  function urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
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
        console.error("Service Worker Error", error)
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
    }
  }

  render() {
    const signIn = bearer => {
      this.setState({ bearer })
      if (typeof Storage !== "undefined") {
        localStorage.setItem("bearer", bearer)
      }
      setupWebPush(bearer)
    }

    const logOut = () => {
      this.setState({ bearer: "" })
      if (typeof Storage !== "undefined") {
        localStorage.setItem("bearer", "")
      }
    }

    if (this.state.bearer === "") {
      return <UnAuthenticatedApp signIn={signIn} />
    } else {
      return <AuthenticatedApp bearer={this.state.bearer} logOut={logOut} />
    }
  }
}

export default App
