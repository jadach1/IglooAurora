import React from "react"
import classNames from "classnames"
import IconButton from "@material-ui/core/IconButton"
import Snackbar from "@material-ui/core/Snackbar"
import SnackbarContent from "@material-ui/core/SnackbarContent"
import withStyles from "@material-ui/core/styles/withStyles"
import Warning from "@material-ui/icons/Warning"
import Notes from "@material-ui/icons/Notes"
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown"
import ChevronRight from "@material-ui/icons/ChevronRight"
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
        <font
          id="client-snackbar"
          className={classes.message}
          style={{ marginLeft: "-4px" }}
        >
          <Warning style={{ fontSize: 24, marginRight: "16px" }} />
          Your account isn't verified!
        </font>
      }
      action={[
        <IconButton
          style={{ color: "white" }}
          onClick={() => {
            openDialog()
          }}
          color="primary"
        >
          <Notes />
        </IconButton>,
        <IconButton
          style={{ marginRight: "-8px", color: "white" }}
          onClick={() => {
            closeSnackbar()
          }}
          color="primary"
        >
          {mobile ? <KeyboardArrowDown /> : <ChevronRight />}
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
    dialogOpen: false,
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
          open={this.props.open}
          style={
            this.props.mobile
              ? { zIndex: 30 } // makes the snackbar appear over cards and subheaders, but under dialogs
              : {
                  bottom: "64px",
                  right: "16px",
                  width: "356px",
                  left: "auto",
                  zIndex: 30,
                }
          }
          TransitionComponent={
            this.props.mobile ? TransitionUp : TransitionLeft
          }
          className="notSelectable defaultCursor"
        >
          <MySnackbarContentWrapper
            variant="warning"
            closeSnackbar={this.props.close}
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
      resendVerificationEmail
    }
  `,
  {
    name: "ResendVerificationEmail",
  }
)(withStyles(styles2)(CustomizedSnackbars))
