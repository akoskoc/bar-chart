import React from "react"
import { connect } from "react-redux"

import * as d3 from "d3"

class ChartComponent extends React.Component {


    componentDidMount() {

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
            .domain([new Date(xDomain[0]), new Date(xDomain[1])])
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
        var yAxis = d3.axisRight()
            .scale(yScale)
            .ticks(8)
            .tickFormat((number, i, arr) => i === arr.length - 1 ? "$" + number/1000 +"k" + " Billion" : number/1000 +"k")
            .tickSize(width - margin * 2)

        /* Customize y Axis */
        function customYaxis(g) {
            g.call(yAxis)
            g.attr("transform", "translate(" + margin + ",0)")
            g.selectAll("line")
                .attr("opacity", 0.5)
                .attr("stroke-dasharray", "2,10")
            g.selectAll("path")
                .attr("display", "none")
            g.selectAll("text")
                .attr("transform", "translate(" + (-width + margin + 25) + ", -10)")

        }

        /* Color scale */
        var colorScale = d3.scaleLinear()
            .domain(yDomain)
            .range(["#032d6b", "#0e612a"])



        /* Tooltip */
        var tooltip = d3.select(".container").append("div")
            .attr("class", "tooltip")
            .style("display", "none")

        /* Short description */
        svg.append("text")
            .attr("transform", "translate("+(margin + 20)+", " + (height/2 + margin * 2) + ") rotate(-90)")
            .text("Gross Domestic Product, USA")


        /* Groups */
        svg.append("g")
            .attr("transform", "translate(0," + (height - margin) +")")
            .call(xAxis)

        svg.append("g")
            .call(customYaxis)
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
                    .on("mouseover", (d) => {
                        d3.select(d3.event.currentTarget).attr("fill", "#179659")
                        tooltip
                            .style("display", null)
                            .style("left", (d3.mouse(d3.event.currentTarget)[0] + 200) + "px")
                            .style("top",  (d3.mouse(d3.event.currentTarget)[1] - 10)  + "px")
                            .html( "<span class='money'>$" + d[1] + " Billion" + " </span> <br /> <span class='date'>"  + new Date(d[0]).getFullYear() + " " + months[new Date(d[0]).getMonth()] + "</span>")

                    })
                    .on("mouseout", (d) => {
                        tooltip.style("display", "none")
                        d3.select(d3.event.currentTarget).attr("fill", (d) => colorScale(d[1]))
                    })
    }

    render() {
        return(
            <div className="container">
                <div className="shadow">
                    <svg></svg>
                    <p>{this.props.chart.description}</p>
                </div>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return state
}

export default connect(mapStateToProps)(ChartComponent)
