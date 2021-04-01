let mediaData = undefined

/**
 * Function to load the data from the CSV, returns a promise of the data
 * @returns {PromiseLike<void> | Promise<void>}
 */
function loadData(){
    return d3.csv("MoviesOnStreamingPlatforms_updated.csv", function(d) {
        const rottenTomatoes = (d["Rotten Tomatoes"] || "0%").trim() // get rid of white space for the rotten tomatoes values and replace empty strings with 0%
        // NOTES: results are movies only so dont return movie column
        //return a new object instead of the row so the data can be stored as objects with javascript friendly tags
        return {
            uid: d.ID,
            title: d.Title,
            year: parseInt(d.Year.trim()), // convert years to ints and remove any white space in case data formatted incorrectly
            age: d.Age, // TODO: Parse this correctly, rn its returning a string (Map age to an ordinal scale)
            imdb: parseFloat(d.IMDb.trim()), // convert IMDB rating to a float and get rid of any white space (no null values as indicated by kaggle)
            rottenTomatoes: parseInt(rottenTomatoes.substr(0, rottenTomatoes.length - 1)),
            netflix: d.Netflix === 1, // returns true if it is 1, false if it is 0
            hulu: d.Hulu === 1, // returns true if it is 1, false if it is 0
            prime: d["Prime Video"] === 1, // returns true if it is 1, false if it is 0
            disney: d["Disney+"] === 1, // returns true if it is 1, false if it is 0
            directors: d.Directors, //TODO: Parse this correctly if we end up wanting to do anything with directors apart from listing them
            genres: d.Genres.split(","),
            country: d.Country.split(","), //TODO: create a better function to process arrays from the data set in case we want to use these
            language: d.Language.split(","), // TODO: Split this as an array
            runtime: parseInt(d.Runtime)
        }
    }).then(function(data) {
        // set the name of the columns to be more javascript friendly
        data.columns = [
            "uid", "title", "year", "age", "imdb", "rottenTomatoes", "netflix", "hulu",
            "prime", "disney", "directors", "genres", "country", "language", "runtime"
        ]

        // save the data for the visualisation
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
