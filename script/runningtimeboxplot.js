
// modified from: https://www.d3-graph-gallery.com/graph/boxplot_several_groups.html
// particularly: changed the nest function to the updated group function to make it work properly
// keys no longer accessed, it is d[0] instead of d.key and d[1] instead of d.value

window.renderRuntimeBoxplot = function (view) {

    const runtime_data = runtime(view)

    // set the dimensions and margins of the graph
    var margin = {top: 90, right: 60, bottom: 90, left: 60},
        width = 460 ,
        height = 300 ;

    // append the svg object to the body of the page
    var svg = d3.select("#runtimeBoxplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // set the parameter for box
    const sumstat = d3.rollup(runtime_data, (d) => {
        q1 = d3.quantile(d.map(function(g) { return g.runtime;}).sort(d3.ascending),.25)
        median = d3.quantile(d.map(function(g) { return g.runtime;}).sort(d3.ascending),.5)
        q3 = d3.quantile(d.map(function(g) { return g.runtime;}).sort(d3.ascending),.75)
        interQuantileRange = q3 - q1
        min = q1 - 1.5 * interQuantileRange
        max = q3 + 1.5 * interQuantileRange


        return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    }, (k) => {
        return k.platform
    })


    // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["netflix", "hulu", "disney", "prime"])
        .paddingInner(1)
        .paddingOuter(.5)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([40,170])
        .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))

    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d[0]))})
        .attr("x2", function(d){return(x(d[0]))})
        .attr("y1", function(d){return(y(d[1].min))})
        .attr("y2", function(d){return(y(d[1].max))})
        .attr("stroke", "black")
        .style("width", 40)



    var boxWidth = 100
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function(d){return(x(d[0])-boxWidth/2)})
        .attr("y", function(d){return(y(d[1].q3))})
        .attr("height", function(d){return(y(d[1].q1)-y(d[1].q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")


    // Show the median
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d[0])-boxWidth/2) })
        .attr("x2", function(d){return(x(d[0])+boxWidth/2) })
        .attr("y1", function(d){return(y(d[1].median))})
        .attr("y2", function(d){return(y(d[1].median))})
        .attr("stroke", "black")
        .style("width", 80)

    //adding titles
    svg.select("g")
        .append("text")
        .text(" Running time By Platform")
        .style("fill", "black")
        .attr("x", 250)
        .attr("y", -320);

    //adding x/y axis titles




}



// data process
function runtime(view){
    const data = []
    for (const movie of view){
        if (movie.netflix) data.push({platform: "netflix", runtime: movie.runtime})
        if (movie.hulu) data.push({platform: "hulu", runtime: movie.runtime})
        if (movie.disney) data.push({platform: "disney", runtime: movie.runtime})
        if (movie.prime) data.push({platform: "prime", runtime: movie.runtime})
    }

    //sort it so it goes in order (idk if its needed but the example CSVs I looked at had it sorted
    data.sort((a, b) => a.platform.localeCompare(b.platform))

    return data
}
