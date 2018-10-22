import React from "react"
import Dialog from "material-ui/Dialog"
import Button from "@material-ui/core/Button"
import { List, ListItem, makeSelectable } from "material-ui/List"
import Translate from "translate-components"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

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

class ChangeLanguageDialog extends React.Component {
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
    const {
      userData: { user },
    } = this.props

    const languageDialogActions = [
      <Button onClick={this.props.handleLanguageDialogClose}>Close</Button>,
    ]

    let changeLanguage = () => {}

    let lang

    if (user) {
      changeLanguage = language =>
        this.props.ChangeLanguage({
          variables: {
            language,
          },
          optimisticResponse: {
            __typename: "Mutation",
            user: {
              id: user.id,
              language,
              __typename: "User",
            },
          },
        })

      lang = user.language
    }

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
          <SelectableList
            style={{ paddingBottom: "0px", padding: "0" }}
            defaultValue={lang}
          >
            <ListItem
              primaryText="Deutsch"
              value="de"
              onClick={() => {
                changeLanguage("de")
              }}
            />
            <ListItem
              primaryText="English"
              value="en"
              onClick={() => {
                changeLanguage("en")
              }}
            />
            <ListItem
              primaryText="Español"
              value="es"
              onClick={() => {
                changeLanguage("es")
              }}
            />
            <ListItem
              primaryText="Italiano"
              value="it"
              onClick={() => {
                changeLanguage("it")
              }}
            />
            <ListItem
              primaryText="中文 (简体)"
              value="zh-Hans"
              onClick={() => {
                changeLanguage("zh-Hans")
              }}
            />
          </SelectableList>
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
        language
      }
    }
  `,
  { name: "userData" }
)(
  graphql(
    gql`
      mutation ChangeLanguage($language: String) {
        user(language: $language) {
          id
          language
        }
      }
    `,
    {
      name: "ChangeLanguage",
    }
  )(ChangeLanguageDialog)
)
