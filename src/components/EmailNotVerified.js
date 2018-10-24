import React from "react"
import classNames from "classnames"
import IconButton from "@material-ui/core/IconButton"
import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import withStyles from "@material-ui/core/styles/withStyles"
import Icon from "@material-ui/core/Icon"
import Slide from "@material-ui/core/Slide"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import VerifyEmailDialog from "./VerifyEmailDialog"

const styles1 = theme => ({
  warning: {
    backgroundColor: "#f44336",
  },
  message: {
    display: "flex",
    alignItems: "center",
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
        <IconButton
          style={{ color: "white" }}
          onClick={() => {
            openDialog()
            closeSnackbar()
          }}
        >
          <Icon>notes</Icon>
        </IconButton>,
        <IconButton
          style={{ marginRight: "-8px", color: "white" }}
          onClick={() => {
            closeSnackbar()
          }}
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
    return (
      <React.Fragment>
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
        <VerifyEmailDialog
          ResendVerificationEmail={this.props.ResendVerificationEmail}
          open={this.state.dialogOpen}
          close={() => this.setState({ dialogOpen: false })}
        />
      </React.Fragment>
    )
  }
}

export default graphql(
  gql`
    mutation ResendVerificationEmail {
      ResendVerificationEmail
    }
  `,
  {
    name: "ResendVerificationEmail",
  }
)(withStyles(styles2)(CustomizedSnackbars))
