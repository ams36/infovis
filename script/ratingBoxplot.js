
// modified from: https://www.d3-graph-gallery.com/graph/boxplot_several_groups.html
// particularly: changed the nest function to the updated group function to make it work properly
// keys no longer accessed, it is d[0] instead of d.key and d[1] instead of d.value


// what's new: add the distribution of scatter plots on the box
// hover still need to be fixed as follow:
// Todo: 1, the info does not show complete (marked)
// Todo: 2, the postion of the infomation frame (should not be at below) (unmarked)
// Todo: 3, the logitic of mouse out / move and over (marked)


window.renderRatingBoxplot = function (view) {

    const ratings = formatData(view)

    // set the dimensions and margins of the graph
    var margin = {top: 90, right: 60, bottom: 90, left: 60},
        width = 460 ,
        height = 300 ;

    // append the svg object to the body of the page
    var svg = d3.select("#ratingBoxplot")
        .html("")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", [0, 0, width + margin.left + margin.right,  height + margin.top + margin.bottom])
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // set the parameter for box
    const sumstat = d3.rollup(ratings, (d) => {
        q1 = d3.quantile(d.map(function(g) { return g.imdb;}).sort(d3.ascending),.25)
        median = d3.quantile(d.map(function(g) { return g.imdb;}).sort(d3.ascending),.5)
        q3 = d3.quantile(d.map(function(g) { return g.imdb;}).sort(d3.ascending),.75)
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
        .domain([0,10])
        .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))


    //  NEW: color scale
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
       // .domain([4,8])


    //NEW: Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 30)
        .text(" x_label");


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

    // rectangle for the main box
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
            .text(" Ratings By Platform")
            .style("fill", "black")
            .attr("x", 250)
            .attr("y", -320);

    // create a tooltip
    var tooltip = d3.select("#ratingBoxplot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "16px")

    // Three function that change the tooltip when user hover / move / leave a cell
    //Todo: 1, the info does not show complete
    //Todo: 3, the logitic of mouse out / move and over
    var mouseover = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 1)
        tooltip
            .html("<span style='color:grey'>imbd_score: </span>" + d.imdb)  //todo:1
            .style("left", (d3.pointer(d,this)[0]+30) + "px")
            .style("top", (d3.pointer(d,this)[1]+30) + "px")
    }


    var mousemove = function(d) {
        tooltip
            .style("left", (d3.pointer(d,this)[0]+30) + "px") //
            .style("top", (d3.pointer(d,this)[1]+30) + "px")
    }
    var mouseleave = function(d) {
        tooltip
           .transition()
           .duration(200)
           .style("opacity", 0)
    }





    //NEW: Add individual points with jitter
    var jitterWidth = 50
    svg
        .selectAll("indPoints")
        .data(ratings)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return(x(d.platform) - jitterWidth/2 + Math.random()*jitterWidth)})
        .attr("cy", function(d){ return( y(d.imdb)  )})
        .attr("r", 3) //
        .style("fill", function(d){ return(myColor(+d.imdb)) })
        .attr("stroke", "black")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


}




// data process
function formatData(view){
    const data = []
    for (const movie of view){
        if (movie.netflix) data.push({platform: "netflix", imdb: movie.imdb})
        if (movie.hulu) data.push({platform: "hulu", imdb: movie.imdb})
        if (movie.disney) data.push({platform: "disney", imdb: movie.imdb})
        if (movie.prime) data.push({platform: "prime", imdb: movie.imdb})
    }

    //sort it so it goes in order (idk if its needed but the example CSVs I looked at had it sorted
    data.sort((a, b) => a.platform.localeCompare(b.platform))
    return data
}
