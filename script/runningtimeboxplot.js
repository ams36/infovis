
// modified from: https://www.d3-graph-gallery.com/graph/boxplot_several_groups.html
// particularly: changed the nest function to the updated group function to make it work properly
// keys no longer accessed, it is d[0] instead of d.key and d[1] instead of d.value



window.renderRuntimeBoxplot = function (view) {

    let [runtime_data, low, high] = runtime(view)

    const platformMinMax = {
        netflix: [0,10],
        hulu: [0,10],
        prime: [0,10],
        disney: [0,10],
    }

    // set the dimensions and margins of the graph
    var margin = {top: 90, right: 60, bottom: 90, left: 60},
        width = 460 ,
        height = 300 ;

    // append the svg object to the body of the page
    var svg = d3.select("#runtimeBoxplot")
        .html("")
        .append("svg")
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", [0, 0, width + margin.left + margin.right,  height + margin.top + margin.bottom])
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
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
        platformMinMax[d[0].platform] = [min,max]
        low = Math.min(low, min)
        high = Math.max(high, max)

        return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    }, (k) => {
        return k.platform
    })

    console.log(low, high)

    // Show the X scale
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["netflix", "hulu", "disney", "prime"])
        .paddingInner(1)
        .paddingOuter(.5)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat((d) => d.capitalise())
        )

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([low - 10 ,high + 10]) // added to give them a bit of space
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
        .attr("stroke", "white")
        .attr("opacity", 0.5)
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
        .attr("stroke", "white")
        .attr("stroke-opacity", .5)
        .style("fill", function(d){return colorMap[d[0]]})
        .on("mousemove", createRuntimeTooltip)
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });

    function createRuntimeTooltip(t, d) {  // the datum you want
        tooltip
            .style("left", t.pageX + 20 + "px")
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            .html(generateRuntimeTooltipText(d));
    }

    function generateRuntimeTooltipText(d){
        return `Runtime Average For ${d[0].capitalise()}: <br>
        <b>Median </b>${d[1].median} <br>
        <b>Min </b>${platformMinMax[d[0]][0]} <br>
        <b>Max </b>${platformMinMax[d[0]][1]} <br>
        <b>IQR </b>${d[1].interQuantileRange}`
    }


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
        .attr("stroke", "white")
        .attr("opacity", 0.5)
        .style("width", 80)
        .on("mousemove", createRuntimeTooltip)
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });


    //adding titles
    svg.select("g")
        .append("text")
        .text(" Running time By Platform")
        .style("font-family", "'Zilla Slab Highlight', sans-serif")
        .style("fill", "white")
        .style("font-weight", "bold")
        .attr("font-size", "2em")
        .attr("x", 250)
        .attr("y", -320);


    //adding x/y axis titles

    // only show outliers
    //Add individual points with jitter
    var jitterWidth = 50
    const runtimeOutliers = getRuntimeOutliers(runtime_data, platformMinMax)
    let countHigh = Math.max(...runtimeOutliers.map((row) => row.count))
    let countLow = Math.min(...runtimeOutliers.map((row) => row.count))

    console.log(runtimeOutliers)
    svg
        .selectAll("indPoints")
        .data(runtimeOutliers)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return(x(d.platform) - jitterWidth/2 + Math.random()*jitterWidth)})
        .attr("cy", function(d){
            if (y(d.runtime) === undefined) console.log(d)
            return( y(d.runtime)  )})
        .attr("r", (d) => radius(d.count))
        .style("fill", function(d){ return colorMap[d.platform] })
        .attr("opacity", 0.3)
        .attr("stroke", "white")
        .on("mousemove", createRuntimeOutlierTooltip)
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });

    function createRuntimeOutlierTooltip(t, d) {  // the datum you want
        tooltip
            .style("left", t.pageX + 20 + "px")
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            .html(generateRuntimeOutlierTooltipText(t, d));
    }

    function generateRuntimeOutlierTooltipText(t, d){
        return `Outlier for Platform: ${d.platform.capitalise()}: <br>
        <b>Runtime: </b>${d.runtime} <br>
        <b>Number of Movies: </b>${d.count} <br>`
    }

    function radius(x){
        if (x === undefined) return 0
        const minCircleSize = 1
        const maxCircleSize = 10
        //arduino map from: https://www.arduino.cc/reference/en/language/functions/math/map/
        let size = (x - countLow) * (maxCircleSize - minCircleSize) / (countHigh - countLow) + minCircleSize;
        if (size === 0) return 3
        else return size
    }

}

function getRuntimeOutliers(runtime_data, platformMinMax){
    console.log("here")
    let allOutliers = runtime_data.filter((d) => (d.runtime < platformMinMax[d.platform][0] || d.runtime > platformMinMax[d.platform][1]))
    let buildingOutliers = {
        disney: {},
        prime: {},
        hulu: {},
        netflix: {}
    }
    for (const length of allOutliers){
        const key = length.platform + "_" + length.runtime
        if (buildingOutliers[length.platform][key]) buildingOutliers[length.platform][key].count++
        else {
            buildingOutliers[length.platform][key] = {
                platform: length.platform,
                runtime: length.runtime,
                count: 1
            }
        }
    }
    buildingOutliers = {...buildingOutliers["disney"], ...buildingOutliers["hulu"], ...buildingOutliers["prime"], ...buildingOutliers["netflix"]}
    return Object.values(buildingOutliers)
}





// data process
function runtime(view){
    const data = []

    //used to calculate domain range for y
    let low = Number.MAX_SAFE_INTEGER
    let high = Number.MIN_SAFE_INTEGER

    for (const movie of view){
        if (isNaN(movie.runtime)) continue
        if (movie.runtime > high) high = movie.runtime
        if (movie.runtime < low) low = movie.runtime
        if (movie.netflix) data.push({platform: "netflix", runtime: movie.runtime})
        if (movie.hulu) data.push({platform: "hulu", runtime: movie.runtime})
        if (movie.disney) data.push({platform: "disney", runtime: movie.runtime})
        if (movie.prime) data.push({platform: "prime", runtime: movie.runtime})
    }

    //sort it so it goes in order (idk if its needed but the example CSVs I looked at had it sorted
    data.sort((a, b) => a.platform.localeCompare(b.platform))

    return [data, low, high]
}
