let mediaData = undefined

/**
 * Function to load the data from the CSV, returns a promise of the data
 * @returns {PromiseLike<void> | Promise<void>}
 */
function loadData(){
    return d3.csv("MoviesOnStreamingPlatforms_updated.csv", function(d) {
        delete d[""] // removes the first column from it
        return d
    }).then(function(data) {
        data.columns = data.columns.slice(1) // removes the first column name from the columns list
        mediaData = data
    });
}

/**
 * Main function to run the visualisation from set up
 * Should not be called until load data has finished
 */
function runVis(){
    console.log(mediaData)
}

/**
 * Once the data has loaded, call runVis.
 * This will ensure that run Vis is not called until the data has finished loading
 */
loadData().then(runVis)
