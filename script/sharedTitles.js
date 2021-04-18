// Setup the info pop up button
(() => {
    const title = 'Shared Titles between Platforms';
    const content = 'This chord diagram allows users to visualise any shared titles between the Platforms.<br/><br/>' +
        'The number of movies is represented by the ticks around the circle. This can be particularly helpful for users ' +
        'to understand how many movies shared between the platforms in case they are looking to subscribe to more than one. Hover over the sections for more information! <br/>' +
        '<br/>Also on this page, you can find a list of all titles returned and the  total number of movies. You are also able which platforms the film is available on. '
    configureHelp('shared-info-button', title, content);
})();

/**
 * Below code has been modified by piecing together and adjusting the following sources:
 * https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord (modifying data to matrix format)
 * https://observablehq.com/@d3/chord-diagram?collection=@d3/d3-chord (creating the chord diagram)
 * https://bl.ocks.org/nbremer/raw/a23f7f85f30f5cd9e1e8602a5a4e6d75/ (gradient inspiration, but the first version)
 * https://css-tricks.com/scale-svg/ (scaling css for visualisation)
 */

/**
 * Runs the Chord Diagram Overview visualisation.
 * @param view the filtered version of the data to be displayed
 */
window.renderSharedTitles = function (view) {

    // formatting data as needed for the visualisation
    const [connections, names] = formatMatrix(view)

    // set the height and width used to create the visualisation
    const height = 1000
    const width = 1000

    // set up sizes for the circle
    const outerRadius = Math.min(width, height) * 0.5 - 70
    const innerRadius = outerRadius - 10

    // get the svg and set the size of the view box and center the vis
    const svg = d3.select("#sharedTitles")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    //remove everything from the visualisation for when its redrawn
    svg.selectAll("*").remove()

    // makes ticks around the circle
    function ticks({startAngle, endAngle, value}) {
        const k = (endAngle - startAngle) / value;
        return d3.range(0, value, tickStep).map(value => {
            return {value, angle: value * k + startAngle};
        });
    }
    const tickStep = d3.tickStep(0, d3.sum(connections.flat()), 100)

    // make chords and ribbons (chord is the line, ribbon is the thickness)
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
        .text(d => formatValue(d.value))
        .style("font-family", "\"Zilla Slab\", sans-serif")
        .style("font-size", "1.7em");

    // adds the platform names at the beginning of each group
    group.select("text")
        .attr("font-weight", "bold")
        .text(function (d) {
            let name = names[d.index].capitalise()
            if (name.includes("_")) return ""
            return this.getAttribute("text-anchor") === "end"
                ? `↑ ${name}`
                : `${name} ↓`;
        });



    // adds the chords to the svg
    svg.append("g")
        .attr("fill-opacity", 0.8)
        .selectAll("path")
        .data(chords)
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("fill", d => {
            console.log(d)
            if (d.source.index === d.target.index){
                return colorMap[names[d.source.index]]
            }
            const u = `url(#lg-${names[d.source.index]}-${names[d.target.index]})`
            // console.log(u)
            return u;
        })
        .attr("d", ribbon)
        // add tooltip functions to the chord
        .on("mousemove", function(t, d) {
            tooltip
                .style("left", t.pageX + 20 + "px")
                .style("top", t.pageY+ "px")
                .style("display", "inline-block")
                .html(generateTooltipText(d));
        })
        .on("mouseleave", () => {
            tooltip.style("display", "none")
        })

    /**
     * Generates teh tooltips on mousemove
     * @param d the data point it should be showing information about
     * @returns {string} the string to be shown in the tooltip
     */
    function generateTooltipText(d){
        // if the source and target are the same, return the string "[Count] Movies on [Platform]"
        if (d.target.index=== d.source.index) return `<b>${formatValue(d.source.value)} Movies on ${names[d.target.index].capitalise()}<b/>`
        // if the string includes an underscore, it is a chord that is shared between 3 platforms so manipulate the string to show it nicely
        else if (names[d.target.index].includes("_")){
            // structure is platform_PlatformPlatform
            const split = names[d.target.index].split("_") // split the names on the underscore to remove the first platform from the second two
            const platform1 = split[0]
            let platform2 = ""
            let platform3 = ""
            // loop through and find the upper case letters to split on to get the second and third platforms
            for (let i = 1; i < split[1].length; i++) { // start from 1 because the first value should be an uppercase, we want to find the second
                if (split[1].charAt(i).toUpperCase() === split[1].charAt(i)){
                    platform2 = split[1].substring(0,i)
                    platform3 = split[1].substring(i)
                    break
                }
            }
            // return the tooltip in the format [Count] Movies Shared Between: Platform 1, Platform 2, and Platform 3
            return `<b>${formatValue(d.source.value)} Movies Shared Between: ${platform1.capitalise()}, ${platform2.capitalise()}, and ${platform3.capitalise()}<b/>`
        } else {
            // if it is chord between 2 platforms, return as: [Count] Movies Shared Between Platform and Platform
            return `<b>${formatValue(d.source.value)} Movies Shared Between ${names[d.target.index].capitalise()} and ${names[d.source.index].capitalise()}</b>`
        }
    }

}

/**
 * This formats the data into the matrix format needed for a chord diagram
 * @param view the filtered version of the data to be visualised
 * @returns {[any[][], *[]]} matrix format of the data, and a list of the source names that should be displayed
 */
function formatMatrix(view) {
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
    const netflixHulu = allNetflix.filter((x) => allHulu.includes(x) && !allPrime.includes(x) && !allDisney.includes(x)).length
    const netflixDisney = allNetflix.filter((x) => allDisney.includes(x) && !allPrime.includes(x) && !allHulu.includes(x)).length
    const netflixPrime = allNetflix.filter((x) => allPrime.includes(x) && !allHulu.includes(x) && !allDisney.includes(x)).length
    const huluDisney = allHulu.filter((x) => allDisney.includes(x) && !allPrime.includes(x) && !allNetflix.includes(x)).length
    const huluPrime = allHulu.filter((x) => allPrime.includes(x) && !allNetflix.includes(x) && !allDisney.includes(x)).length
    const disneyPrime = allDisney.filter((x) => allPrime.includes(x) && !allNetflix.includes(x) && !allHulu.includes(x)).length
    const netflixExclusive = allNetflix.filter((x) => !allPrime.includes(x) && !allHulu.includes(x) && !allDisney.includes(x)).length
    const huluExclusive = allHulu.filter((x) => !allPrime.includes(x) && !allNetflix.includes(x) && !allDisney.includes(x)).length
    const disneyExclusive = allDisney.filter((x) => !allPrime.includes(x) && !allHulu.includes(x) && !allNetflix.includes(x)).length
    const primeExclusive = allPrime.filter((x) => !allNetflix.includes(x) && !allHulu.includes(x) && !allDisney.includes(x)).length

    // create the source and targets for the chord diagram
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

    ].filter(({value}) => value > (view.length * .001)) // filter out any results that is less than .1% of the data size as they're too small to have interactivity


    const names = connections.map(({source}) => source).filter((e, i, arr) => arr.indexOf(e) === i) // get a list of unique source names

    // turn the data into a matrix
    // code modified from: https://observablehq.com/@d3/directed-chord-diagram?collection=@d3/d3-chord
    return (() => {
        const index = new Map(names.map((name, i) => [name, i]));
        const matrix = Array.from(index, () => new Array(names.length).fill(0));
        for (const {source, target, value} of connections) matrix[index.get(source)][index.get(target)] += value;
        return [matrix, names];
    })();

}