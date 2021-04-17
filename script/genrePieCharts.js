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

    var nodes = svg.selectAll("g.node")
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
            arc.outerRadius(d.r);
            return arc(d);
        })
        .style("fill", function(d, i) { return colorMap[d.data[0]]; });

    arcEnter.append("text")
        .attr('x', function(d) { arc.outerRadius(d.r); return arc.centroid(d)[0]; })
        .attr('y', function(d) { arc.outerRadius(d.r); return arc.centroid(d)[1]; })
        .attr('dy', "0.35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.value === 0?"":d.value });

    var labels = nodeEnter.selectAll("text.label")
        .data(function(d) { return [d.data.genre]; });
    labels.enter().append("text")
        .attr('class', 'label')
        .attr('dy', '0.35em')
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(String);

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
