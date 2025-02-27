// Some code and logic referenced from class materials provided

class ChoroplethMap {
  // Constructor
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 400,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
      legendBottom: 50,
      legendLeft: 50,
      legendRectHeight: 12,
      legendRectWidth: 150,
    };
    this.data = _data;
    this.us = _data;
    this.active = d3.select(null);
    this.initVis();
  }

  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Create svg area
    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("class", "center-container")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Add background for svg
    vis.svg
      .append("rect")
      .attr("class", "background center-container")
      .attr("height", vis.config.containerWidth) //height + margin.top + margin.bottom)
      .attr("width", vis.config.containerHeight) //width + margin.left + margin.right)
      .on("click", vis.clicked);

    // Create USA projection
    vis.projection = d3
      .geoAlbersUsa()
      .translate([vis.width / 2, vis.height / 2])
      .scale(vis.width);
    vis.path = d3.geoPath().projection(vis.projection);

    // Color gradient for data on map
    vis.colorScale = d3
      .scaleLinear()
      .domain(
        d3.extent(
          vis.data.objects.counties.geometries,
          (d) => d.properties.value
        )
      )
      .range(["#b3fb72", "#f9724a"])
      .interpolate(d3.interpolateHcl);

    // Set map area
    vis.g = vis.svg
      .append("g")
      .attr("class", "center-container center-items us-state")
      .attr(
        "transform",
        "translate(" +
          vis.config.margin.left +
          "," +
          vis.config.margin.top +
          ")"
      )
      .attr(
        "width",
        vis.width + vis.config.margin.left + vis.config.margin.right
      )
      .attr(
        "height",
        vis.height + vis.config.margin.top + vis.config.margin.bottom
      );

    // Render map
    vis.counties = vis.g
      .append("g")
      .attr("id", "counties")
      .selectAll("path")
      .data(topojson.feature(vis.us, vis.us.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", vis.path)
      .attr("fill", (d) => {
        if (d.properties.value) {
          return vis.colorScale(d.properties.value);
        } else {
          return "url(#lightstripe)";
        }
      });

    // Map tooltip event
    vis.counties.on("mousemove", (event, d) => {
      console.log(d);
      console.log(event);
      const value = d.properties.value
        ? `<strong>${d.properties.value}</strong> people<sup>2</sup>`
        : "No data available";
      d3
        .select("#tooltipMap")
        .style("display", "block")
        .style("left", event.pageX + vis.config.tooltipPadding + "px")
        .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
          <div class="tooltipMapInner">
          <h4>${d.properties.name},</h4>
          <h4>${d.properties.state}</h4>
          ${d.properties.value} people
          </div>
        `);
    });

    // Borders of states
    vis.g
      .append("path")
      .datum(
        topojson.mesh(vis.us, vis.us.objects.states, function (a, b) {
          return a !== b;
        })
      )
      .attr("id", "state-borders")
      .attr("d", vis.path);

    // I tried implementing a legend here, but I did not have enough time

    // vis.legendStops = [
    //   { color: "#cfe2f2", value: d3.min((d) => d.value), offset: 0 },
    //   {
    //     color: "#0d306b",
    //     value: d3.max((d) => d.value),
    //     offset: 100,
    //   },
    // ];

    // // Initialize gradient that we will later use for the legend
    // vis.linearGradient = vis.svg
    //   .append("defs")
    //   .append("linearGradient")
    //   .attr("id", "legend-gradient");

    // // Append legend
    // vis.legend = vis.svg
    //   .append("g")
    //   .attr("class", "legend")
    //   .attr(
    //     "transform",
    //     `translate(${vis.config.legendLeft},${
    //       vis.height - vis.config.legendBottom
    //     })`
    //   );

    // vis.legendRect = vis.legend
    //   .append("rect")
    //   .attr("width", vis.config.legendRectWidth)
    //   .attr("height", vis.config.legendRectHeight);

    // vis.legendTitle = vis.legend
    //   .append("text")
    //   .attr("class", "legend-title")
    //   .attr("dy", ".35em")
    //   .attr("y", -10)
    //   .text("Population");

    // // Add legend labels
    // vis.legend
    //   .selectAll(".legend-label")
    //   .data(vis.legendStops)
    //   .join("text")
    //   .attr("class", "legend-label")
    //   .attr("text-anchor", "middle")
    //   .attr("dy", ".35em")
    //   .attr("y", 20)
    //   .attr("x", (d, index) => {
    //     return index == 0 ? 0 : vis.config.legendRectWidth;
    //   })
    //   .text((d) => Math.round(d.value * 10) / 10);

    // // Update gradient for legend
    // vis.linearGradient
    //   .selectAll("stop")
    //   .data(vis.legendStops)
    //   .join("stop")
    //   .attr("offset", (d) => d.offset)
    //   .attr("stop-color", (d) => d.color);
  }
}
