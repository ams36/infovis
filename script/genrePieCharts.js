// modified from: https://bl.ocks.org/jsl6906/6560687444d2e1421e4d24360c27728a
window.renderGenreCharts = function (view) {
    let genres = formatGenres(view)

    const diameter = 1000

    const bubble = d3.pack()
            .size([diameter, diameter])
            .padding(20),
        root = d3.hierarchy({children: genres})
            .sum(function(d) { return d.children ? 0 : (d.netflix + d.hulu+ d.prime +  d.disney); }),
        arc = d3.arc().innerRadius((d) => { return d.r * 0.5}),
        pie = d3.pie().value((d) => d[1]);

    var nodeData = bubble(root).children;

    var svg = d3.select("#genreDiagram")
        .html("")
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", [0, 0, diameter, diameter])
        // .attr("width", diameter)
        // .attr("height", diameter)
        .attr("class", "bubble");

    const everything = svg.append("g")

    var nodes = everything.selectAll("g.node")
        .data(nodeData);

    var nodeEnter = nodes.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    var arcGs = nodeEnter.selectAll("g.arc")
        .data(function(d) {
            return pie(Object.entries(d.data).slice(1)).map(function(m) { m.r = d.r; m.p = d.data.platform; m.genre = d.data.genre; return m; });
        });
    var arcEnter = arcGs.enter().append("g").attr("class", "arc");

    arcEnter.append("path")
        .attr("d", function(d) {
            arc.outerRadius(d.r)
            return arc(d)
        })
        .on("mousemove", createGenreTooltip)
            .on("mouseleave", () => {
                tooltip.style("display", "none")
        })
        .style("fill", function(d, i) { return colorMap[d.data[0]]; });

    function createGenreTooltip(t, d) {  // the datum you want
        console.log(t)
        console.log(d)
        tooltip
            .style("left", t.pageX + 20 + "px")
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            .html(generateGenreTooltipText(t, d));
    }

    function generateGenreTooltipText(t, d){
        return `Count of ${d.genre} Movies on ${d.data[0].capitalise()}: <br>
        <b>Runtime: </b>${d.data[1]} <br>`
    }

    // TODO: Remove this but keep it until tooltips are created in case i need inspiration
    // arcEnter.append("text")
    //     .attr('x', function(d) { arc.outerRadius(d.r); return arc.centroid(d)[0]; })
    //     .attr('y', function(d) { arc.outerRadius(d.r); return arc.centroid(d)[1]; })
    //     .attr('dy', "0.35em")
    //     .style("text-anchor", "middle")
    //     .text(function(d) { return d.value === 0?"":d.value });

    var labels = nodeEnter.selectAll("text.label")
        .data(function(d) { return [d]; });
    labels.enter().append("text")
        // i think I update the font size here
        .attr('class', 'label')
        .attr('dy', '0.35em')
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .style('font-size',  (d) => (d.r*0.015) + 'em')
        .text((d) => d.data.genre);

    // zoom modified from: https://observablehq.com/@d3/zoom-with-tooltip
    // and: https://bl.ocks.org/saifulazfar/f2da589a3abbe639fee0996198ace301
    const zoom = d3.zoom()
        .extent([[0, 0], [diameter, diameter]])
        .scaleExtent([1, 40])
        .on("zoom", zoomed)
    svg.call(zoom);

    //set up the initial zoom
    svg.call(zoom.transform, d3.zoomIdentity.translate(-19.093543668575762, 25.76101059564803).scale(1.0564771967121946))

   // {k: 1.0564771967121946, x: -19.093543668575762, y: 25.76101059564803}

    function zoomed({transform}) {
        console.log(transform)
        everything.attr("transform", transform);
    }

}

// data process
function formatGenres(view){

    const viewGenres = view
        .map((row) => row.genres)
        .flat()
        .filter((e, i, arr) => arr.indexOf(e) === i && e !== "")

    let results = {}
    for (const g of viewGenres){
        results[g] = {
            genre: g,
            netflix: 0,
            hulu: 0,
            disney: 0,
            prime: 0
        }
    }
    for (const movie of view){
       for (const g of movie.genres){
            if (movie.netflix) results[g].netflix++
            if (movie.hulu) results[g].hulu++
            if (movie.disney) results[g].disney++
            if (movie.prime) results[g].prime++
        }
    }
    return Object.values(results)
}
