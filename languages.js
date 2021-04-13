// Modified From: https://bl.ocks.org/john-guerra/ca575486b081ab3b166e12cfba8169a1

window.renderLanguages = function (view) {
    console.log("here")
    var netflixLanguages = formatLanguageData(view)

    // var svg = d3.create("svg"),
    //     width = 1000,
    //     height = 1000,
    //     radius = Math.min(width, height) / 2,
    //     g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    //
    // var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    //
    // var pie = d3.pie()
    //     .sort(null)
    //     .value(function (d) {
    //         return d.population;
    //     });
    //
    // var path = d3.arc()
    //     .outerRadius(radius - 10)
    //     .innerRadius(radius - 70);
    //
    // var label = d3.arc()
    //     .outerRadius(radius - 40)
    //     .innerRadius(radius - 40);
    //
    // d3.csv("data.csv", function (d) {
    //     d.population = +d.population;
    //     return d;
    // }, function (error, data) {
    //     if (error) throw error;
    //
    //     var arc = g.selectAll(".arc")
    //         .data(pie(data))
    //         .enter().append("g")
    //         .attr("class", "arc");
    //
    //     arc.append("path")
    //         .attr("d", path)
    //         .attr("fill", function (d) {
    //             return color(d.data.age);
    //         });
    //
    //     arc.append("text")
    //         .attr("transform", function (d) {
    //             return "translate(" + label.centroid(d) + ")";
    //         })
    //         .attr("dy", "0.35em")
    //         .text(function (d) {
    //             return d.data.age;
    //         });
    // });
}

function createLanguageObject(languages){
    const platform = {}
    for (const l of languages){
        platform[l] = 0
    }
    return platform
}

function formatLanguageData(view){
    const allLangauges = getLanguages()
    const languagesNetflix = createLanguageObject(allLangauges)
    const languagesHulu = createLanguageObject(allLangauges)
    const languagesDisney = createLanguageObject(allLangauges)
    const languagesPrime = createLanguageObject(allLangauges)

    //console.log(view)
    for (const movie of view){
         if (!movie.language) continue
         for (const l of movie.language){
             if (movie.netflix) languagesNetflix[l]++
             if (movie.hulu) languagesHulu[l]++
             if (movie.disney) languagesDisney[l]++
             if (movie.prime) languagesPrime[l]++
         }
    }

    console.log(languagesNetflix)
    console.log(languagesPrime)
    console.log(languagesDisney)
    console.log(languagesHulu)

    return languagesNetflix

}