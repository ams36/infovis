/**
 * Functions here have been inspired from:
 * https://observablehq.com/@d3/stacked-to-grouped-bars
 * https://bl.ocks.org/SpaceActuary/6233700e7f443b719855a227f4749ee5
 * https://bl.ocks.org/lorenzopub/352ad2e6f577c4abf55e29e6d422535a
 * https://stackoverflow.com/questions/26694385/fade-in-on-scroll-down-fade-out-on-scroll-up-based-on-element-position-in-win
 */

// Setup the info pop up button
(() => {
    const title = 'Age Visualisation Description';
    const content = 'This bar chart allows users to visualise the age of the target audience for movies among the four platforms. <br/> <br/>' +
        'Five different colors represent five different age groups. The 6th colour represents the "Unknown" category, where this data was not listed.' +
        ' Users can interact with the bar by clicking the “stack” ' +
        'and “transform” buttons, which help users to see the age distribution across the four platforms in two different views'
    configureHelp('age-info-button', title, content);
})();

// brings the age legend to view when the person scrolls to the page its on
document.addEventListener('scroll', (e) => {
    // holds the position of the beginning of age page
    const position = document.getElementById('agePage').offsetTop;
    // holds the position of the end of age page
    const end = document.getElementById('worldPage').offsetTop;

    // if the position where the user is currently scrolled in -200px the top of the page and 200 px above the bottom,
    // make the legend visible and hide the platform legend
    if(window.scrollY >= position - 200 && window.scrollY <= end - 200){
        document.getElementById('age-legend').classList.add('shown');
        document.getElementById('platformLegend').classList.remove('shown');
    }else{
        // hide the age legend and make the platform legend visible
        document.getElementById('age-legend').classList.remove('shown');
        document.getElementById('platformLegend').classList.add('shown');
    }
})

/**
 * creates the bar charts for ages
 * @param view the filtered version of the data to be displayed
 */
window.renderBarChart = function (view) {

    // get the formatted age data, the groups, and the highest count
    const [yz, groups, max] = formatAgeData(view)

    // the list of the platforms in the order they should appear in the x axis
    const xz = ["netflix", "hulu", "disney", "prime"]

    // set the constants that should be used throughout the vis
    margin = ({top: 20, right: 0, bottom: 30, left: 50})
    width = 500
    height = 500
    const n = 6

    // transforms the data into the stacked bar chart format
    // grouped by the provided keys
    y01z = d3.stack()
        .keys(d3.range(6))
        (yz)
        .map((data, i) => {return data.map(([y0, y1]) => [y0, y1, i])})

    // get the maximum value
    y1Max = d3.max(y01z, y => d3.max(y, d => d[1]))
    yMax = d3.max(yz, y => d3.max(y))

    // sequential color theme chosen by chorma.js to ensure color-blind friendly
    const colorOrder = ['#453750', '#704B49', '#99613F', '#C17830', '#EA9010', '#8B94A3']

    // create the legend and add it to the content of the age-legend
    const legend = d3.select('#age-legend .content')
        .selectAll('.entry')
        .data(y01z)
        .enter()
        .append('div')
        .attr('class', 'entry');

    // adds the coloured squares to each entry of the legend
    legend.append('div')
        .attr('class', 'square')
        .style('background-color', (d, i) => colorOrder[i]);

    //adds the label to each entry of the legend
    legend.append('div')
        .attr('class', 'label')
        .text((d) => groups[d[0][2]].capitalise())


    // create the y axis scale
    y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([height - margin.bottom, margin.top])


    // create the x axis scale
    const x = d3.scaleBand()
        .domain(d3.range(xz.length))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.08)

    // updates the view of the bar charts to be one of the two options
    window.chart = (() => {
        // gets div and appends the svg to it
        const svg = d3.select("#ageBarPlots")
            .html("") // remove any content
            .append("svg") // add the svg
            .attr('width', '100%') // set the width
            .attr("viewBox", [0, 0, width, height]); // set the viewbox

        // create the rectangles
        const rect = svg.selectAll("g")
            .data(y01z)
            // adds a group for each age group
            .join("g")
            // set the colour
            .attr("fill", (d, i) => {return colorOrder[i]})

            // select all the rectangle elements within the group and encode the data
            // sets up the individual rectangles for each group horizontally
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", h => { return height - margin.bottom})
            .attr("width", x.bandwidth())
            .attr("height", 0)
            // tooltip functions
            .on("mousemove", function(t, d) {
                tooltip
                    .style("left", t.pageX + 20 + "px") // set the x coordinate (20 px to the right so its not covered by cursor)
                    .style("top", t.pageY+ "px") // se the y coordinate
                    .style("display", "inline-block")
                    .html(generateAgeTooltip(d)); // set the text
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            });

        /**
         * Generates the text for the tooltip
         * @param d the data to be visualised
         * @returns {string}
         */
        function generateAgeTooltip(d){
            // capitalise the entry
            let ageGroup = groups[d[2]].capitalise()
            // change all to All Ages to be gramatically correct
            if (ageGroup === "All") ageGroup = "All Ages"
            return `<b>Number of ${ageGroup} Movies:</b> ${d[1]}`
        }

        // set the x axis
        svg.append("g")
            .attr("transform", "translate(0," + (height-margin.bottom) + ")")
            .call(d3.axisBottom(x).tickFormat((d) => xz[d].capitalise()))
            .style("font-family", "\"Zilla Slab\", sans-serif")
            .style("font-size", "1em")

        // set the y axis
        const yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)


        /**
         * a function to move the rectangles from stacked to grouped
         * transforms the x, y, and width and animates its position change
         */
        function transitionGrouped() {
            y.domain([0, yMax]);

            rect.transition()
                .duration(500)
                .delay((d, i) => i * 20)
                .attr("x", (d, i) => x(i) + x.bandwidth() / n * d[2])
                .attr("width", x.bandwidth() / (n))
                .transition()
                .attr("y", d => y(d[1] - d[0]))
                .attr("height", d => y(0) - y(d[1] - d[0]));
            yAxis.call(d3.axisLeft(y)
                .tickFormat((d) => {
                    if (Number.isInteger(d)) return d // only show whole numbers
                    else return ""
                }))
                .style("font-family", "\"Zilla Slab\", sans-serif")
                .style("font-size", "1em")
        }

        /**
         * A function to move the ractangles from grouped to stacked
         * * transforms the x, y, and width and animates its position change
         */
        function transitionStacked() {
            y.domain([0, y1Max]);

            rect.transition()
                .duration(500)
                .delay((d, i) => i * 20)
                .attr("y", d => y(d[1]))
                .attr("height", d => { return y(d[0]) - y(d[1])})
                .transition()
                .attr("x", (d, i) => { return x(i)})
                .attr("width", x.bandwidth());
            yAxis.call(d3.axisLeft(y)
                .tickFormat((d) => {
                    if (Number.isInteger(d)) return d // only show whole numbers
                    else return ""
                }))
                .style("font-family", "\"Zilla Slab\", sans-serif")
                .style("font-size", "1em")
        }

        /**
         * calls the correct function to transition the graph
         * @param layout the layout to be changed to
         */
        function update(layout) {
            if (layout === "stacked") transitionStacked();
            else transitionGrouped();
        }

        return Object.assign(svg.node(), {update});
    })()

    // set the initial layout and set button functions to allow transition
    layout = "stacked"
    document.getElementById("stackedBarchart").onclick = () => chart.update("stacked")
    document.getElementById("groupedBarchart").onclick = () => chart.update("grouped")
    window.updateStack = chart.update(layout)

}

