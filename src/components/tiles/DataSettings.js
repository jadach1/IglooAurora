import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Grow from "@material-ui/core/Grow"
import Slide from "@material-ui/core/Slide"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import withMobileDialog from "@material-ui/core/withMobileDialog"

function GrowTransition(props) {
  return <Grow {...props} />
}

function SlideTransition(props) {
  return <Slide direction="up" {...props} />
}

class DataSettings extends Component {
  state = {
    unitValue: null,
    visualizationValue: null,
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        TransitionComponent={
          this.props.fullScreen ? SlideTransition : GrowTransition
        }
        fullScreen={this.props.fullScreen}
        disableBackdropClick={this.props.fullScreen}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Data settings</DialogTitle>
        <div style={{ height: "100%" }}>
          <div style={{ paddingLeft: "24px" }}>Unit of measurement</div>
          <RadioGroup
            onChange={(event, value) => this.setState({ unitValue: value })}
            value={this.state.unitValue}
            style={{ paddingLeft: "24px", paddingRight: "24px" }}
          >
            <FormControlLabel
              value="celsius"
              control={<Radio color="primary" />}
              label="Celsius (°C)"
            />
            <FormControlLabel
              value="fahrenheit"
              control={<Radio color="primary" />}
              label="Fahrenheit (°F)"
            />
            <FormControlLabel
              value="kelvin"
              control={<Radio color="primary" />}
              label="Kelvin (K)"
            />
          </RadioGroup>
          <br />
          <div style={{ paddingLeft: "24px" }}>Visualization</div>
          <RadioGroup
            onChange={(event, value) =>
              this.setState({ visualizationValue: value })
            }
            value={this.state.visualizationValue}
            style={{ paddingLeft: "24px", paddingRight: "24px" }}
          >
            <FormControlLabel
              value="number"
              control={<Radio color="primary" />}
              label="Number"
            />
            <FormControlLabel
              value="plot"
              control={<Radio color="primary" />}
              label="Plot"
            />
          </RadioGroup>
        </div>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog({ breakpoint: "xs" })(DataSettings)
