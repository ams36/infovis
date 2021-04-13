window.renderRuntimeBoxplot = function (view) {

    const ratings = formatData(view)
    console.log(ratings)

    // set the height and width used to create the visualisation but not as seen on screen
    const height = 1000
    const width = 1000

    // get the svg and set the size of the view box
    // TODO: Note this currently isnt stored as a svg so you may need to make one, its just a div rn
    const svg = d3.select("#ratingBoxplot")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    // load the data which has been manipulated in R
    //var dataPath = "df2.csv";

    // d3
    // d3.csv(dataPath)
    //     // load the json data
    //     .then(function(myData){
    //         console.log(myData)
    //         d3.select("#ratingBoxplot")
    //
    //             // draw a boxplot
    //             .data(myData)
    //
    //             // try
    //             .text(function(d){
    //                 return d.platform;
    //
    //
    //             });
    //     })


}

function formatData(view){
    const data = []
    for (const movie of view){
        if (movie.netflix) data.push({platform: "netflix", imdb: movie.imdb})
        if (movie.hulu) data.push({platform: "hulu", imdb: movie.imdb})
        if (movie.disney) data.push({platform: "disney", imdb: movie.imdb})
        if (movie.prime) data.push({platform: "prime", imdb: movie.imdb})
    }

    //sort it so it goes in order (idk if its needed but the example CSVs I looked at had it sorted
    data.sort((a, b) => a.platform.localeCompare(b.platform))
    return data
}