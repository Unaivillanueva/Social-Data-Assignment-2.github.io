var current_data = 2003;
d3.json('data_vis_1.json', data_vis_1 => {
    data_2003 = data_vis_1[2003];
    data_2015 = data_vis_1[2015];

    const w = 1000;
    const h = 600;
    const r_max = 30;
    const padding = 90;

	
    let svg = d3.select('#v1').append("svg")
			  .attr("width", w)
			  .attr("height", h);
	
    const text_label = d3.select("div#v1").append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0);

    let arr_x_1 = Object.values(data_2003).map(i => i['PROSTITUTION']);
    let arr_x_2 = Object.values(data_2015).map(i => i['PROSTITUTION']);
    let xScale = d3.scaleLinear()
                   .domain([0, Math.max(...new Set([...arr_x_1, ...arr_x_2]))])
                   .range([padding, w - padding]);

    let arr_y_1 = Object.values(data_2003).map(i => i['VEHICLE THEFT']);
    let arr_y_2 = Object.values(data_2015).map(i => i['VEHICLE THEFT']);
    let yScale = d3.scaleLinear()
                   .domain([0, Math.max(...new Set([...arr_y_1, ...arr_y_2]))])
                   .range([h - padding, padding]);

    let arr_r_1 = Object.values(data_2003).map(i => i['total']);
    let arr_r_2 = Object.values(data_2015).map(i => i['total']);
    let rScale = d3.scaleLinear()
                   .domain([0, Math.max(...new Set([...arr_r_1, ...arr_r_2]))])
                   .range([0, r_max]);


    let xAxis = d3.axisBottom()
                  .scale(xScale)
                  .ticks(10);

    let yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

                  
    const updateSvg = (data, transition) => {
        if (!transition) {
            //circles
            svg.selectAll("circle").data(Object.values(data)).enter().append('circle').attr('opacity', '0.4')
            .attr('r', p => rScale(p['total'])).attr('cx', p => xScale(p['PROSTITUTION'])).attr('cy', p => yScale(p['VEHICLE THEFT']));

            //text
            svg.selectAll("text").data(Object.entries(data)).enter().append('text')
            .text(p => p[0]).attr('x', p => xScale(p[1]['PROSTITUTION'])).attr('y', p => yScale(p[1]['VEHICLE THEFT']))
            .attr('font-family','Helvetica Neue, Roboto, sans-serif').attr('font-size','12px').attr('fill','black')
            .on("mouseover", function(data, transition) {
                  d3.select(this)
                  .transition().duration(200)
                  .style("font-weight", "bold")
                  .style("fill","#20B2AA")
                  .style("font-size", "20px")
                  
                  text_label.transition()
                    .duration(200)
                    .style("opacity", .9);
                  text_label.html("Prostitution: <b>" + (data[1]['PROSTITUTION']) + "</b><br/>" + 
                             "Vehicle Theft: <b>" + (data[1]['VEHICLE THEFT']) + "</b>")
                    .attr('x',(data[1]['PROSTITUTION'])).attr('y', (data[1]['VEHICLE THEFT']));
                    
                })
                .on("mouseout", function(data, transition) {
                  d3.select(this)
                    .transition().duration(500)
                    .style("font-weight", null)
                    .style("fill", "black")
                    .style("font-size", "10px");
                    text_label.transition()
                      .duration(1000)
                      .style("opacity", 0);
                });   

            //Define clipping path
            svg.append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("x", padding)
            .attr("y", padding)
            .attr("width", w-padding *2 )
            .attr("height", h-padding * 2);

        } else {
            svg.selectAll("circle").data(Object.values(data)).transition().duration(1000)
            .attr('r', p => rScale(p['total'])).attr('cx', p => xScale(p['PROSTITUTION'])).attr('cy', p => yScale(p['VEHICLE THEFT']));

            svg.selectAll("text").data(Object.entries(data)).transition().duration(1000)
            .text(p => p[0]).attr('x', p => xScale(p[1]['PROSTITUTION'])).attr('y', p => yScale(p[1]['VEHICLE THEFT']));   

             //Define clipping path
            svg.append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("x", padding)
            .attr("y", padding)
            .attr("width", w-padding *2 )
            .attr("height", h-padding * 2);
        }
    }

    updateSvg(data_2003);

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0," + (h - padding) + ")")
       .call(xAxis);

    // now add titles to the Y axis
    svg.append("text")
          .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          .attr("transform", "translate("+ (padding/6) +","+(h/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
          .text("Vehicle Theft");

    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + padding + ", 0)")
       .call(yAxis);

    // now add titles to the X axis
    svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (w/2) +","+(h-(padding/3) )+")")  // centre below axis
            .text("Prostitution");

    d3.select('#button2015').on('click', () => {
            if (current_data == 2003) {current_data = 2015; updateSvg(data_2015, true); 
            d3.select('#button2003').style('background-color', '#DCDCDC');
            d3.select('#button2015').style('background-color', '#20B2AA');}
        else if (current_data == 2015) {current_data = 2003; updateSvg(data_2003, true); 
            d3.select('#button2015').style('background-color', '#DCDCDC');
            d3.select('#button2003').style('background-color', '#20B2AA');}
          });

    d3.select('#button2003').on('click', () => {

            if (current_data == 2003) {current_data = 2015; updateSvg(data_2015, true); 
            d3.select('#button2003').style('background-color', '#DCDCDC');
            d3.select('#button2015').style('background-color', '#20B2AA');}
        else if (current_data == 2015) {current_data = 2003; updateSvg(data_2003, true); 
            d3.select('#button2015').style('background-color', '#DCDCDC');
            d3.select('#button2003').style('background-color', '#20B2AA');}

        console.log(current_data);
    });
});

