// script.js

const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

const width = 960;
const height = 600;
const colors = d3.schemeCategory10;

const svg = d3.select("#treemap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Tooltip
const tooltip = d3.select("#tooltip")
    .style("position", "absolute")
    .attr("id", "tooltip");

d3.json(url).then(data => {
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    const treemap = d3.treemap()
        .size([width, height])
        .paddingInner(1);

    treemap(root);

    const categories = Array.from(new Set(root.leaves().map(d => d.data.category)));
    const colorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(colors);

    // Tiles
    const nodes = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    nodes.append("rect")
        .attr("class", "tile")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.category))
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .attr("data-value", d.data.value)
                .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    nodes.append("text")
        .selectAll("tspan")
        .data(d => d.data.name.split(/(?=\s)/g))
        .enter()
        .append("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 13 + i * 10)
        .text(d => d);

    // Legend
    const legend = d3.select("#legend")
        .attr("id", "legend");

    const legendItems = legend.selectAll(".legend-item")
        .data(categories)
        .enter()
        .append("div")
        .attr("class", "legend-item");

    legendItems.append("svg")
        .attr("width", 20)
        .attr("height", 20)
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => colorScale(d));

    legendItems.append("span")
        .text(d => d);
});
