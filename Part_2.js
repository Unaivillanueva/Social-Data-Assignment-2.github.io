var k_means_param = 2;
const w = 1000;
const h = 800;
const svg = d3.select('#v_prost').append("svg")
                .attr("width", w)
                .attr("height", h);

d3.json('sfpddistricts.geojson', geodata => {
d3.json('data_week8.json', data => {
    let projection = d3.geoMercator()
                       .center([-122.433701, 37.767683])
                       .scale(250000)
                       .translate([w / 2, h / 2])

    let path = d3.geoPath(projection);

    svg.selectAll("path")
       .data(geodata.features)
       .enter()
       .append("path")
       .attr("d", path);

    const colors = ['red', 'yellow', 'green', 'blue', 'magenta'];
    const colors_centers = ['pink', 'orange', 'turquoise', 'violet', 'crimson'];

    svg.selectAll("circle")
       .data(data.data)
       .enter()
       .append("circle")
       .attr("cx", d => projection([d[0], d[1]])[0])
       .attr("cy", d => projection([d[0], d[1]])[1])
       .attr("r", 5)
       .style("fill", d => colors[d[k_means_param]])
       .style("opacity", 0.75);

    svg.selectAll("circle")
       .data(data.centers[k_means_param - 2], d => d)
       .enter()
       .append("circle")
       .attr("cx", d => projection([d[0], d[1]])[0])
       .attr("cy", d => projection([d[0], d[1]])[1])
       .attr("r", 20)
       .style("fill", (d,i) => colors_centers[i])
       .style("opacity", 0.5)
       .attr('class', 'centers');

     const toggle = k => {
        k_means_param = k;
        svg.selectAll("circle")
           .data(data.data)
           .style("fill", d => colors[d[k_means_param]]);

        Array.from(document.querySelectorAll('circle.centers')).forEach(center => {
            center.remove();
        });

        svg.selectAll("circle")
           .data(data.centers[k_means_param - 2], d => d)
           .enter()
           .append("circle")
           .attr("cx", d => projection([d[0], d[1]])[0])
           .attr("cy", d => projection([d[0], d[1]])[1])
           .attr("r", 20)
           .style("fill", (d,i) => colors_centers[i])
           .style("opacity", 0.5)
           .attr('class', 'centers');
    }

    Array.from(document.getElementsByTagName('button')).forEach(btn => {
        btn.onclick = () => toggle(btn.dataset.val);
    });
});
});