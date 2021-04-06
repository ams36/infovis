/**
 * Below code has been modified by piecing together and adjusting the following sources:
 * https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord (modifying data to matrix format)
 * https://observablehq.com/@d3/chord-diagram?collection=@d3/d3-chord (creating the chord diagram)
 * https://bl.ocks.org/nbremer/raw/a23f7f85f30f5cd9e1e8602a5a4e6d75/ (gradient inspiration, but the first version)
 * https://css-tricks.com/scale-svg/ (scaling css for visualisation)
 */

window.renderSharedTitles = function (view) {


    // formatting data as needed for the visualisation
    const [connections, names] = formatMatrix()
    // const names = [
    //     "netflix", "netflix_PrimeHulu", "netflix_DisneyHulu", "netflix_DisneyPrime",
    //     "prime", "prime_NetflixHulu", "prime_DisneyHulu", "prime_NetflixDisney",
    //     "disney", "disney_NetflixHulu", "disney_PrimeHulu", "disney_NetflixPrime",
    //     "hulu", "hulu_NetflixDisney", "hulu_PrimeDisney", "hulu_NetflixPrime",
    //     "allPlatforms"]

    // set the height and width used to create the visualisation but not as seen on screen
    const height = 1000
    const width = 1000
    // set up sizes for the circle
    const outerRadius = Math.min(width, height) * 0.5 - 60
    const innerRadius = outerRadius - 10

    // get the svg and set the size of the view box and center the vis
    const svg = d3.select("#sharedTitles")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    //remove everything from the visualisation for when its redrawn
    svg.selectAll("*").remove()

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
    const allPlatforms = allNetflix.filter((x) => allDisney.includes(x) && allPrime.includes(x)  && allHulu.includes(x)).length
    const netflixHuluDisney = allNetflix.filter((x) => allHulu.includes(x) && allDisney.includes(x) && !allPrime.includes(x)).length
    const netflixPrimeHulu = allNetflix.filter((x) => allPrime.includes(x) && allHulu.includes(x) && !allDisney.includes(x)).length
    const netflixPrimeDisney = allNetflix.filter((x) => allPrime.includes(x) && allDisney.includes(x) && !allHulu.includes(x)).length
    const disneyHuluPrime = allDisney.filter((x) => allHulu.includes(x) && allPrime.includes(x) && !allNetflix.includes(x)).length
    const netflixHulu = allNetflix.filter((x) => allHulu.includes(x) && !allPrime.includes(x) && !allDisney.includes(x)).length  // the number of shared titles between netflix and hulu
    const netflixDisney = allNetflix.filter((x) => allDisney.includes(x) && !allPrime.includes(x) && !allHulu.includes(x)).length  // the number of shared titles between netflix and disney
    const netflixPrime = allNetflix.filter((x) => allPrime.includes(x) && !allHulu.includes(x) && !allDisney.includes(x)).length  // the number of shared titles between netflix and prime
    const huluDisney = allHulu.filter((x) => allDisney.includes(x) && !allPrime.includes(x) && !allNetflix.includes(x)).length
    const huluPrime = allHulu.filter((x) => allPrime.includes(x) && !allNetflix.includes(x) && !allDisney.includes(x)).length
    const disneyPrime = allDisney.filter((x) => allPrime.includes(x) && !allNetflix.includes(x) && !allHulu.includes(x)).length
    const netflixExclusive = allNetflix.filter((x) => !allPrime.includes(x) && !allHulu.includes(x) && !allDisney.includes(x)).length
    const huluExclusive = allHulu.filter((x) => !allPrime.includes(x) && !allNetflix.includes(x) && !allDisney.includes(x)).length
    const disneyExclusive = allDisney.filter((x) => !allPrime.includes(x) && !allHulu.includes(x) && !allNetflix.includes(x)).length
    const primeExclusive = allPrime.filter((x) => !allNetflix.includes(x) && !allHulu.includes(x) && !allDisney.includes(x)).length

    connections = [
        // add all for netflix
        {source: "netflix", target: "netflix", value: netflixExclusive},
        {source: "netflix", target: "allPlatforms", value: allPlatforms},
        {source: "netflix", target: "hulu", value: netflixHulu},
        {source: "netflix", target: "disney", value: netflixDisney},
        {source: "netflix", target: "prime", value: netflixPrime},
        {source: "netflix_PrimeHulu", target: "prime_NetflixHulu", value: netflixPrimeHulu},
        {source: "netflix_PrimeHulu", target: "hulu_NetflixPrime", value: netflixPrimeHulu},
        {source: "netflix_DisneyHulu", target: "disney_NetflixHulu", value: netflixHuluDisney},
        {source: "netflix_DisneyHulu", target: "hulu_NetflixDisney", value: netflixHuluDisney},
        {source: "netflix_DisneyPrime", target: "disney_NetflixPrime", value: netflixPrimeDisney},
        {source: "netflix_DisneyPrime", target: "prime_NetflixDisney", value: netflixPrimeDisney},

        // add all for prime
        {source: "prime", target: "prime", value: primeExclusive},
        {source: "prime", target: "allPlatforms", value: allPlatforms},
        {source: "prime", target: "hulu", value: huluPrime},
        {source: "prime", target: "disney", value: disneyPrime},
        {source: "prime", target: "netflix", value: netflixPrime},
        {source: "prime_NetflixHulu", target: "netflix_PrimeHulu", value: netflixPrimeHulu},
        {source: "prime_NetflixHulu", target: "hulu_NetflixPrime", value: netflixPrimeHulu},
        {source: "prime_DisneyHulu", target: "disney_PrimeHulu", value: disneyHuluPrime},
        {source: "prime_DisneyHulu", target: "hulu_PrimeDisney", value: disneyHuluPrime},
        {source: "prime_NetflixDisney", target: "disney_NetflixPrime", value: netflixPrimeDisney},
        {source: "prime_NetflixDisney", target: "netflix_DisneyPrime", value: netflixPrimeDisney},

        // add all for disney
        {source: "disney", target: "disney", value: disneyExclusive},
        {source: "disney", target: "allPlatforms", value: allPlatforms},
        {source: "disney", target: "hulu", value: huluDisney},
        {source: "disney", target: "prime", value: disneyPrime},
        {source: "disney", target: "netflix", value: netflixDisney},
        {source: "disney_NetflixHulu", target: "netflix_DisneyHulu", value: netflixHuluDisney},
        {source: "disney_NetflixHulu", target: "hulu_NetflixDisney", value: netflixHuluDisney},
        {source: "disney_PrimeHulu", target: "prime_DisneyHulu", value: disneyHuluPrime},
        {source: "disney_PrimeHulu", target: "hulu_PrimeDisney", value: disneyHuluPrime},
        {source: "disney_NetflixPrime", target: "prime_NetflixDisney", value: netflixPrimeDisney},
        {source: "disney_NetflixPrime", target: "netflix_DisneyPrime", value: netflixPrimeDisney},

        // add all for hulu
        {source: "hulu", target: "hulu", value: huluExclusive},
        {source: "hulu", target: "allPlatforms", value: allPlatforms},
        {source: "hulu", target: "disney", value: huluDisney},
        {source: "hulu", target: "prime", value: huluPrime},
        {source: "hulu", target: "netflix", value: netflixHulu},
        {source: "hulu_NetflixDisney", target: "netflix_DisneyHulu", value: netflixHuluDisney},
        {source: "hulu_NetflixDisney", target: "disney_NetflixHulu", value: netflixHuluDisney},
        {source: "hulu_PrimeDisney", target: "prime_DisneyHulu", value: disneyHuluPrime},
        {source: "hulu_PrimeDisney", target: "disney_PrimeHulu", value: disneyHuluPrime},
        {source: "hulu_NetflixPrime", target: "prime_NetflixHulu", value: netflixPrimeHulu},
        {source: "hulu_NetflixPrime", target: "netflix_PrimeHulu", value: netflixPrimeHulu},

        {source: "allPlatforms", target: "netflix", value: allPlatforms},
        {source: "allPlatforms", target: "prime", value: allPlatforms},
        {source: "allPlatforms", target: "hulu", value: allPlatforms},
        {source: "allPlatforms", target: "disney", value: allPlatforms}

    ].filter(({value}) => value > (view.length * .01)) // filter out any results that is less than 1% of the data size as they're too small to have interactivity

    console.log(view.length * .01)

    console.log(connections)

    const names = connections.map(({source}) => source).filter((e, i, arr) => arr.indexOf(e) === i) // get a list of unique source names
    console.log(names)

    // turn the data into a matrix
    // code modified from: https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord
    return (() => {
        const index = new Map(names.map((name, i) => [name, i]));
        const matrix = Array.from(index, () => new Array(names.length).fill(0));
        for (const {source, target, value} of connections) matrix[index.get(source)][index.get(target)] += value;
        return [matrix, names];
    })();

}