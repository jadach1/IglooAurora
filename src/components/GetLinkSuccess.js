import React from "react"
import classNames from "classnames"
import IconButton from "material-ui-next/IconButton"
import Snackbar from "material-ui-next/Snackbar"
import { SnackbarContent } from "material-ui-next"
import { withStyles } from "material-ui-next/styles"
import Icon from "material-ui-next/Icon"
import { Slide } from "material-ui-next"

const styles1 = theme => ({
  warning: {
    backgroundColor: "#0057cb",
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
  const { classes, className, variant, closeSnackbar, mobile } = props

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
          <Icon style={{ fontSize: 24, marginRight: "16px" }}>
            check_circle
          </Icon>
          Link copied to the clipboard
        </span>
      }
      action={[
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
  render() {
    return (
      <React.Fragment>
        <Snackbar
          open={this.props.open}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          style={
            this.props.mobile
              ? null
              : { bottom: "128px", right: "16px", left: "auto" }
          }
          TransitionComponent={
            this.props.mobile ? TransitionUp : TransitionLeft
          }
          className="notSelectable defaultCursor"
          autoHideDuration={3000}
          onClose={this.props.close}
        >
          <MySnackbarContentWrapper
            variant="warning"
            closeSnackbar={this.props.close}
            mobile={this.props.mobile}
          />
        </Snackbar>
      </React.Fragment>
    )
  }
}

export default withStyles(styles2)(CustomizedSnackbars)
