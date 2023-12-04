import React, { Component } from "react";
import * as d3 from "d3";
import "./DrawChar.scss";

const drawChart = (svgSelector) => {
  let width = 700;
  let height = 700;
  let marginTop = 20;
  let marginRight = 20;
  let marginBottom = 30;
  let marginLeft = 40;

  // const data = [12, 5, 20, 6, 9, 10];

  // d3.csv(
  //   "/home/tranngocnhan/Ngoc_Nhan/data_visual_project/src/Density/totalpopulation.csv"
  // ).then(function (data) {
  //   let year = "2016";
  //   let dataByYear = data.map(function (d) {
  //     return {
  //       tinh: d["CONVINCE"],
  //       year: year,
  //       confirm: parseInt(d[year]),
  //     };
  //   });
  //   console.log(dataByYear);
  // });

  d3.csv(
    "https://raw.githubusercontent.com/petertran410/data_visual_project/tranngocnhan/src/Density/totalpopulation.csv"
  )
    .then(function (data) {
      // Log the entire data array
      console.log(data);

      // Check if data is an array
      if (Array.isArray(data)) {
        // Assuming you want to create a new array with a specific structure
        let year = "2016";
        let dataByYear = data.map(function (d) {
          return {
            ID: d["ID"],
            CONVINCE: d["CONVINCE"],
            year: year,
            confirm: parseInt(d[year]),
          };
        });

        // Log the new array
        console.log(dataByYear);
      } else {
        console.error("Data is not an array:", data);
      }

      chartData(dataByYear);
    })
    .catch(function (error) {
      console.error("Error loading CSV:", error);
    });

  let chartData = (data) => {
    const svg = d3
      .select(svgSelector)
      .append("svg")
      .attr("width", 700)
      .attr("height", 700);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => 400 - 10 * d)
      .attr("width", 65)
      .attr("height", (d, i) => d * 10)
      .attr("fill", "green");

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (d, i) => i * 70)
      .attr("y", (d, i) => 400 - 10 * d - 3);

    // Declare the x (horizontal position) scale.
    const x = d3
      .scaleUtc()
      .domain(data.map((d) => d.year))
      .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - marginBottom, marginTop]);

    // Create the SVG container.

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

    // Add the y-axis.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y));
  };
};

export default class DrawChart extends Component {
  componentDidMount() {
    drawChart("#chart");
  }

  render() {
    return (
      <div className="d-flex chart" id="chart">
        {/* {this.componentDidMount} */}
      </div>
    );
  }
}
