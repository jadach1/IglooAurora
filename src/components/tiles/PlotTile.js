import React, { Component } from "react"
import { line, curveNatural, area } from "d3-shape"
import { scaleLinear } from "d3-scale"

class PlotTile extends Component {
  render() {
    let parsedData = [
      [0, 12, true],
      [1, 4, true],
      [2, 1, true],
      [3, 7, true],
      [4, 13, true],
      [5, 12, true],
      [6, 4, true],
      [7, 4, true],
      [8, 5, true],
      [9, 13, true],
      [10, 1, true],
      [11, 7, true],
      [12, 12, true],
      [13, 13, true],
      [14, 13, true],
      [15, 6, true],
    ]

    const threshold = this.props.threshold

    const xData = parsedData.map(el => el[0])
    const yData = parsedData.map(el => el[1])

    const domainX = [Math.min(...xData), Math.max(...xData)]
    const rangeX = [40, 410]

    const domainY = [Math.min(...yData), Math.max(...yData)]
    const rangeY = [195, 20]

    const scaleX = scaleLinear()
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

    const circles = parsedData.map(d => (
      <circle
        cx={scaleX(d[0])}
        cy={scaleY(d[1])}
        r={5}
        fill={d[1] < threshold ? "#0057cb" : "#f44336"}
        stroke="none"
        key={d}
      />
    ))

    return (
      <svg height="230" width="420" fill="none" stroke="black">
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
        <line x1="30" x2="30" y1="5" y2="225" stroke="black" key="yAxis" />

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
        <line
          x1="15"
          x2="415"
          y1={scaleY(threshold)}
          y2={scaleY(threshold)}
          stroke="#f50057"
          key={"threshold"}
        />

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
  }
}

export default PlotTile
