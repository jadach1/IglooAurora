import React from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
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

export default class UnitOfMeasumentDialog extends React.Component {
  state = {
    value: 1,
  }

  render() {
    return (
      <Dialog
        open={this.props.unitDialogOpen}
        onClose={this.props.handleUnitDialogClose}
        className="notSelectable"
        TransitionComponent={Transition}
        titleClassName="defaultCursor"
        fullScreen={window.innerWidth < MOBILE_WIDTH}
      >
        <DialogTitle
          className="notSelectable defaultCursor"
          style={window.innerWidth > MOBILE_WIDTH ? { width: "350px" } : null}
        >
          Change units of measurement
        </DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Lenght and mass
          <RadioGroup
            onChange={event => this.setState({ value: event.target.value })}
            value={this.state.value || "auto"}
            style={{ paddingLeft: "24px", paddingRight: "24px" }}
          >
            <FormControlLabel
              value="si"
              control={<Radio color="primary" />}
              label="SI units"
            />
            <FormControlLabel
              value="imperial"
              control={<Radio color="primary" />}
              label="Imperial units"
            />
          </RadioGroup>
          <br />
          Temperature
          <RadioGroup
            onChange={event => this.setState({ value: event.target.value })}
            value={this.state.value || "auto"}
            style={{ paddingLeft: "24px", paddingRight: "24px" }}
          >
            <FormControlLabel
              value="celsius"
              control={<Radio color="primary" />}
              label="Celsius"
            />
            <FormControlLabel
              value="fahrenheit"
              control={<Radio color="primary" />}
              label="Fahrenheit"
            />
            <FormControlLabel
              value="kelvin"
              control={<Radio color="primary" />}
              label="Kelvin"
            />
          </RadioGroup>
        </div>
        <DialogActions style={{ marginRight: "8px" }}>
          <Button
            onClick={this.props.handleUnitDialogClose}
            style={{ marginRight: "0" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
