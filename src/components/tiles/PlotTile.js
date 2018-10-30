import React, { Component } from "react"
import { line, curveNatural, area } from "d3-shape"
import { scaleLinear, scaleTime } from "d3-scale"

class PlotTile extends Component {
  render() {
    const threshold = this.props.threshold

    const xData = this.props.value.map(value => new Date(value.timestamp))
    const yData = this.props.value.map(value => value.value)

    let domainX = ""

    if (this.props.value.lenght > 0)
      domainX = [
        new Date(
          xData.reduce(function(x1, x2) {
            return x1 < x2 ? x1 : x2
          })
        ),
        new Date(
          xData.reduce(function(x1, x2) {
            return x1 > x2 ? x1 : x2
          })
        ),
      ]
    const rangeX = [48, 410]

    const domainY = [Math.min(...yData), Math.max(...yData)]
    const rangeY = [195, 24]

    const scaleX = scaleTime()
      .domain(domainX)
      .range(rangeX)

    const scaleY = scaleLinear()
      .domain(domainY)
      .range(rangeY)

    const xTicks = scaleX.ticks(4)
    const yTicks = scaleY.ticks(4)

    const xFormat = scaleX.tickFormat(4)
    const yFormat = scaleY.tickFormat(4)

    const areaD = area()
      .x(d => scaleX(d[0]))
      .y1(d => scaleY(d[1]))
      .y0(() => 225)
      .defined(d => d[2])
      .curve(curveNatural)

    const lineD = line()
      .x(d => scaleX(d[0]))
      .y(d => scaleY(d[1]))
      .defined(d => d[2])
      .curve(curveNatural)

    const circles = this.props.value.map(value => (
      <circle
        cx={scaleX(new Date(value.timestamp))}
        cy={scaleY(value.value)}
        r={5}
        fill={value.value < threshold ? "#0057cb" : "#f44336"}
        stroke="none"
        key={value.id}
      />
    ))

    if (this.props.value[0])
      return (
        <svg
          height="100%"
          width="100%"
          fill="none"
          stroke="black"
          className="notSelectable"
        >
          {xTicks.map(tick => (
            <React.Fragment>
              <line
                x1={scaleX(tick)}
                x2={scaleX(tick)}
                y1="205"
                y2="215"
                stroke="black"
                key={"xTick" + tick}
              />
              <text
                x={scaleX(tick)}
                y="225"
                fontFamily="Verdana"
                fontSize="10"
                fill="black"
                stroke="none"
                textAnchor="middle"
                key={"xLabel" + tick}
              >
                {xFormat(tick)}
              </text>
            </React.Fragment>
          ))}
          {yTicks.map(tick => (
            <React.Fragment>
              <line
                x1="15"
                x2="415"
                y1={scaleY(tick)}
                y2={scaleY(tick)}
                stroke="lightgray"
                key={"yTick" + tick}
              />
              <text
                x="25"
                y={scaleY(tick)}
                dy="-2"
                fontFamily="Verdana"
                fontSize="10"
                fill="black"
                stroke="none"
                textAnchor="end"
                key={"yLabel" + tick}
              >
                {yFormat(tick)}
              </text>
            </React.Fragment>
          ))}

          {/* x and y axis */}

          <line x1="5" x2="415" y1="210" y2="210" stroke="black" key="xAxis" />

          {/* curve, area and dots below the curve */}
          <path
            d={areaD}
            key="area"
            clipPath="url(#graphBody)"
            fill="#71c4ff"
            fillOpacity="0.4"
            stroke="none"
          />
          <path
            d={lineD}
            key="path"
            clipPath="url(#graphBody)"
            stroke="#0057cb"
          />
          {circles}
          {/* threshold line and area */}
          {this.props.threshold && (
            <line
              x1="15"
              x2="415"
              y1={scaleY(threshold)}
              y2={scaleY(threshold)}
              stroke="#f50057"
              key={"threshold"}
            />
          )}
          <path
            d={areaD}
            key="areaThreshold"
            clipPath="url(#graphThresholdBody)"
            fill="#ff4081"
            fillOpacity="0.4"
            stroke="none"
          />
          <path
            d={lineD}
            key="pathThreshold"
            clipPath="url(#graphThresholdBody)"
            stroke="#f50057"
          />
        </svg>
      )

    return "This plot is empty"
  }
}

export default PlotTile
