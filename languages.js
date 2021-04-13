// Modified From: https://www.d3-graph-gallery.com/graph/lollipop_cleveland.html

window.renderLanguages = function (view) {
    const languageCount = formatLanguageData(view).slice(0, 20)
// set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 800 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#languageComparison")
        .html("")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // get the maximum value in array
        const max = languageCount
            .map((d) => Math.max(d.netflix, d.prime, d.hulu, d.disney))
            .reduce((a,b) => Math.max(a,b), 0)

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, max])
            .range([ 0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

        // Y axis
        var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(languageCount.map(function(d) { return d.language; }))
            .padding(1);
        svg.append("g")
            .call(d3.axisLeft(y))

        // Lines
        svg.selectAll("myline")
            .data(languageCount)
            .enter()
            .append("line")
            .attr("x1", function(d) { return x(Math.min(d.netflix, d.prime, d.hulu, d.disney)); })
            .attr("x2", function(d) { return x(Math.max(d.netflix, d.prime, d.hulu, d.disney)); })
            .attr("y1", function(d) { return y(d.language); })
            .attr("y2", function(d) { return y(d.language); })
            .attr("stroke", "grey")
            .attr("stroke-width", "1px")

        // Circles of variable 1
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.netflix); })
            .attr("cy", function(d) { return y(d.language); })
            .attr("r", "6")
            .style("fill", netflixColor)

        // Circles of variable 1
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.hulu); })
            .attr("cy", function(d) { return y(d.language); })
            .attr("r", "6")
            .style("fill", huluColor)

        // Circles of variable 1
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.prime); })
            .attr("cy", function(d) { return y(d.language); })
            .attr("r", "6")
            .style("fill", primeColor)

        // Circles of variable 1
        svg.selectAll("mycircle")
            .data(languageCount)
            .enter()
            .append("circle")
            .attr("cx", function(d) { return x(d.disney); })
            .attr("cy", function(d) { return y(d.language); })
            .attr("r", "6")
            .style("fill", disneyColor)


}


function formatLanguageData(view){
    const allLangauges = getLanguages()
    let results = {}
    for (const l of allLangauges){
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
    var instance = M.FormSelect.getInstance(document.getElementById("languageSelector"));
    const selectedValues = instance.getSelectedValues()

    //console.log(view)
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

function addLanguageOccurence(language, platform){
    language[platform]++
    language.total++
}