/**
 * creates an object to hold the information for that specific platform
 * @param ages the age groups as an array
 * @returns {[]} the object version to hold the data
 */
function createPlatformObject(ages){
    let platformObject = []
    for (let i = 0; i < ages.length; i++) {
        platformObject.push(0)
    }
    return platformObject
}

/**
 * gets the index of an age entry
 * @param ages the ages array
 * @param entry the entry to find
 * @returns {*} an index
 */
function getIndexofAge(ages, entry){
    return (ages.indexOf(entry))
}

/**
 * format the data in the way needed for the box chart
 * @param view the filtered version of the data
 * @returns {([*[], *[], *[], *[]]|string[]|number)[]} results object, age groups in order, the maximum count for any of the age groups / platform
 */
function formatAgeData(view){

    let groups =  ["all", "7+", "13+", "16+", "18+", "unknown"]

    /**
     * The results 2D array
     * @type {*[][]} Array of Platforms
     */
    let results = [
        createPlatformObject(groups),
        createPlatformObject(groups),
        createPlatformObject(groups),
        createPlatformObject(groups)
    ]

    // initial numbers for the total to get max count for th platform
    let netflixTotal = 0
    let huluTotal = 0
    let disneyTotal = 0
    let primeTotal = 0

    // loop through the data and add age entries to the arrays
    for (const movie of view){
        let movieAge = movie.age
        // replace null with unknown
        if (movieAge === "") movieAge= "unknown"
        const index = getIndexofAge(groups, movieAge)
        if (movie.netflix) netflixTotal=addAgeEntry(results[0], index, netflixTotal)//results[0][movieAge]++
        if (movie.hulu) huluTotal = addAgeEntry(results[1], index, huluTotal)
        if (movie.disney) disneyTotal = addAgeEntry(results[2], index, disneyTotal)
        if (movie.prime) primeTotal = addAgeEntry(results[3], index, primeTotal)
    }

    /**
     * max count of any of the platforms
     * @type {number} the max
     */
    const max = Math.max(netflixTotal, huluTotal, disneyTotal, primeTotal)

    return [results, groups, max]
}

/**
 * adds an age entry to the array
 * @param result the result to add
 * @param index the index where it should add it to
 * @param platform the platform count to increase
 * @returns {*} the increased count of platform
 */
function addAgeEntry(result, index, platform){
    result[index]++
    return (platform+1)
}