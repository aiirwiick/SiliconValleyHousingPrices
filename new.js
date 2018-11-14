var width = 3550, height = 925;

var projection = d3.geoAlbers()
    .scale(4000)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("div").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.queue()
    .defer(d3.json, "ca_county.json") // Load US Counties
    .defer(d3.csv, "2018_data.csv")
    .await(ready); // Run 'ready' when JSONs are loaded

function ready(error, topology, price) {
  if (error) throw error;

  var rateById = {} // Create empty object for holding dataset
  price.forEach(function(d) {
    rateById[d.id] = +d.price; // Create property for each ID, give it value from rate
  });
  console.log(rateById)

  var geojson = topojson.feature(topology, {
        type: "GeometryCollection",
        geometries: topology.objects.ca_county.geometries
    });

    // var color = d3.scaleThreshold()
    //   .domain([0, 250000, 500000, 750000, 1000000, 1250000, 1500000])
    //   .range(d3.schemeBlues[7]);

    var domain = [0, 1, 150000, 300000, 450000, 600000, 750000, 900000, 1050000, 1200000, 1350000, 1500000]
    var color = d3.scaleThreshold()
        .domain(domain)
        .range(["#DAF7A6", "#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828", "#B71C1C"]);

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(geojson.features) // Bind TopoJSON data elements
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) {
		    return color(d.price = rateById[d.properties.NAME]); // get rate value for property matching data ID
		    // pass rate value to color function, return color based on domain and range
	    })
      .style("stroke", "white")
      .style("stroke-width", ".1px");
}
