// Returns an array of m psuedorandom, smoothly-varying non-negative numbers.
// Inspired by Lee Byron’s test data generator.
// http://leebyron.com/streamgraph/
window.renderBarChart = function (view) {
    const [yz, groups, max] = formatAgeData(view)
    const xz = ["netflix", "hulu", "disney", "prime"]
    margin = ({top: 0, right: 0, bottom: 30, left: 30})
    width = 600
    height = 500
    const n = 6//xz.length
    // yz = d3.range(n).map(() => bumps(m))
    y01z = d3.stack()
        .keys(d3.range(6))
        (yz)//d3.transpose(yz)) // stacked yz
        .map((data, i) => {return data.map(([y0, y1]) => [y0, y1, i])})

    console.log(yz)
    console.log(y01z)

    y1Max = d3.max(y01z, y => d3.max(y, d => d[1]))
    yMax = d3.max(yz, y => d3.max(y))

    xAxis = svg => svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => ""))


    // sequential color theme chosen by chorma.js to ensure color-blind friendly
    const colorOrder = ['#453750', '#704B49', '#99613F', '#C17830', '#EA9010', '#8B94A3']
    function getColor(d, i){
        console.log("-------")
        console.log(d)
        console.log(i)
        console.log(groups[i])
        return "#000000"
    }


    y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([height - margin.bottom, margin.top])


    //xz = d3.range(m)
    const x = d3.scaleBand()
        .domain(d3.range(xz.length))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.08)


    window.chart = (() => {
        const svg = d3.select("#ageBarPlots")
            .html("")
            .append("svg")
            .attr('width', '100%')
            .attr("viewBox", [0, 0, width, height]);

        const rect = svg.selectAll("g")
            .data(y01z)
            .join("g")
            .attr("fill", (d, i) => {console.log(i); console.log(colorOrder[i]);return colorOrder[i]})
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", h => { return height - margin.bottom})
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .on("mousemove", function(t, d) {  // the datum you want
                tooltip
                    .style("left", t.pageX + 20 + "px")
                    .style("top", t.pageY+ "px")
                    .style("display", "inline-block")
                    .html(generateAgeTooltip(d));
            })
            .on("mouseleave", () => {
                tooltip.style("display", "none")
            });

        function generateAgeTooltip(d){
            let ageGroup = groups[d[2]].capitalise()
            if (ageGroup === "All") ageGroup = "All Ages"
            return `Number of ${ageGroup} Movies: ${d[1]}`
        }

        svg.append("g")
            .attr("transform", "translate(0," + (height-margin.bottom) + ")")
            .call(d3.axisBottom(x).tickFormat((d) => xz[d].capitalise()))
        // svg.append("g")
        //     .call(xAxis);


        const yAxis = svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)



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
            yAxis.call(d3.axisLeft(y))
        }

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
            yAxis.call(d3.axisLeft(y))
        }

        function update(layout) {
            if (layout === "stacked") transitionStacked();
            else transitionGrouped();
        }

            // //.attr("transform", "translate(0," + (height-margin.bottom) + ")")
            // yAxis.call(d3.axisLeft(y))

        return Object.assign(svg.node(), {update});
    })()

    layout = "stacked"
    document.getElementById("stackedBarchart").onclick = () => chart.update("stacked")
    document.getElementById("groupedBarchart").onclick = () => chart.update("grouped")
    window.updateStack = chart.update(layout)

}

function createPlatformObject(ages){
    let platformObject = []
    for (let i = 0; i < ages.length; i++) {
        platformObject.push(0)
    }
    return platformObject
}

function getIndexofAge(ages, entry){
    return (ages.indexOf(entry))
}

function formatAgeData(view){

    let groups =  ["all", "7+", "13+", "16+", "18+", "unknown"]

    let results = [
        createPlatformObject(groups),
        createPlatformObject(groups),
        createPlatformObject(groups),
        createPlatformObject(groups)
    ]

    let netflixTotal = 0
    let huluTotal = 0
    let disneyTotal = 0
    let primeTotal = 0

    for (const movie of view){
        let movieAge = movie.age
        if (movieAge === "") movieAge= "unknown"
        const index = getIndexofAge(groups, movieAge)
        if (movie.netflix) netflixTotal=addAgeEntry(results[0], index, netflixTotal)//results[0][movieAge]++
        if (movie.hulu) huluTotal = addAgeEntry(results[1], index, huluTotal)
        if (movie.disney) disneyTotal = addAgeEntry(results[2], index, disneyTotal)
        if (movie.prime) primeTotal = addAgeEntry(results[3], index, primeTotal)
    }

    const max = Math.max(netflixTotal, huluTotal, disneyTotal, primeTotal)

    return [results, groups, max]
}

function addAgeEntry(result, index, platform){
    result[index]++
    return (platform+1)
}