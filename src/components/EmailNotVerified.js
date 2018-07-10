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

function MySnackbarContent(props) {
  const {
    classes,
    className,
    message,
    onClose,
    variant,
    closeSnackbar,
    openDialog,
    ...other
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
          <Icon style={{ fontSize: 24, marginRight: "16px" }}>error</Icon>
          {message}
        </span>
      }
      action={[
        <IconButton>
          <Icon style={{ color: "white" }} onClick={openDialog}>help</Icon>
        </IconButton>,
        <IconButton style={{ marginRight: "-8px" }} onClick={closeSnackbar}>
          <Icon style={{ color: "white" }}>close</Icon>
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
    dialogOpen:false
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
    const { classes } = this.props

    return (
      <React.Fragment>
      <Dialog
        title="Your account isn't verified!"
        actions={    <MuiThemeProvider theme={theme}>
        <Button
          style={{ marginRight: "4px" }}
          onClick={()=>this.setState({dialogOpen:false})}
        >
          Never mind
        </Button>
        <Button
          variant="raised"
          color="primary"
          
          primary={true}
        >
          Send again
        </Button>
      </MuiThemeProvider>}
        open={this.state.dialogOpen}
        onRequestClose={()=>{this.setState({dialogOpen:false})}}
        titleClassName="notSelectable defaultCursor"
        contentStyle={{
          width: "350px",
        }}
      >
      You should have received a verification email. If that's not the case, click on "Send again" and we'll send you another email.
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={this.state.open}
        autoHideDuration={6000}
        style={{ bottom: "48px", right: "16px" }}
        TransitionComponent={TransitionLeft}
        className="notSelectable defaultCursor"
      >
        <MySnackbarContentWrapper
          variant="warning"
          message="Your account isn't verified!"
          closeSnackbar={this.closeSnackbar}
          openDialog={this.openDialog}
        />
      </Snackbar>
      </React.Fragment>
    )
  }
}

export default withStyles(styles2)(CustomizedSnackbars)
