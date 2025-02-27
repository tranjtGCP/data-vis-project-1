// Some code and logic referenced from class materials provided

class Barchart {
  // Constructor
  constructor(_config, _data) {
    // Config for svg render
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 350,
      containerHeight: _config.containerHeight || 250,
      margin: _config.margin || { top: 10, right: 5, bottom: 25, left: 70 },
      reverseOrder: _config.reverseOrder || false,
      tooltipPadding: _config.tooltipPadding || 15,
    };
    this.data = _data;
    this.initVis();
  }

  initVis() {
    let vis = this;

    // Inner chart size
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Set scales and axes
    vis.yScale = d3.scaleLog().range([vis.height, 0]);
    vis.xScale = d3.scaleBand().range([0, vis.width]).paddingInner(0);
    vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0);
    vis.yAxis = d3
      .axisLeft(vis.yScale)
      .ticks(6)
      .tickSizeOuter(0)
      .tickFormat(d3.formatPrefix(".0s", 1));

    // Set svg area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Add group to svg containing actual map
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Add x axis to graph
    vis.xAxisG = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${vis.height})`)
      .selectAll("text")
      .attr("transform", "translate(-10, -10)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", 5)
      .style("fill", "black");

    // Add y axis to graph
    vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");
  }

  updateVis() {
    let vis = this;

    // x and y values from data in main
    vis.xValue = (d) => d.County;
    vis.yValue = (d) => d.Value;

    // Set the scale input domains
    vis.xScale.domain(vis.data.map(vis.xValue));
    vis.yScale.domain([1, d3.max(vis.data, vis.yValue)]);

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    // Add bars
    let bars = vis.chart
      .selectAll(".bar")
      .data(vis.data, vis.xValue)
      .join("rect");

    bars
      .style("opacity", 0.5)
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .attr("class", "bar")
      .attr("x", (d) => vis.xScale(vis.xValue(d)))
      .attr("width", vis.xScale.bandwidth())
      .attr("height", (d) => vis.height - vis.yScale(vis.yValue(d)))
      .attr("y", (d) => vis.yScale(vis.yValue(d)))
      .attr("fill", "green");

    // Tooltip event listeners
    bars
      .on("mouseover", (event, d) => {
        // Format number with million and thousand separator
        d3.select("#tooltipBar").style("opacity", 1).html(`
              <h4>${d.County},</h4>
              <h4>${d.State}</h4>
              ${d3.format(",")(d.Value)} people
             </div>
          `);
      })
      .on("mousemove", (event) => {
        d3.select("#tooltip")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px");
      });
    // .on('mouseleave', () => {
    //   d3.select('#tooltipBar').style('opacity', 0);
    // });

    // Update axes
    vis.xAxisG.transition().duration(1000).call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}
