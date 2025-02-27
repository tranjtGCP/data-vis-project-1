// Some code referenced from provided class materials

// Barchart 1, starts as Age65AndOlder
let barchart;
// Get data from csv for each bar/county
d3.csv("data/" + document.getElementById("leftSelector").value + ".csv")
  .then((data) => {
    data.forEach((d) => {
      if (d.FIPS !== 0) {
        d.name = d.County;
        d.Value = +d.Value;
      }
    });

    // Sort data by population
    data.sort((a, b) => b.Value - a.Value);

    // Render bar chart
    barchart = new Barchart({ parentElement: "#barChart1" }, data);
    barchart.updateVis();

    // Add bar chart title
    const title = document.createElement("h4");
    const text = document.createTextNode(
      document.getElementById("leftSelector").value
    );
    title.appendChild(text);
    const ele = document.getElementById("barTitle");
    ele.appendChild(title);
  })
  .catch((error) => console.error(error));

// // Barchart 2, starts as TotPop2020
let barchart2;
// Get data from csv for each bar/county
d3.csv("data/" + document.getElementById("rightSelector").value + ".csv")
  .then((data) => {
    data.forEach((d) => {
      if (d.FIPS !== 0) {
        d.Value = +d.Value;
      } else {
      }
    });

    // Sort data by population
    data.sort((a, b) => b.Value - a.Value);

    // Add bar chart title
    const title = document.createElement("h4");
    const text = document.createTextNode(
      document.getElementById("rightSelector").value
    );
    title.appendChild(text);
    const ele = document.getElementById("barTitle2");
    ele.appendChild(title);

    // Sort data by population
    data.sort((a, b) => b.Value - a.Value);

    // Initialize chart and then show it
    barchart = new Barchart({ parentElement: "#barChart2" }, data);
    barchart.updateVis();
  })
  .catch((error) => console.error(error));

// Chloropleth map 1, starts as Age65AndOlder
let chloroplethMap;
Promise.all([
  d3.json("data/counties-10m.json"),
  d3.csv("data/" + document.getElementById("leftSelector").value + ".csv"),
])
  .then((data) => {
    // Access csv data through these variables
    const geoData = data[0];
    const countyData = data[1];

    // Get data from csv for each county
    geoData.objects.counties.geometries.forEach((d) => {
      console.log(d);
      //
      for (let i = 0; i < countyData.length; i++) {
        if (d.id === countyData[i].FIPS) {
          d.properties.value = Number(countyData[i].Value);
        }
      }
    });

    // Render chloropleth map
    const chloroplethMap = new ChoroplethMap(
      {
        parentElement: ".viz",
      },
      geoData
    );

    // Add map title
    const title = document.createElement("h4");
    const text = document.createTextNode(
      document.getElementById("leftSelector").value
    );
    title.appendChild(text);
    const ele = document.getElementById("viz");
    ele.appendChild(title);
  })
  .catch((error) => console.error(error));

// Chloropleth map 2, starts as TotPop2020
let chloroplethMap2;
Promise.all([
  d3.json("data/counties-10m.json"),
  d3.csv("data/" + document.getElementById("rightSelector").value + ".csv"),
])
  .then((data) => {
    // Access csv data through these variables
    const geoData = data[0];
    const mapData2 = data[1];

    // Get data from csv for each county
    geoData.objects.counties.geometries.forEach((d) => {
      console.log(d);
      //
      for (let i = 0; i < mapData2.length; i++) {
        if (d.id === mapData2[i].FIPS) {
          d.properties.state = mapData2[i].State;
          d.properties.value = +mapData2[i].Value;
        }
      }
    });

    // Render chloropleth map
    const chloroplethMap2 = new ChoroplethMap(
      {
        parentElement: ".viz2",
      },
      geoData
    );

    // Add map title
    const title = document.createElement("h4");
    const text = document.createTextNode(
      document.getElementById("rightSelector").value
    );
    title.appendChild(text);
    const ele = document.getElementById("viz2");
    ele.appendChild(title);
  })
  .catch((error) => console.error(error));

// Updates charts on the left side, same functionality or logic as barchart and map functions
function updateCharts1() {
  let element = document.getElementById("barChart1");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  element = document.getElementById("barTitle");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  d3.csv("data/" + document.getElementById("leftSelector").value + ".csv")
    .then((data) => {
      data.forEach((d) => {
        if (d.FIPS !== 0) {
          d.Value = +d.Value;
        }
      });

      // Sort data by population
      data.sort((a, b) => b.Value - a.Value);

      // Initialize chart and then show it
      barchart = new Barchart({ parentElement: "#barChart1" }, data);
      barchart.updateVis();
      const title = document.createElement("h4");
      const text = document.createTextNode(
        document.getElementById("leftSelector").value
      );
      title.appendChild(text);
      const ele = document.getElementById("barTitle");
      ele.appendChild(title);
    })
    .catch((error) => console.error(error));

  element = document.getElementById("viz");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  Promise.all([
    d3.json("data/counties-10m.json"),
    d3.csv("data/" + document.getElementById("leftSelector").value + ".csv"),
  ])
    .then((data) => {
      // Access csv data through these variables
      const geoData = data[0];
      const countyData = data[1];

      geoData.objects.counties.geometries.forEach((d) => {
        console.log(d);
        //
        for (let i = 0; i < countyData.length; i++) {
          if (d.id === countyData[i].FIPS) {
            d.properties.value = Number(countyData[i].Value);
          }
        }
      });

      const chloroplethMap = new ChoroplethMap(
        {
          parentElement: ".viz",
        },
        geoData
      );

      const title = document.createElement("h4");
      const text = document.createTextNode(
        document.getElementById("leftSelector").value
      );
      title.appendChild(text);
      const ele = document.getElementById("viz");
      ele.appendChild(title);
    })
    .catch((error) => console.error(error));
}

// Updates charts on the right side, same functionality or logic as barchart and map functions
function updateCharts2() {
  let element = document.getElementById("barChart2");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  element = document.getElementById("barTitle2");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  d3.csv("data/" + document.getElementById("rightSelector").value + ".csv")
    .then((data) => {
      data.forEach((d) => {
        if (d.FIPS !== 0) {
          d.Value = +d.Value;
        }
      });

      // Sort data by population
      data.sort((a, b) => b.Value - a.Value);

      // Initialize chart and then show it
      barchart = new Barchart({ parentElement: "#barChart2" }, data);
      barchart.updateVis();
      const title = document.createElement("h4");
      const text = document.createTextNode(
        document.getElementById("rightSelector").value
      );
      title.appendChild(text);
      const ele = document.getElementById("barTitle2");
      ele.appendChild(title);
    })
    .catch((error) => console.error(error));

  element = document.getElementById("viz2");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  Promise.all([
    d3.json("data/counties-10m.json"),
    d3.csv("data/" + document.getElementById("rightSelector").value + ".csv"),
  ])
    .then((data) => {
      // Access csv data through these variables
      const geoData = data[0];
      const countyData = data[1];

      geoData.objects.counties.geometries.forEach((d) => {
        console.log(d);
        //
        for (let i = 0; i < countyData.length; i++) {
          if (d.id === countyData[i].FIPS) {
            d.properties.value = Number(countyData[i].Value);
          }
        }
      });

      const chloroplethMap2 = new ChoroplethMap(
        {
          parentElement: ".viz2",
        },
        geoData
      );
      const title = document.createElement("h4");
      const text = document.createTextNode(
        document.getElementById("rightSelector").value
      );
      title.appendChild(text);
      const ele = document.getElementById("viz2");
      ele.appendChild(title);
    })
    .catch((error) => console.error(error));
}
