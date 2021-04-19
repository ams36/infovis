// Setup the info pop up button
(() => {
    const title = 'Languages';
    const content = 'This lollipop diagram helps users understand the distribution of languages among the four platforms.' +
        '<br/>The color represents the platform, the X-axis represents the number of movies, and the Y-axis represents a language.' +
        '<br/>By observing the distribution of the four color points horizontally, the user can easily recognise which platform has' +
        ' the most movies in the languages they know. ' +
        '<br/><br/>Click the Page left and page right buttons to scroll through the results.'
    configureHelp('language-info-button', title, content);
})();

// Modified From: https://www.d3-graph-gallery.com/graph/lollipop_cleveland.html

/**
 * creates the lollipop diagrams for the visualisation.
 * @param view the filtered version of the data
 */
window.renderLanguages = function (view) {

    // reset the page buttons
    document.getElementById("languagePageButtons").innerText = ""

    // sets current page to 0, shows 20 points on a page
    // this is dont to not overwhelm the page iwth too much information
    let currentPage = 0
    const points = 20

    // format the data
    const languages = formatLanguageData(view)

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 40, left: 85},
        width = 950 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    /**
     * creates the visualisation
     */
    function makeSVG() {
        // gets languages and data that should be shown on the current page
        languageCount = languages.slice(points * currentPage, (currentPage +1) * points)
        // append the svg object to the body of the page
        var svg = d3.select("#languageComparison")
            .html("")
            .append("svg")
            // scale properly when resized
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // get the maximum value in array
        let max = languageCount
            .map((d) => Math.max(d.netflix, d.prime, d.hulu, d.disney))
            .reduce((a, b) => Math.max(a, b), 0)

        if (max === 0) max = 1 //make max one so the 0 points are at the far left instead of the centre

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, max])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .tickFormat((d) => {
                if (Number.isInteger(d)) return d // only show whole numbers
                else return ""
            }))
            .style("font-family", "\"Zilla Slab\", sans-serif")
            .style("font-size", "1em");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height]) // set the range
            .domain(languageCount.map(function (d) {
                return d.language;
            }))
            .padding(1);
            svg.append("g") //add the group for the text
            .call(d3.axisLeft(y)) // set the location
            .style("font-family", "\"Zilla Slab\", sans-serif") // set the font style
            .style("font-size", ".8em") // set the font size

        // Add the Lines
        svg.selectAll("myline")
            .data(languageCount)
            .enter()
            .append("line")
            .attr("x1", function (d) {
                // the maximum x value between the platforms
                return x(Math.min(d.netflix, d.prime, d.hulu, d.disney));
            })
            .attr("x2", function (d) {
                // the maximum x value between the platforms
                return x(Math.max(d.netflix, d.prime, d.hulu, d.disney));
            })
            // gets the y location for the language
            .attr("y1", function (d) {
                return y(d.language);
            })
            .attr("y2", function (d) {
                return y(d.language);
            })
            // set the stroke and style
            .attr("stroke", "white")
            .attr("stroke-width", "1px")

        // Circles for Netflix
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle") // add the circle
            // add the tooltips
            .on("mousemove", function (t, d) {
                createLanguageTooltip(t,d, "netflix")
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            // set the circle x position
            .attr("cx", function (d) {
                return x(d.netflix);
            })
            // set the circle y position
            .attr("cy", function (d) {
                return y(d.language);
            })
            // set the circle radius
            .attr("r", "6")
            // set the circle colour
            .style("fill", colorMap["netflix"])


        // Circles for Hulu
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle") // add the circle
            // tooltip functions
            .on("mousemove", function (t, d) {
                createLanguageTooltip(t,d, "hulu")
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            // set the x position
            .attr("cx", function (d) {
                return x(d.hulu);
            })
            // set the y position
            .attr("cy", function (d) {
                return y(d.language);
            })
            // set the radius
            .attr("r", "6")
            // set the colour
            .style("fill", colorMap["hulu"])

        // Circles for Prime
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle") // add the circle
            // add tooltips
            .on("mousemove", function (t, d) {
                createLanguageTooltip(t,d, "prime")
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            // set the circles x position
            .attr("cx", function (d) {
                return x(d.prime);
            })
            // set the circles y position
            .attr("cy", function (d) {
                return y(d.language);
            })
            // set the circles radius
            .attr("r", "6")
            // set the colour of the circle
            .style("fill", colorMap["prime"])


        // Circles for Disney
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle") // add the circles
            // set the tooltip functions
            .on("mousemove", function (t, d) {
                createLanguageTooltip(t, d, "disney")
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            // set the circles x position
            .attr("cx", function (d) {
                return x(d.disney);
            })
            // set the circles y position
            .attr("cy", function (d) {
                return y(d.language);
            })
            // set the radius
            .attr("r", "6")
            // set the colour of the circle
            .style("fill", colorMap["disney"]);

        /**
         * Creates the tooltips for the platform circles
         * @param t the transformation
         * @param d the data to be displayed
         * @param platform the platform it came from (string)
         */
        function createLanguageTooltip(t,d, platform) {
            tooltip
                .style("left", t.pageX + 20 + "px") // set the x location 20 px to the right so it is not covered by the cursor
                .style("top", t.pageY+ "px") // set the y position
                .style("display", "inline-block")
                .html(generateLanguageTooltipText(d, platform)); // set the text for the tooltip
        }

        /**
         * creates the text for the tooltip
         * @param d the data to be displayed
         * @param platform the name fo the platform
         * @returns {string} The string to be displayed
         */
        function generateLanguageTooltipText(d, platform){
            // array to hold the results from the other platforms
            let otherPlatforms = []

            // loop through the data and if the entry isnt language, the name of the platform thats being hovered on, or the total
            // then save it to the array
            for (const [key, value] of Object.entries(d)){
                if (platform !== key && key !== "language" && key !== "total"){
                    otherPlatforms.push([key, value])
                }
            }
            // returns the tooltip in the format:
            // Count of [Language] Movies on [Platform]: [Count]
            // Count of other movies ....
            return `<b>Count of ${d.language} Movies on ${platform.capitalise()}:</b> ${d[platform]} <br/>
                    Other Platform Counts: <br/>
                    ${(otherPlatforms[0][0]).capitalise()}: ${(otherPlatforms[0][1])}<br/>
                    ${(otherPlatforms[1][0]).capitalise()}: ${(otherPlatforms[1][1])}<br/>
                    ${(otherPlatforms[2][0]).capitalise()}: ${(otherPlatforms[2][1])}`
        }

    }

    /******************************************************
     *  create the paging buttons for the language "pages"
     *****************************************************/

    let nextPageButton = document.createElement("button")
    nextPageButton.classList = 'btn-floating btn-large waves-effect waves-light red'
    nextPageButton.id = "languageNextPage"
    nextPageButton.innerHTML = rightArrowSVG;
    nextPageButton.onclick = () => {
        if ((currentPage * points) + points  > getSelectedList().length) return
        currentPage ++
        makeSVG()
    }

    let previousPageButton = document.createElement("button")
    previousPageButton.classList = 'btn-floating btn-large waves-effect waves-light red'
    previousPageButton.id = "languagePreviousPage"
    previousPageButton.innerHTML = leftArrowSVG;
    previousPageButton.onclick = () => {
        if ((currentPage - 1) < 0) return
        currentPage --
        makeSVG()
    }

    // gets the parent element and appends the buttons
    const buttonParent = document.getElementById("languagePageButtons")
    buttonParent.appendChild(previousPageButton)
    buttonParent.appendChild(nextPageButton)

    makeSVG()

}

/**
 * Formats the language data in the way needed for the visualisation
 * @param view the filtered version of the data
 * @returns {unknown[]} A sorted array of the data with language, platform counts, and total
 */
function formatLanguageData(view){
    // gets a list of what is selected in selctor
    const selectedValues = getSelectedList()
    let results = {}

    // loops through selected values and adds the object keys for each language
    for (const l of selectedValues){
        results[l] = {
            language: l,
            netflix: 0,
            hulu: 0,
            disney: 0,
            prime: 0,
            total: 0
        }
    }

    // loop through the movies and count the language occurrences
    for (const movie of view){
         if (!movie.language) continue
         for (const l of movie.language){
             if (!selectedValues.includes(l) && selectedValues.length !== 0) continue // if the value does not exist or isnt the language we're looking at, skip
             if (movie.netflix) addLanguageOccurence(results[l], "netflix")
             if (movie.hulu) addLanguageOccurence(results[l], "hulu")
             if (movie.disney) addLanguageOccurence(results[l], "disney")
             if (movie.prime) addLanguageOccurence(results[l], "prime")
         }
    }

    // sort from most popular to least popular
    return Object.values(results).sort((a,b) => b.total - a.total)


}

/**
 * Gets waht is currently selected in the selector box
 * @returns {*} a list of what is selected
 */
function getSelectedList(){
    const instance = M.FormSelect.getInstance(document.getElementById("languageSelector"));
    let selected = instance.getSelectedValues()
    if (selected.length === 0){
        selected = getLanguages()
    }
    return selected
}

// dynamically updates the language occurence for the platform
// created to minimise code repetition
function addLanguageOccurence(language, platform){
    language[platform]++
    language.total++
}