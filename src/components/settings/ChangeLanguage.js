import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { List, ListItem, makeSelectable } from "material-ui/List"
import { reactTranslateChangeLanguage } from "translate-components"
import Translate from "translate-components"

const languageDialogContentStyle = {
  width: "350px",
}

let SelectableList = makeSelectable(List)

function wrapState(ComposedComponent) {
  return class SelectableList extends React.Component {
    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      })
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      })
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      )
    }
  }
}

SelectableList = wrapState(SelectableList)

export default class ChangeLanguageDialog extends React.Component {
  state = {
    languageSnackOpen: false,
  }

  handleLanguageSnackOpen = () => {
    this.setState({
      languageSnackOpen: true,
    })
    this.props.handleLanguageDialogClose()
  }

  handleLanguageSnackClose = () => {
    this.setState({
      languageSnackOpen: false,
    })
  }

  render() {
    const languageDialogActions = [
      <Button onClick={this.props.handleLanguageDialogClose}>Close</Button>,
    ]

    return (
      <React.Fragment>
        <Dialog
          title={<Translate>Change language</Translate>}
          actions={languageDialogActions}
          open={this.props.languageDialogOpen}
          contentStyle={languageDialogContentStyle}
          bodyStyle={{
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingBottom: "0px",
          }}
          onRequestClose={this.props.handleLanguageDialogClose}
          className="notSelectable"
          titleClassName="notSelectable defaultCursor"
        >
          <SelectableList style={{ paddingBottom: "0px" }}>
            <ListItem
              primaryText="Deutsch"
              value={1}
              onClick={reactTranslateChangeLanguage.bind(this, "de")}
            />
            <ListItem
              primaryText="English"
              value={2}
              onClick={reactTranslateChangeLanguage.bind(this, "en")}
            />
            <ListItem
              primaryText="Español"
              value={3}
              onClick={reactTranslateChangeLanguage.bind(this, "es")}
            />
            <ListItem
              primaryText="Italiano"
              value={4}
              onClick={reactTranslateChangeLanguage.bind(this, "it")}
            />
            <ListItem
              primaryText="中文 (简体)"
              value={5}
              onClick={reactTranslateChangeLanguage.bind(this, "zh-Hans")}
            />
          </SelectableList>
        </Dialog>
      </React.Fragment>
    )
  }
}
