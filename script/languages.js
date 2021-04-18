// Modified From: https://www.d3-graph-gallery.com/graph/lollipop_cleveland.html

window.renderLanguages = function (view) {

    document.getElementById("languagePageButtons").innerText = ""

    let currentPage = 0
    const points = 20

    const languages = formatLanguageData(view)
// set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 10, left: 60},
        width = 800 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    function makeSVG() {
        languageCount = languages.slice(points * currentPage, (currentPage +1) * points)
// append the svg object to the body of the page
        var svg = d3.select("#languageComparison")
            .html("")
            .append("svg")
            // scale properly when resized
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", [0, 0, width + 100, height + 60])
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
                if (Number.isInteger(d)) return d
                else return ""
            }));

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(languageCount.map(function (d) {
                return d.language;
            }))

            .padding(1);
        svg.append("g")
            .call(d3.axisLeft(y))

        // Lines
        svg.selectAll("myline")
            .data(languageCount)
            .enter()
            .append("line")
            .attr("x1", function (d) {
                return x(Math.min(d.netflix, d.prime, d.hulu, d.disney));
            })
            .attr("x2", function (d) {
                return x(Math.max(d.netflix, d.prime, d.hulu, d.disney));
            })
            .attr("y1", function (d) {
                return y(d.language);
            })
            .attr("y2", function (d) {
                return y(d.language);
            })
            .attr("stroke", "white")
            .attr("stroke-width", "1px")

        // Circles of variable 1
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle")
            .on("mousemove", function (t, d) {
                createLanguageTooltip(t,d, "netflix")
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            .attr("cx", function (d) {
                return x(d.netflix);
            })
            .attr("cy", function (d) {
                return y(d.language);
            })
            .attr("r", "6")
            .style("fill", colorMap["netflix"])


        // Circles of variable 1
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle")
            .on("mousemove", function (t, d) {
                createLanguageTooltip(t,d, "hulu")
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            .attr("cx", function (d) {
                return x(d.hulu);
            })
            .attr("cy", function (d) {
                return y(d.language);
            })
            .attr("r", "6")
            .style("fill", colorMap["hulu"])

        // Circles of variable 3
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle")
            .on("mousemove", function (t, d) {
                createLanguageTooltip(t,d, "prime")
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            .attr("cx", function (d) {
                return x(d.prime);
            })
            .attr("cy", function (d) {
                return y(d.language);
            })
            .attr("r", "6")
            .style("fill", colorMap["prime"])


        // Circles of variable 4
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle").on("mousemove", function (t, d) {
            createLanguageTooltip(t, d, "disney")
        })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            })
            .attr("cx", function (d) {
                return x(d.disney);
            })
            .attr("cy", function (d) {
                return y(d.language);
            })
            .attr("r", "6")
            .style("fill", colorMap["disney"]);

        function createLanguageTooltip(t,d, platform) {  // the datum you want
            tooltip
                .style("left", t.pageX + 20 + "px")
                .style("top", t.pageY+ "px")
                .style("display", "inline-block")
                .html(generateLanguageTooltipText(d, platform));
        }

        function generateLanguageTooltipText(d, platform){
            return `Count of ${d.language} Movies on ${platform.capitalise()}: ${d[platform]} <br>`
        }

    }

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

    const buttonParent = document.getElementById("languagePageButtons")
    buttonParent.appendChild(previousPageButton)
    buttonParent.appendChild(nextPageButton)

    makeSVG()



}


function formatLanguageData(view){
    const selectedValues = getSelectedList()
    let results = {}
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

    // get a list of the selected languages to ensure they are not showwn

    for (const movie of view){
         if (!movie.language) continue
         for (const l of movie.language){
             if (!selectedValues.includes(l) && selectedValues.length !== 0) continue
             if (movie.netflix) addLanguageOccurence(results[l], "netflix")
             if (movie.hulu) addLanguageOccurence(results[l], "hulu")
             if (movie.disney) addLanguageOccurence(results[l], "disney")
             if (movie.prime) addLanguageOccurence(results[l], "prime")
         }
    }

    // sort from most popular to least popular
    return Object.values(results).sort((a,b) => b.total - a.total)


}

function getSelectedList(){
    // get a list of the selected languages to ensure they are not showwn
    const instance = M.FormSelect.getInstance(document.getElementById("languageSelector"));
    let selected = instance.getSelectedValues()
    if (selected.length === 0){
        selected = getLanguages()
    }
    return selected
}

function addLanguageOccurence(language, platform){
    language[platform]++
    language.total++
}