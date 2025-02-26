class ChoroplethMap {
  // Constructor
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 400,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 0, right: 10, bottom: 10, left: 10 },
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

  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
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

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("class", "center-container")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

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

    // 
    vis.path = d3.geoPath().projection(vis.projection);

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

    vis.counties = vis.g
      .append("g")
      .attr("id", "counties")
      .selectAll("path")
      .data(topojson.feature(vis.us, vis.us.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", vis.path)
      // .attr("class", "county-boundary")
      .attr("fill", (d) => {
        if (d.properties.value) {
          return vis.colorScale(d.properties.value);
        } else {
          return "url(#lightstripe)";
        }
      });

    vis.counties
      .on("mousemove", (event, d) => {
        console.log(d);
        console.log(event);
        const value = d.properties.value
          ? `<strong>${d.properties.value}</strong> people<sup>2</sup>`
          : "No data available";
        console.log(value);
        d3
          .select("#tooltipMap").html(`
                        <div class="tooltip-title">${d.properties.County}</div>
                        <div>${d.properties.value}</div>
                      `);
      })
      .on("mouseleave", () => {
        d3.select("#tooltipMap").style("display", "none");
      });

    vis.g
      .append("path")
      .datum(
        topojson.mesh(vis.us, vis.us.objects.states, function (a, b) {
          return a !== b;
        })
      )
      .attr("id", "state-borders")
      .attr("d", vis.path);
  }
}
