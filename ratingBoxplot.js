console.log("ratingBoxplot.js is loaded");

//window.renderRuntimeBoxplot = function (view) {

    // set the height and width used to create the visualisation but not as seen on screen
    const height = 1000
    const width = 1000

    // get the svg and set the size of the view box
    const svg = d3.select("#ratingBoxplot")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    // load the data which has been manipulated in R
    var dataPath = "df2.csv";

    // d3
    d3.csv(dataPath)
        // load the json data
        .then(function(myData){
            console.log(myData)
            d3.select("#ratingBoxplot")

                // draw a boxplot
                .data(myData)

                // try
                .text(function(d){
                    return d.platform;


                });
        })


//}