import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import registerServiceWorker from "./registerServiceWorker"
import { TranslateProvider } from "translate-components"
import translations from "./translations.json"

ReactDOM.render(
  <TranslateProvider translations={translations} defaultLanguage={"en"}>
    <App />
  </TranslateProvider>,
  document.getElementById("root")
)
registerServiceWorker()
