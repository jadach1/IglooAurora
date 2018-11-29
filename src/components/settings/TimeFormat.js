import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

export default class TimeFormatDialog extends React.Component {
  state = {}

  render() {
    return (
      <Dialog
        open={this.props.timeFormatDialogOpen}
        onClose={this.props.handleTimeFormatDialogClose}
        className="notSelectable"
        TransitionComponent={Transition}
        titleClassName="defaultCursor"
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={window.innerWidth > MOBILE_WIDTH ? { width: "350px" } : null}
        >
          Change date and time format
        </DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Date
          <RadioGroup
            onChange={event => this.setState({ value: event.target.value })}
            value={this.state.value || "auto"}
            style={{ paddingLeft: "24px", paddingRight: "24px" }}
          >
            <FormControlLabel
              value="dmy"
              control={<Radio color="primary" />}
              label="DD/MM/YYYY"
            />
            <FormControlLabel
              value="mdy"
              control={<Radio color="primary" />}
              label="MM/DD/YYYY"
            />
            <FormControlLabel
              value="ymd"
              control={<Radio color="primary" />}
              label="YYYY/MM/DD"
            />
            <FormControlLabel
              value="ydm"
              control={<Radio color="primary" />}
              label="YYYY/DD/MM"
            />
          </RadioGroup>
        </div>
        <DialogActions style={{ marginRight: "8px" }}>
          <Button
            onClick={this.props.handleTimeFormatDialogClose}
            style={{ marginRight: "0" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
