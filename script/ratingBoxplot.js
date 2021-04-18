// Setup the info pop up button
(() => {
    const title = 'Ratings by Platform';
    const content = 'These Box Plots allow users to visualise IMDB scores for movies across four platforms. <br/><br/>' +
        'By comparing the median, maximum and minimum value of IMDB of movies on the four platforms, users can have a general' +
        ' understanding of the quality of movies on the four platforms. Any outliers are visualised as well, and the size of the circle' +
        ' represents the number of movies with that IMDb Score.'
    configureHelp('rating-info-button', title, content);
})();

// modified from: https://www.d3-graph-gallery.com/graph/boxplot_several_groups.html
// particularly: changed the nest function to the updated group function to make it work properly
// keys no longer accessed, it is d[0] instead of d.key and d[1] instead of d.value

window.renderRatingBoxplot = function (view) {

    const ratings = formatData(view)

    // set the dimensions and margins of the graph
    var margin = {top: 0, right: 30, bottom: 10, left: 60},
        width = 460 ,
        height = 460 ;

    const platformMinMax = {
        netflix: [0,10],
        hulu: [0,10],
        prime: [0,10],
        disney: [0,10],
    }

    // append the svg object to the body of the page
    var svg = d3.select("#ratingBoxplot")
        .html("")
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", [0, 0, width + margin.left + margin.right,  height + margin.top + margin.bottom])
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
        platformMinMax[d[0].platform] = [min,max]


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
        .call(d3.axisBottom(x)
            .tickFormat((d) => d.capitalise())
        ).style("font-family", "\"Zilla Slab\", sans-serif")
        .style("font-size", "1em")

    // Show the Y scale
    var y = d3.scaleLinear()
        .domain([0,10])
        .range([height, 0])
    svg.append("g").call(d3.axisLeft(y))
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
        .style("fill", function(d){return colorMap[d[0]]})
        .on("mousemove", createRatingTooltip)
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });

    function createRatingTooltip(t, d) {  // the datum you want
        tooltip
            .style("left", t.pageX + 20 + "px")
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            .html(generateRatingTooltipText(d));
    }

    function generateRatingTooltipText(d){
        // have to multiply by 100 and then divide by 100 to get 2 decimal places
        return `Movie Rating Average For ${d[0].capitalise()}: <br>
        <b>Median </b>${Math.round(d[1].median * 100) / 100} <br> 
        <b>Min </b>${Math.round(platformMinMax[d[0]][0] * 100) / 100} <br>
        <b>Max </b>${Math.round(platformMinMax[d[0]][1] * 100) / 100} <br>
        <b>IQR </b>${Math.round(d[1].interQuantileRange * 100) / 100 }`
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
        .on("mousemove", createRatingTooltip)
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });

    // only show outliers
    const outliers = getRatingOutliers(ratings, platformMinMax)
    var jitterWidth = 50
    let countHigh = Math.max(...outliers.map((row) => row.count))
    let countLow = Math.min(...outliers.map((row) => row.count))

    svg
        .selectAll("indPoints")
        .data(outliers)
        .enter()
        .append("circle")
        .attr("cx", function(d){ return(x(d.platform) - jitterWidth/2 + Math.random()*jitterWidth)})
        .attr("cy", function(d){
            if (y(d.imdb) === undefined) console.log(d)
            return( y(d.imdb)  )})
        .attr("r", (d) => radius(d.count))
        .style("fill", function(d){ return colorMap[d.platform]})
        .attr("opacity", 0.3)
        .attr("stroke", "darkslategray")
        .on("mousemove", createRatingOutlierTooltip)
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        });

    function createRatingOutlierTooltip(t, d) {  // the datum you want
        tooltip
            .style("left", t.pageX + 20 + "px")
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            .html(generateRatingOutlierTooltipText(t, d));
    }

    function generateRatingOutlierTooltipText(t, d){
        return `Outlier for Platform: ${d.platform.capitalise()}: <br>
        <b>IMDb Rating: </b>${d.imdb} <br>
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




// data process
function formatData(view){
    const data = []
    for (const movie of view){
        if (isNaN(movie.imdb)) continue
        if (movie.netflix) data.push({platform: "netflix", imdb: movie.imdb})
        if (movie.hulu) data.push({platform: "hulu", imdb: movie.imdb})
        if (movie.disney) data.push({platform: "disney", imdb: movie.imdb})
        if (movie.prime) data.push({platform: "prime", imdb: movie.imdb})
    }

    //sort it so it goes in order (idk if its needed but the example CSVs I looked at had it sorted
    data.sort((a, b) => a.platform.localeCompare(b.platform))
    return data
}

function getRatingOutliers(rating_data, platformMinMax){
    console.log("here")
    let allOutliers = rating_data.filter((d) => (d.imdb < platformMinMax[d.platform][0] || d.imdb > platformMinMax[d.platform][1]))
    let buildingOutliers = {
        disney: {},
        prime: {},
        hulu: {},
        netflix: {}
    }
    for (const length of allOutliers){
        const key = length.platform + "_" + length.imdb
        if (buildingOutliers[length.platform][key]) buildingOutliers[length.platform][key].count++
        else {
            buildingOutliers[length.platform][key] = {
                platform: length.platform,
                imdb: length.imdb,
                count: 1
            }
        }
    }
    buildingOutliers = {...buildingOutliers["disney"], ...buildingOutliers["hulu"], ...buildingOutliers["prime"], ...buildingOutliers["netflix"]}
    console.log(rating_data)
    console.log(platformMinMax)
    console.log(buildingOutliers)
    return Object.values(buildingOutliers)
}
