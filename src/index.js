import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import registerServiceWorker from "./registerServiceWorker"
import { TranslateProvider } from "translate-components"
import translations from "./translations.json"
import { BrowserRouter } from "react-router-dom"

ReactDOM.render(
  <BrowserRouter>
    <TranslateProvider translations={translations} defaultLanguage={"en"}>
      <App />
    </TranslateProvider>
  </BrowserRouter>,
  document.getElementById("root")
)
registerServiceWorker()
