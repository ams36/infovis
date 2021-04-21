/**
 *  * This script has been primarily modified from the following sources:
 *  ******** Donut Charts, Pie Charts and Circle Graphs ***********
 * https://bl.ocks.org/jsl6906/6560687444d2e1421e4d24360c27728a
 * https://www.d3-graph-gallery.com/graph/donut_basic.html
 * https://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js
 * ******** Functionality and Zooming *********
 * https://observablehq.com/@d3/zoom-with-tooltip?collection=@d3/d3-zoom
 *
 */

// Setup the info pop up button
(() => {
    const title = 'Genres';
    const content = 'This circle packed donut chart allows users to visualise movie genre distribution among four platforms. <br/> <br/>' +
        'Each donut chart presents a genre, and the larger it is, the higher the number of movies. ' +
        'The color attribute is consistent with the platform it represents. Hover over the arcs for more information or zoom in to get a better look!' +
        ' This gives users a clear idea of the distribution of the movie genres they are interested in across the four platforms.'
    configureHelp('genre-info-button', title, content);
})();

/**
 * creates genre donut charts.
 * @param view the filtered version of the data to view
 */
window.renderGenreCharts = function (view) {

    // format the genre data in a way thats needed for this visualisation
    let genres = formatGenres(view)
    // diameter used for width and height of the SVG as well as calculating circle information
    const diameter = 1000

    // the following functions prepare the data in a hierarchical way based on the sum of the children nodes
    // in order to later circle pack it based on total count of movies in that genre
    const bubble = d3.pack()
        .size([diameter, diameter])
        .padding(20);
    const root = d3.hierarchy({children: genres})
        .sum(function(d) { return d.children ? 0 : (d.netflix + d.hulu+ d.prime +  d.disney); });
    const arc = d3.arc().innerRadius((d) => { return d.r * 0.5});
    const pie = d3.pie().value((d) => d[1]);

    // execute the circle pack
    var nodeData = bubble(root).children;

    // grab the div to append where the visualisation should go
    var svg = d3.select("#genreDiagram")
        .html("")   //remove any vis that's already in it (in case this was called on a update function
        .append("svg")  //add the svg to the div
        .attr("preserveAspectRatio", "xMidYMid meet")   // used to preserve aspect ratio when resizing
        .attr("viewBox", [0, 0, diameter, diameter])    // used to preserve aspect ratio  when resizing
        .attr("class", "bubble");   // set the class

    // added to hold all nodes in order to create a zoom function
    const everything = svg.append("g")

    // adds all nodes to everything to allow zooming
    var nodes = everything.selectAll("g.node")
        .data(nodeData);

    // creates a group for every node and sets its initial position
    var nodeEnter = nodes.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    // creates a group of arcs for the genre node (the circle / donut)
    var arcGs = nodeEnter.selectAll("g.arc")
        .data(function(d) {
            return pie(Object.entries(d.data)
                .slice(1))
                .map(function(m) {
                    m.r = d.r;
                    m.p = d.data.platform;
                    m.genre = d.data.genre;
                    return m;
                });
        });

    // adds the arcs to the genre group (the individual platforms)
    var arcEnter = arcGs
        .enter()
        .append("g")
        .attr("class", "arc");

    // creates the path for the arc at the size needed
    arcEnter.append("path")
        .attr("d", function(d) {
            arc.outerRadius(d.r)
            return arc(d)
        })
        // creates a tooltip for the arc
        .on("mousemove", createGenreTooltip)
        // removes the tooltip from the arc
        .on("mouseleave", () => {
                tooltip.style("display", "none")
        })
        // sets the style to the colour of the platform
        .style("fill", function(d, i) { return colorMap[d.data[0]]; });

    /**
     * Function to create the genre tooltip
     * @param t the transform event that occurred to get the x and y locations of the mouse
     * @param d the data to be visualised
     */
    function createGenreTooltip(t, d) {
        tooltip
            // set the location of the tooltip to 20 px to the right so it isnt covered by the cursor
            .style("left", t.pageX + 20 + "px")
            .style("top", t.pageY+ "px")
            .style("display", "inline-block")
            // set the text for the tooltip
            .html(generateGenreTooltipText(d));
    }

    /**
     * generate the text for the tooltip
     * @param d the data to be placed
     * @returns {string} the text to be shown
     */
    function generateGenreTooltipText(d){
        // returns in the format: Count of [Genre] Movies on [Platform]: [Count]
        return `<b>Count of ${d.genre} Movies on ${d.data[0].capitalise()}:</b> ${d.data[1]}`
    }

    /**
     * Set the Genre labels for the centre of the Donut
     */
    var labels = nodeEnter.selectAll("text.label")
        .data(function(d) { return [d]; });
    labels.enter()
        .append("text") // add text element
        .attr('class', 'label') // set class
        .attr('dy', '0.35em') // y offset
        .style("text-anchor", "middle") // anchor in the centre of the circle
        .style('fill', 'white') // text colour should be white
        // set the size to be dynamic to ~the size in the centre (a few go over, but they do not overlap beyond the circle)
        .style('font-size',  (d) => (d.r*0.015) + 'em')
        .text((d) => d.data.genre); // set the text to the genre

    // zoom modified from: https://observablehq.com/@d3/zoom-with-tooltip
    // and: https://bl.ocks.org/saifulazfar/f2da589a3abbe639fee0996198ace301
    const zoom = d3.zoom()
        .extent([[0, 0], [diameter, diameter]])
        .scaleExtent([1, 40])  // the amount you are able to zoom
        .on("zoom", zoomed) // on zoom, call zoomed
    svg.call(zoom);

    //set up the initial zoom
    svg.call(zoom.transform, d3.zoomIdentity.translate(-19.093543668575762, 25.76101059564803).scale(1.0564771967121946))

    // after testing, identified these values to use as starting transformation point
   // {k: 1.0564771967121946, x: -19.093543668575762, y: 25.76101059564803}

    /**
     * Transforms the visual when it is zoomed
     * @param transform transform information
     */
    function zoomed({transform}) {
        everything.attr("transform", transform);
    }

}

/**
 * Format the data as needed for the donut charts
 * @param view the filtered version of the data as neeeded for the donut chart
 * @returns {unknown[]} // the values of the results (without the keys)
 */
function formatGenres(view){

    // get a list of the genres shown in the view
    const viewGenres = view
        .map((row) => row.genres)
        .flat()
        .filter((e, i, arr) => arr.indexOf(e) === i && e !== "")

    // object to store the results in
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

    // count the number of times that genre appeared
    for (const movie of view){
       for (const g of movie.genres){
            if (movie.netflix) results[g].netflix++
            if (movie.hulu) results[g].hulu++
            if (movie.disney) results[g].disney++
            if (movie.prime) results[g].prime++
        }
    }

    // get a list of currently selected genres so we dont show ones that share the genre (e.g. dont show fantasy
    // if only action is selected because some movies have both genres)
    const instance = M.FormSelect.getInstance(document.getElementById("genreSelector"));
    let selected = instance.getSelectedValues()
    if (selected.length === 0){
        selected = getGenres()
    }

    return selected.map((x) => results[x]).filter((d) => d !== undefined)




    // // return the results
    // return Object.values(results)
}
