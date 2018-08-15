import React from "react"
import classNames from "classnames"
import IconButton from "material-ui-next/IconButton"
import Snackbar from "material-ui-next/Snackbar"
import { SnackbarContent } from "material-ui-next"
import { withStyles } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"
import { Slide } from "material-ui-next"
import Dialog from "material-ui/Dialog"
import Button from "material-ui-next/Button"
import { MuiThemeProvider, createMuiTheme } from "material-ui-next/styles"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const styles1 = theme => ({
  warning: {
    backgroundColor: "#f44336",
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
})

const theme = createMuiTheme({
  palette: {
    primary: { main: "#0083ff" },
    secondary: { main: "#ff4081" },
  },
})

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />
}

function MySnackbarContent(props) {
  const {
    classes,
    className,
    variant,
    closeSnackbar,
    openDialog,
    mobile,
  } = props

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      style={{ paddingTop: "8px", paddingBottom: "8px" }}
      message={
        <span
          id="client-snackbar"
          className={classes.message}
          style={{ marginLeft: "-4px" }}
        >
          <Icon style={{ fontSize: 24, marginRight: "16px" }}>warning</Icon>
          Your account isn't verified!
        </span>
      }
      action={[
        <IconButton style={{ color: "white" }} onClick={openDialog}>
          <Icon>notes</Icon>
        </IconButton>,
        <IconButton
          style={{ marginRight: "-8px", color: "white" }}
          onClick={closeSnackbar}
        >
          {mobile ? (
            <Icon>keyboard_arrow_down</Icon>
          ) : (
            <Icon>chevron_right</Icon>
          )}
        </IconButton>,
      ]}
    />
  )
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent)

const styles2 = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
})

class CustomizedSnackbars extends React.Component {
  state = {
    open: false,
    dialogOpen: false,
  }

  componentDidMount() {
    this.setState({ open: true })
  }

  closeSnackbar = () => {
    this.setState({ open: false })
  }

  openDialog = () => {
    this.setState({ dialogOpen: true })
  }

  render() {
    let resendVerificationEmail = () => {
      this.props.ResendVerificationEmail()
    }

    return (
      <React.Fragment>
        <Dialog
          title="Your account isn't verified!"
          actions={
            <MuiThemeProvider theme={theme}>
              <Button
                style={{ marginRight: "4px" }}
                onClick={() => this.setState({ dialogOpen: false })}
              >
                Never mind
              </Button>
              <Button
                variant="raised"
                color="primary"
                primary={true}
                onClick={resendVerificationEmail}
              >
                Send again
              </Button>
            </MuiThemeProvider>
          }
          open={this.state.dialogOpen}
          onRequestClose={() => {
            this.setState({ dialogOpen: false })
          }}
          titleClassName="notSelectable defaultCursor"
          contentStyle={{
            width: "350px",
          }}
          className="notSelectable defaultCursor"
        >
          You should have received a verification email.
          <br />
          <br />
          If that's not the case, click on "Send again" and we'll send you
          another email.
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={this.state.open}
          style={
            this.props.mobile
              ? null
              : { bottom: "48px", right: "16px", width: "351px", left: "auto" }
          }
          TransitionComponent={
            this.props.mobile ? TransitionUp : TransitionLeft
          }
          className="notSelectable defaultCursor"
        >
          <MySnackbarContentWrapper
            variant="warning"
            closeSnackbar={this.closeSnackbar}
            openDialog={this.openDialog}
            mobile={this.props.mobile}
          />
        </Snackbar>
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ResendVerificationEmail($id: ID!) {
      ResendVerificationEmail
    }
  `,
  {
    name: "ResendVerificationEmail",
  }
)(withStyles(styles2)(CustomizedSnackbars))
