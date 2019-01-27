import { Component } from "react" /*
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
} from "@devexpress/dx-react-chart-material-ui"
import { Animation } from "@devexpress/dx-react-chart"

const format = () => tick => tick*/

class PlotCard extends Component {
  constructor(props) {
    super(props)

    this.state = { chartData: [] }
  }

  componentWillMount() {
    this.props.value.forEach(value =>
      this.state.chartData.unshift({
        time: value.timestamp,
        value: value.value,
      })
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      nextProps.value.forEach(value =>
        this.state.chartData.unshift({
          time: value.timestamp,
          value: value.value,
        })
      )
    }
  }

  render() {
    if (this.props.value[0])
      return "This plot isn't empty" /*
        <Chart data={this.state.chartData}>
          <ArgumentAxis tickFormat={format} />
          <ValueAxis
            labelComponent={props => {
              const { text } = props
              return (
                <ValueAxis.Label
                  {...props}
                  text={
                    this.props.unitOfMeasurement
                      ? text + " " + this.props.unitOfMeasurement
                      : text
                  }
                />
              )
            }}
          />
          <LineSeries
            name="Value"
            valueField="value"
            argumentField="time"
            color="#0083ff"
          />
          <Animation />
        </Chart> */

    return "This plot is empty"
  }
}

export default PlotCard
