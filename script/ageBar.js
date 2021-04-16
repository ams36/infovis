console.log("barchat")

// Returns an array of m psuedorandom, smoothly-varying non-negative numbers.
// Inspired by Lee Byron’s test data generator.
// http://leebyron.com/streamgraph/
window.renderBarChart = function (view) {
    const [yz, groups, max] = formatAgeData(view)
    const xz = ["netflix", "hulu", "disney", "prime"]
    margin = ({top: 0, right: 0, bottom: 10, left: 0})
    width = 600
    height = 500
    const n = xz.length
    console.log(d3.transpose(yz))
    // yz = d3.range(n).map(() => bumps(m))
    y01z = d3.stack()
        .keys(d3.range(6))
        (yz)//d3.transpose(yz)) // stacked yz
        .map((data, i) => { console.log(data); return data.map(([y0, y1]) => [y0, y1, i])})

    y1Max = d3.max(y01z, y => d3.max(y, d => d[1]))
    yMax = d3.max(yz, y => d3.max(y))

    xAxis = svg => svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(() => ""))


    const z = d3.scaleSequential(d3.interpolateBlues)
        .domain([-0.5 * n, 1.5 * n])


    y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([height - margin.bottom, margin.top])

    //xz = d3.range(m)
    x = d3.scaleBand()
        .domain(d3.range(xz.length))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.08)

    console.log(y01z)

    window.chart = (() => {
        console.log("here")
        const svg = d3.select("#ageBarPlots")
            .html("")
            .append("svg")
            .attr("viewBox", [0, 0, width, height]);

        const rect = svg.selectAll("g")
            .data(y01z)
            .join("g")
            .attr("fill", (d, i) => z(i))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", h => {console.log(h); return height - margin.bottom})
            .attr("width", x.bandwidth())
            .attr("height", 0);

        svg.append("g")
            .call(xAxis);

        function transitionGrouped() {
            y.domain([0, yMax]);

            rect.transition()
                .duration(500)
                .delay((d, i) => i * 20)
                .attr("x", (d, i) => x(i) + x.bandwidth() / n * d[2])
                .attr("width", x.bandwidth() / n)
                .transition()
                .attr("y", d => y(d[1] - d[0]))
                .attr("height", d => y(0) - y(d[1] - d[0]));
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
        }

        function update(layout) {
            if (layout === "stacked") transitionStacked();
            else transitionGrouped();
        }

        return Object.assign(svg.node(), {update});
    })()

    layout = "stacked"
    console.log(document.getElementById("stackedBarchart"))
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
    // get a list of the ages in the view
    let ages =  mediaData
        .map((row) => row.age)
        .flat()
        .filter((e, i, arr) => arr.indexOf(e) === i && e !== "")

    let groups = ["unknown"].concat(ages)

    // console.log(ages)
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

    console.log(view)
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

    console.log(results)
    console.log(groups)
    return [results, groups, max]
}

function addAgeEntry(result, index, platform){
    result[index]++
    return (platform+1)
}