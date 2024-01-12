import React, { Component } from "react";
import * as d3 from "d3";
import "./DrawChart.scss";

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedConvince: this.getConvinceFromURL() || "Ha Noi",
    };
    this.infoChart = this.infoChart.bind(this);
    this.draw = this.draw.bind(this);
    this.handleConvinceChange = this.handleConvinceChange.bind(this);
  }

  componentDidMount() {
    if (!this.state.selectedConvince) {
      this.setState({ selectedConvince: "Ha Noi" });
    }

    const selectBtn = document.querySelector(".select-btn");
    selectBtn.addEventListener("click", () => {
      selectBtn.classList.toggle("open");
    });

    const items = document.querySelectorAll(".items");
    items.forEach((item) => {
      item.addEventListener("click", () => {
        item.classList.toggle("checked");

        let checked = document.querySelectorAll(".checked");
        let btnText = document.querySelector(".btn-text");

        if (checked && checked.length > 0) {
          btnText.innerText = `${checked.length} Selected`;
        } else {
          btnText.innerText = "Select Convince";
        }
      });
    });

    this.infoChart();
  }

  getConvinceFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("convince");
  }

  infoChart() {
    const { selectedConvince } = this.state;
    d3.csv(
      "https://raw.githubusercontent.com/petertran410/data_visual_project/tranngocnhan/src/Density/TongDanSo.csv"
    )
      .then((data) => {
        let year2016 = "2016";
        let year2017 = "2017";
        let year2018 = "2018";
        let year2019 = "2019";
        let year2020 = "2020";
        let year2021 = "2021";
        let filteredData = data.filter((d) => d.CONVINCE === selectedConvince);
        let dataByConvince = filteredData.map(function (d) {
          return {
            convince: d.CONVINCE,
            year2016: year2016,
            confirmYear2016: parseInt(d[year2016]),
            year2017: year2017,
            confirmYear2017: parseInt(d[year2017]),
            year2018: year2018,
            confirmYear2018: parseInt(d[year2018]),
            year2019,
            confirmYear2019: parseInt(d[year2019]),
            year2020,
            confirmYear2020: parseInt(d[year2020]),
            year2021,
            confirmYear2021: parseInt(d[year2021]),
          };
        });

        let flattenedData = [].concat(...dataByConvince);
        // this.draw(dataByConvince);
        this.draw(flattenedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  draw(data) {
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    var svg = d3
      .select("#drawChart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3
      .scaleBand()
      .domain([
        "year2016",
        "year2017",
        "year2018",
        "year2019",
        "year2020",
        "year2021",
      ])
      .range([0, width])
      .padding(-1);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "1em")
      .attr("dy", "1em")
      .attr("transform", "rotate(0)");

    var y = d3
      .scaleLinear()
      .domain([
        d3.min(data, function (d) {
          return d3.min([
            d.confirmYear2016,
            d.confirmYear2017,
            d.confirmYear2018,
            d.confirmYear2019,
            d.confirmYear2020,
            d.confirmYear2021,
          ]);
        }),
        d3.max(data, function (d) {
          return d3.max([
            d.confirmYear2016,
            d.confirmYear2017,
            d.confirmYear2018,
            d.confirmYear2019,
            d.confirmYear2020,
            d.confirmYear2021,
          ]);
        }),
      ])
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("path")
      .datum([
        { year: "year2016", confirm: d3.mean(data, (d) => d.confirmYear2016) },
        { year: "year2017", confirm: d3.mean(data, (d) => d.confirmYear2017) },
        { year: "year2018", confirm: d3.mean(data, (d) => d.confirmYear2018) },
        { year: "year2019", confirm: d3.mean(data, (d) => d.confirmYear2019) },
        { year: "year2020", confirm: d3.mean(data, (d) => d.confirmYear2020) },
        { year: "year2021", confirm: d3.mean(data, (d) => d.confirmYear2021) },
      ])

      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.year) + x.bandwidth() / 2;
          })
          .y(function (d) {
            return y(d.confirm);
          })
      );
  }

  handleConvinceChange(event) {
    const newConvince = event.target.value;
    this.setState({ selectedConvince: newConvince }, () => {
      const randomQuery = Math.random().toString(36).substring(7);
      window.location.href = `${window.location.origin}${window.location.pathname}?convince=${newConvince}&${randomQuery}`;
    });
  }

  // handleConvinceChange(event) {
  //   const newConvince = event.target.value;
  //   const { selectedConvinces } = this.state;

  //   // Toggle the selected status
  //   const index = selectedConvinces.indexOf(newConvince);
  //   if (index === -1) {
  //     selectedConvinces.push(newConvince);
  //   } else {
  //     selectedConvinces.splice(index, 1);
  //   }

  //   this.setState({ selectedConvinces }, () => {
  //     // Update the URL and redraw the chart based on the selected convinces
  //     const randomQuery = Math.random().toString(36).substring(7);
  //     const query = selectedConvinces
  //       .map((convince) => `convince=${convince}`)
  //       .join("&");
  //     window.location.href = `${window.location.origin}${window.location.pathname}?${query}&${randomQuery}`;

  //     // Redraw the chart
  //     this.infoChart();
  //   });
  // }

  render() {
    const { selectedConvince } = this.state;
    const convinceOptions = [
      "Ha Noi",
      "Ha Giang",
      "Cao Bang",
      "Bac Kan",
      "Tuyon Quang",
      "Lao Cai",
      "Dien Bion",
      "Lai Chou",
      "Son La",
      "Yon Boi",
      "Hoa Bonh",
      "Thoi Nguyon",
      "Lang Son",
      "Quang Ninh",
      "Bac Giang",
      "Phy Tho",
      "Vinh Phyc",
      "Bac Ninh",
      "Hai Duong",
      "Hai Phung",
      "Hung Yon",
      "Thoi Bonh",
      "Ha Nam",
      "Nam Dinh",
      "Ninh Bonh",
      "Thanh Hoo",
      "Nghe An",
      "Ha Tinh",
      "Quang Bonh",
      "Quang Tri",
      "Thua Thion Hue",
      "Da Nang",
      "Quang Nam",
      "Quang Ngoi",
      "Bonh Dinh",
      "Phy Yon",
      "Khonh Hoa",
      "Ninh Thuan",
      "Bonh Thuan",
      "Kon Tum",
      "Gia Lai",
      "Dak Lak",
      "Dak Nung",
      "Lom Dong",
      "Bonh Phuoc",
      "Toy Ninh",
      "Bonh Duong",
      "Dong Nai",
      "Ba Ria-Vung Tau",
      "TP Ho Cho Minh",
      "Long An",
      "Tien Giang",
      "Ben Tre",
      "Tra Vinh",
      "Vinh Long",
      "Dong Thop",
      "An Giang",
      "Kion Giang",
      "Can Tho",
      "Hau Giang",
      "Suc Trang",
      "Bac Liou",
      "Ca Mau",
    ];

    return (
      <div>
        <div className="select-btn">
          <span className="btn-text">Select convince</span>
          <span className="arrow-down">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </div>
        <ul className="list-items">
          {convinceOptions.map((convince) => (
            <li className="items">
              <span className="checkbox">
                <i className="fa-solid fa-check check-icon"></i>
              </span>
              <span className="item-text">{convince}</span>
            </li>
          ))}
        </ul>

        <div className="drawChart" id="drawChart"></div>
      </div>
    );
  }
}
