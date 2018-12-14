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
import { graphql } from "react-apollo"
import gql from "graphql-tag"

const MOBILE_WIDTH = 600

function Transition(props) {
  return window.innerWidth > MOBILE_WIDTH ? (
    <Grow {...props} />
  ) : (
    <Slide direction="up" {...props} />
  )
}

class UnitOfMeasumentDialog extends React.Component {
  state = {
    lengthMass: "",
    temperature: "",
  }

  changeLengthMassUnit = lengthAndMass => {
    this.props.ChangeLengthMassUnit({
      variables: {
        lengthAndMass,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          lengthAndMass,
          __typename: "Setting",
        },
      },
    })
  }

  changeTemperatureUnit = temperature => {
    this.props.ChangeTemperatureUnit({
      variables: {
        temperature,
      },
      optimisticResponse: {
        __typename: "Mutation",
        settings: {
          temperature,
          __typename: "Setting",
        },
      },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.lengthMass && nextProps.lengthMass) {
      this.setState({ lengthMass: nextProps.lengthMass })
    }

    if (!this.props.temperature && nextProps.temperature) {
      this.setState({ temperature: nextProps.temperature })
    }
  }

  render() {
    return (
      <Dialog
        open={this.props.unitDialogOpen}
        onClose={this.props.handleUnitDialogClose}
        TransitionComponent={Transition}
        fullScreen={window.innerWidth < MOBILE_WIDTH}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle disableTypography>Change units of measurement</DialogTitle>
        <div
          style={{ paddingLeft: "24px", paddingRight: "24px", height: "100%" }}
        >
          Length and mass
          <RadioGroup
            onChange={event => {
              this.setState({ lengthMass: event.target.value })
              this.changeLengthMassUnit(event.target.value)
            }}
            value={this.state.lengthMass}
            style={{ marginBottom: "16px" }}
          >
            <FormControlLabel
              value="SI"
              control={<Radio color="primary" />}
              label="SI units"
            />
            <FormControlLabel
              value="IMPERIAL"
              control={<Radio color="primary" />}
              label="Imperial units"
            />
          </RadioGroup>
          Temperature
          <RadioGroup
            onChange={event => {
              this.setState({ temperature: event.target.value })
              this.changeTemperatureUnit(event.target.value)
            }}
            value={this.state.temperature}
          >
            <FormControlLabel
              value="CELSIUS"
              control={<Radio color="primary" />}
              label="Celsius"
            />
            <FormControlLabel
              value="FAHRENHEIT"
              control={<Radio color="primary" />}
              label="Fahrenheit"
            />
            <FormControlLabel
              value="KELVIN"
              control={<Radio color="primary" />}
              label="Kelvin"
            />
          </RadioGroup>
        </div>
        <DialogActions>
          <Button onClick={this.props.handleUnitDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default graphql(
  gql`
    mutation ChangeTemperatureUnit($lengthAndMass: LengthAndMass) {
      settings(lengthAndMass: $lengthAndMass) {
        lengthAndMass
      }
    }
  `,
  {
    name: "ChangeLengthMassUnit",
  }
)(
  graphql(
    gql`
      mutation ChangeTemperatureUnit($temperature: Temperature) {
        settings(temperature: $temperature) {
          temperature
        }
      }
    `,
    {
      name: "ChangeTemperatureUnit",
    }
  )(UnitOfMeasumentDialog)
)
