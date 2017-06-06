import React from "react"
import { connect } from "react-redux"

import * as d3 from "d3"

class ChartComponent extends React.Component {


    componentDidMount() {

        var margin = 50

        var width = 1000
        var height = 500

        /* Domains */
        var xDomain = d3.extent(this.props.chart.data, (d) => d[0])
        var yDomain = d3.extent(this.props.chart.data, (d) => d[1])

        /* SVG */
        var svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)

        /* X scale */
        var xScale = d3.scaleTime()
            .domain([new Date(xDomain[0]), new Date(xDomain[1])]).nice()
            .range([margin, width - margin])

        /* Y scale */
        var yScale = d3.scaleLinear()
            .domain([0, yDomain[1]]).nice()
            .range([height - margin, margin])


        /* X axis */
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(8)

        /* Y axis */
        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(8, "s")
            .tickSize(width - margin * 2)

        /* Color scale */
        var colorScale = d3.scaleLinear()
            .domain(yDomain)
            .range(["#032d6b", "#0e612a"])

        /* Groups */
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin) +")")
            .call(xAxis)

        svg.append("g")
            .attr("transform", "translate(" + (width - margin) + ",0)")
            .call(yAxis)
            .selectAll("line, path")
            .attr("opacity", 0.2)

        svg.append("g")
            .selectAll("rect")
            .data(this.props.chart.data)
            .enter()
                .append("rect")
                    .attr("fill", (d) => colorScale(d[1]))
                    .attr("width", (width - margin * 2) / this.props.chart.data.length)
                    .attr("height", (d) => height - margin - (yScale(d[1])))
                    .attr("x", (d, i ) => margin + i * ((width - margin * 2) / this.props.chart.data.length))
                    .attr("y", (d) => yScale(d[1]))
    }

    render() {
        return(
            <svg></svg>
        )
    }
}

function mapStateToProps(state) {
    return state
}

export default connect(mapStateToProps)(ChartComponent)
