/**
 * Below code has been modified by piecing together and adjusting the following sources:
 * https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord (modifying data to matrix format)
 * https://observablehq.com/@d3/chord-diagram?collection=@d3/d3-chord (creating the chord diagram)
 * https://bl.ocks.org/nbremer/raw/a23f7f85f30f5cd9e1e8602a5a4e6d75/ (gradient inspiration, but the first version)
 * https://css-tricks.com/scale-svg/ (scaling css for visualisation)
 */

window.renderSharedTitles = function (view) {


    // formatting data as needed for the visualisation
    const connections = formatMatrix()
    const names = ["netflix", "hulu", "disney", "prime"]

    // set the height and width used to create the visualisation but not as seen on screen
    const height = 1000
    const width = 1000
    // set up sizes for the circle
    const outerRadius = Math.min(width, height) * 0.5 - 60
    const innerRadius = outerRadius - 10

    // get the svg and set the size of the view box and center the vis
    const svg = d3.select("#sharedTitles")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    // colour of each platform
    const colorMap = {
        netflix: '#E50914',
        hulu: '#1CE783',
        disney: '#006E99',
        prime: '#00A8E1',
    };

    // makes ticks around the circle
    function ticks({startAngle, endAngle, value}) {
        const k = (endAngle - startAngle) / value;
        return d3.range(0, value, tickStep).map(value => {
            return {value, angle: value * k + startAngle};
        });
    }
    const tickStep = d3.tickStep(0, d3.sum(connections.flat()), 100)
    const formatValue = d3.format("1")

    // make chords and ribbons
    const chord = d3.chord()
        .padAngle(10 / innerRadius)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending)
    const chords = chord(connections);

    const ribbon = d3.ribbon()
        .radius(innerRadius - 1)
        .padAngle(1 / innerRadius)

    // make arcs
    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)

    // create gradients for connections between platforms
    // linear gradients have to be defined in the svg
    // each is given an id which is then referenced to give each its colour
    // the x and y code is taken from the gradient source above
    // it ensures the gradients render nicely across the ribbons
    const gradients = svg.append('defs').selectAll('linearGradient')
        .data(chords)
        .enter()
        .append('linearGradient')
        .attr('id', (d) => `lg-${names[d.source.index]}-${names[d.target.index]}`)
        .attr('gradientUnits', 'userSpaceOnUse').attr("x2", function (d, i) {
            return innerRadius * Math.cos((d.source.endAngle - d.source.startAngle) / 2 +
                d.source.startAngle - Math.PI / 2);
        })
        .attr("y2", function (d, i) {
            return innerRadius * Math.sin((d.source.endAngle - d.source.startAngle) / 2 +
                d.source.startAngle - Math.PI / 2);
        })
        .attr("x1", function (d, i) {
            return innerRadius * Math.cos((d.target.endAngle - d.target.startAngle) / 2 +
                d.target.startAngle - Math.PI / 2);
        })
        .attr("y1", function (d, i) {
            return innerRadius * Math.sin((d.target.endAngle - d.target.startAngle) / 2 +
                d.target.startAngle - Math.PI / 2);
        });
    gradients.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', (d) => colorMap[names[d.source.index]]);
    gradients.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', (d) => colorMap[names[d.target.index]]);

    // contains the regions for each of the providers
    const group = svg.append("g")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .selectAll("g")
        .data(chords.groups)
        .join("g");

    // exclusive content paths for the visualisation
    group.append("path")
        .attr("fill", d => {
            return colorMap[names[d.index]];
        })
        .attr("d", arc);

    // creates a group for each tick around the edge
    const groupTick = group.append("g")
        .selectAll("g")
        .data(ticks)
        .join("g")
        .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);

    // adds the line to each tick
    groupTick.append("line")
        .attr("stroke", "currentColor")
        .attr("x2", 6);

    // adds the text to each tick
    groupTick.append("text")
        .attr("x", 8)
        .attr("dy", "0.35em")
        .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
        .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
        .text(d => formatValue(d.value));

    // adds the platform names at the beginning of each group
    group.select("text")
        .attr("font-weight", "bold")
        .text(function (d) {
            return this.getAttribute("text-anchor") === "end"
                ? `↑ ${names[d.index]}`
                : `${names[d.index]} ↓`;
        });

    // adds the chords to the svg
    svg.append("g")
        .attr("fill-opacity", 0.8)
        .selectAll("path")
        .data(chords)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("fill", d => {
            const u = `url(#lg-${names[d.source.index]}-${names[d.target.index]})`
            console.log(u)
            return u;
        })
        .attr("d", ribbon)
        .append("title")
        .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);

}

function formatMatrix() {
    // add streaming services as nodes
    const allNetflix = []
    const allHulu = []
    const allDisney = []
    const allPrime = []

    //loop through movies and add links to the set if it exists there
    for (const movie of view) {
        if (movie.netflix) allNetflix.push(movie.uid)
        if (movie.hulu) allHulu.push(movie.uid)
        if (movie.disney) allDisney.push(movie.uid)
        if (movie.prime) allPrime.push(movie.uid)
    }

    // get shared and exclusive title counts for each platform
    const netflix_hulu = allNetflix.filter((x) => allHulu.includes(x)).length  // the number of shared titles between netflix and hulu
    const netflix_disney = allNetflix.filter((x) => allDisney.includes(x)).length  // the number of shared titles between netflix and disney
    const netflix_prime = allNetflix.filter((x) => allPrime.includes(x)).length  // the number of shared titles between netflix and prime
    const netflix_exclusive = allNetflix.length - (netflix_hulu + netflix_disney + netflix_prime)
    const hulu_disney = allHulu.filter((x) => allDisney.includes(x)).length
    const hulu_prime = allHulu.filter((x) => allPrime.includes(x)).length
    const hulu_exclusive = allHulu.length - (netflix_hulu + hulu_disney + hulu_prime)
    const disney_prime = allDisney.filter((x) => allPrime.includes(x)).length
    const disney_exclusive = allDisney.length - (disney_prime + hulu_disney + netflix_disney)
    const prime_exclusive = allPrime.length - (netflix_prime + hulu_prime + disney_prime)

    connections = [
        {source: "netflix", target: "netflix", value: netflix_exclusive},
        {source: "disney", target: "disney", value: disney_exclusive},
        {source: "prime", target: "prime", value: prime_exclusive},
        {source: "hulu", target: "hulu", value: hulu_exclusive},

        {source: "netflix", target: "hulu", value: netflix_hulu},
        {source: "hulu", target: "netflix", value: netflix_hulu},

        {source: "netflix", target: "disney", value: netflix_disney},
        {source: "disney", target: "netflix", value: netflix_disney},

        {source: "netflix", target: "prime", value: netflix_prime},
        {source: "prime", target: "netflix", value: netflix_prime},

        {source: "hulu", target: "disney", value: hulu_disney},
        {source: "disney", target: "hulu", value: hulu_disney},

        {source: "hulu", target: "prime", value: hulu_prime},
        {source: "prime", target: "hulu", value: hulu_prime},

        {source: "disney", target: "prime", value: disney_prime},
        {source: "prime", target: "disney", value: disney_prime}
    ]

    const names = ["netflix", "hulu", "disney", "prime"]

    // turn the data into a matrix
    // code modified from: https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord
    return (() => {
        const index = new Map(names.map((name, i) => [name, i]));
        const matrix = Array.from(index, () => new Array(names.length).fill(0));
        for (const {source, target, value} of connections) matrix[index.get(source)][index.get(target)] += value;
        return matrix;
    })();

}