// Setup the info pop up button
(() => {
    const title = 'Runtime by Platform';
    const content = 'These Box Plots allow users to visualise the running times of movies across four platforms. ' +
        'Any outliers are visualised as well, and the size of the circle represents the number of movies with that runtime.' +
        '<br/> If you are someone who prefers shorter (or longer) movies, this visualisation can help you choose the platform ' +
        'best suited for your attention span.'
    configureHelp('runtime-info-button', title, content);
})();

// modified from: https://www.d3-graph-gallery.com/graph/boxplot_several_groups.html
// particularly: changed the nest function to the updated group function to make it work properly
// keys no longer accessed, it is d[0] instead of d.key and d[1] instead of d.value


/**
 * Creates the runtime boxplots
 * @param view the filtered version of the data
 */
window.renderRuntimeBoxplot = function (view) {

    // format the data in the way needed for the vis
    let [runtime_data, low, high] = runtime(view)

    // hold the platform min and max to later calculate outliers
    const platformMinMax = {
        netflix: [0,10],
        hulu: [0,10],
        prime: [0,10],
        disney: [0,10],
    }

    // set the dimensions and margins of the graph
    var margin = {top: 0, right: 30, bottom: 10, left: 60},
        width = 460 ,
        height = 460 ;

    // append the svg object to the body of the page
    var svg = d3.select("#runtimeBoxplot")
        .html("") // remove anything already there
        .append("svg") // append the svg
        .attr("preserveAspectRatio", "xMidYMid meet") // keep aspect ratio the same when resizing
        .attr("viewBox", [0, 0, width + margin.left + margin.right,  height + margin.top + margin.bottom])
        .append("g")  // add a group to hold the vis
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // set the parameter for box
    const sumstat = d3.rollup(runtime_data, (d) => {
        q1 = d3.quantile(d.map(function(g) { return g.runtime;}).sort(d3.ascending),.25)
        median = d3.quantile(d.map(function(g) { return g.runtime;}).sort(d3.ascending),.5)
        q3 = d3.quantile(d.map(function(g) { return g.runtime;}).sort(d3.ascending),.75)
        interQuantileRange = q3 - q1
        min = Math.max(0, q1 - 1.5 * interQuantileRange);
        max = q3 + 1.5 * interQuantileRange
        platformMinMax[d[0].platform] = [min,max] // update the platfrom min and max for the outlier calculation
        low = Math.min(low, min) // get the lowest low for the y axis
        high = Math.max(high, max) // get the highest high for the y axis
        return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    }, (k) => {
        return k.platform
    })

    // X axis
    var x = d3.scaleBand() // set the range
        .range([ 0, width ])
        .domain(["netflix", "hulu", "disney", "prime"]) // set the order for the domain
        .paddingInner(1)
        .paddingOuter(.5)
    svg.append("g")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisTop(x)
            .tickFormat((d) => d.capitalise()) // set the axis text
        ).style("font-family", "\"Zilla Slab\", sans-serif")
        .style("font-size", "1em")

    // Show the Y scale
    var y = d3.scaleLinear() // Y axis
        .domain([Math.max(0, low - 10) ,high + 10]) // added to give them a bit of space
        .range([height, 0])
    svg.append("g").call(d3.axisLeft(y)) // set the y text
        .style("font-family", "\"Zilla Slab\", sans-serif")
        .style("font-size", "1em")

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
        .attr("opacity", 0.5)
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
        .style("fill", function(d){return colorMap[d[0]]}) // set the colour
        // add the tooltip
        .on("mousemove", createRuntimeTooltip)
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });

    /**
     * creates the runtime tooltip
     * @param t transformation
     * @param d the data to show
     */
    function createRuntimeTooltip(t, d) {
        tooltip
            .style("left", t.pageX + 20 + "px") // set the position
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            .html(generateRuntimeTooltipText(d)); // set the text
    }

    function generateRuntimeTooltipText(d){
        // returns the tooltip in the format:
        // Movie Rating Average for [Platform]
        // list of averages ...
        return `<b>Runtime Average For ${d[0].capitalise()}: </b> <br>
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
        .attr("stroke", "black")
        .style("width", 80)
        .on("mousemove", createRuntimeTooltip) // set the tooltip
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });


    // only show outliers
    //Add individual points with jitter
    var jitterWidth = 50
    // format the outlier data
    const runtimeOutliers = getRuntimeOutliers(runtime_data, platformMinMax)
    // get max and min for the radius function
    let countHigh = Math.max(...runtimeOutliers.map((row) => row.count))
    let countLow = Math.min(...runtimeOutliers.map((row) => row.count))

    // add the points
    svg
        .selectAll("indPoints")
        .data(runtimeOutliers)
        .enter()
        .append("circle")
        // x position based on jitter
        .attr("cx", function(d){ return(x(d.platform) - jitterWidth/2 + Math.random()*jitterWidth)})
        .attr("cy", function(d){return( y(d.runtime))})
        .attr("r", (d) => radius(d.count)) // get the radius size
        .style("fill", function(d){ return colorMap[d.platform] })
        .attr("opacity", 0.3) // set the style
        .attr("stroke", "darkslategray")
        .on("mousemove", createRuntimeOutlierTooltip) // set the tooltip
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });

    /**
     * Create the tooltip
     * @param t transform
     * @param d the data to show
     */
    function createRuntimeOutlierTooltip(t, d) {  // the datum you want
        tooltip
            .style("left", t.pageX + 20 + "px") // set the tooltip position
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            .html(generateRuntimeOutlierTooltipText(t, d)); // set the tooltip text
    }

    /**
     * Generates the text for the tooltip
     * @param d the data to be shown
     * @returns {string} the text for the tooltip
     */
    function generateRuntimeOutlierTooltipText(t, d){
        // Format: Outlier for Platform: [Platform]
        // Runtime: [Runtime]
        // Number of Movies: [Count]
        return `Outlier for Platform: ${d.platform.capitalise()}: <br>
        <b>Runtime: </b>${d.runtime} <br>
        <b>Number of Movies: </b>${d.count} <br>`
    }

    /**
     * Calculates the size of the outlier circle based on arduino map
     * @param x the count of movies
     * @returns {number} the radius size
     */
    function radius(x){
        if (x === undefined) return 0 // if there is no runtime, dont show
        if (isNaN(x)) return 0
        // circles can range between r 1 and r 10
        const minCircleSize = 1
        const maxCircleSize = 10
        //arduino map from: https://www.arduino.cc/reference/en/language/functions/math/map/
        let size = (x - countLow) * (maxCircleSize - minCircleSize) / (countHigh - countLow) + minCircleSize;
        if (size === 0  || isNaN(size)) return 3 // if there is only one outlier movies, make the size 3 so its big enough to easily see but not large
        else return size
    }

}

/**
 * Get the runtime outliers formatted
 * @param runtime_data the data to be formatted
 * @param platformMinMax that platform array of min and maxes
 * @returns {unknown[]}  an array of the outliers
 */
function getRuntimeOutliers(runtime_data, platformMinMax){
    // get the outliers by filtering out anything with a runtime greater than or less than the IQR
    let allOutliers = runtime_data.filter((d) => (d.runtime < platformMinMax[d.platform][0] || d.runtime > platformMinMax[d.platform][1]))
    let buildingOutliers = {
        disney: {},
        prime: {},
        hulu: {},
        netflix: {}
    }
    // loop through the outliers and store the counts of any outliers with the same value
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
    // format the object into a single object
    buildingOutliers = {...buildingOutliers["disney"], ...buildingOutliers["hulu"], ...buildingOutliers["prime"], ...buildingOutliers["netflix"]}
    return Object.values(buildingOutliers)
}


/**
 * Format the runtime data
 * @param view the filtered view
 * @returns {([]|number)[]} The Formatted Data
 */
function runtime(view){
    const data = []

    //used to calculate domain range for y
    let low = Number.MAX_SAFE_INTEGER
    let high = Number.MIN_SAFE_INTEGER

    // loop through the movies and push any movies with that platform to the array
    for (const movie of view){
        if (isNaN(movie.runtime)) continue
        if (movie.runtime > high) high = movie.runtime
        if (movie.runtime < low) low = movie.runtime
        if (movie.netflix) data.push({platform: "netflix", runtime: movie.runtime})
        if (movie.hulu) data.push({platform: "hulu", runtime: movie.runtime})
        if (movie.disney) data.push({platform: "disney", runtime: movie.runtime})
        if (movie.prime) data.push({platform: "prime", runtime: movie.runtime})
    }

    //sort it so it goes in order
    data.sort((a, b) => a.platform.localeCompare(b.platform))

    return [data, low, high]
}
