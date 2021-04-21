let mediaData = undefined; // the full data set
let view = undefined; // the current view

/**
 * Function to load the data from the CSV, returns a promise of the data
 * @returns {PromiseLike<void> | Promise<void>}
 */
function loadData() {
    return d3.csv("MoviesOnStreamingPlatforms_updated.csv", function (d) {
        const rottenTomatoes = (d["Rotten Tomatoes"] || "0%").trim() // get rid of white space for the rotten tomatoes values and replace empty strings with 0%
        const genres = (d.Genres || "Unknown")
        const languages = (d.Language || "Unknown").split(",")

        // most movies in Tagalog (which is the same language as Filipino) are listed twice and it is unrealistic for any movies to be dubbed twice in the same language
        // so replace any instances where both are listed to only include Tagalog, the traditional name
        if (languages.includes("Filipino") && !languages.includes("Tagalog")) {
            languages[languages.indexOf("Filipino")] = "Tagalog"
        } else if (languages.includes("Filipino") && languages.includes("Tagalog")){
            languages.splice(languages.indexOf("Filipino"), 1)
        }

        // fix incorrect data points - only checked for extreme outliers
        if (d.Title === "Colorado") d.Runtime = "57" // the data is incorrect for this movie, so we looked up the actual movie length
        if (d.Title === "Law of the Lawless") d.Runtime = "87" // the data is incorrect for this movie, so we looked up the actual movie length
        if (d.Title === "Scarlett") d.Runtime = "92" // the data is incorrect for this movie, so we looked up the actual movie length
        if (d.Title === "The Inner Circle") d.Runtime = "96" // the data is incorrect for this movie, so we looked up the actual movie length
        if (d.Title === "Carlos el terrorista") d.Runtime = "97" // the data is incorrect for this movie, so we looked up the actual movie length
        if (d.Title === "Gone") d.Runtime = "95" // the data is incorrect for this movie, so we looked up the actual movie length
        if (d.Title === "The Vatican Museums") d.Runtime = "154"

        // NOTES: results are movies only so dont return movie column
        //return a new object instead of the row so the data can be stored as objects with javascript friendly tags
        return {
            uid: d.ID,
            title: d.Title,
            year: parseInt(d.Year.trim()), // convert years to ints and remove any white space in case data formatted incorrectly
            age: d.Age, // TODO: Parse this correctly, rn its returning a string (Map age to an ordinal scale)
            imdb: parseFloat(d.IMDb.trim()), // convert IMDB rating to a float and get rid of any white space (no null values as indicated by kaggle)
            rotten: parseInt(rottenTomatoes.substr(0, rottenTomatoes.length - 1)),
            netflix: d.Netflix === "1", // returns true if it is 1, false if it is 0
            hulu: d.Hulu === "1", // returns true if it is 1, false if it is 0
            prime: d["Prime Video"] === "1", // returns true if it is 1, false if it is 0
            disney: d["Disney+"] === "1", // returns true if it is 1, false if it is 0
            directors: d.Directors, //TODO: Parse this correctly if we end up wanting to do anything with directors apart from listing them
            genres: genres.split(","),
            country: d.Country.split(","), //TODO: create a better function to process arrays from the data set in case we want to use these
            language: languages, // TODO: Split this as an array
            runtime: parseInt(d.Runtime)
        }
    }) .then(function (data) {
        // set the name of the columns to be more javascript friendly
        data.columns = [
            "uid", "title", "year", "age", "imdb", "rotten", "netflix", "hulu",
            "prime", "disney", "directors", "genres", "country", "language", "runtime"
        ]

        // remove Custers last stand because its actually a tv show with 15 episodes
        mediaData = data.filter((d) => d.title !== "Custer's Last Stand");
    });
}

/**
 * getter for media data
 * @returns {*} a list of the full data
 */
function getMediaData(){
    return mediaData
}

/**
 * returns a list of unique genres as a string array for filters and any other visualisation that need it
 * @returns an array list of languages
 */
function getGenres(){
    return mediaData
        .map((row) => row.genres)
        .flat()
        .filter((e, i, arr) => arr.indexOf(e) === i && e !== "")
}

/**
 * returns a list of unique languages as a string array for filters and any other visualisation that need it
 * @returns an array list of languages
 */
function getLanguages(){
    return mediaData
        .map((row) => row.language)
        .flat()
        .filter((e, i, arr) => arr.indexOf(e) === i && e !== "")
}

/**
 * gets the year range for filters and any other visualisation that need it
 * @returns {{high: number, low: number}} oldest year, most recent year
 */
function getYearRange(){
    let high = Math.max(...mediaData.map((row) => row.year))
    let low = Math.min(...mediaData.map((row) => row.year))
    return {low: low, high: high}
}

/**
 * gets the runtime range for filters and any other visualisation that need it
 * @returns {{high: number, low: number}} lowest runtime, highest runtime
 */
function getRuntimeRange(){
    let high = Math.max(...mediaData.map((row) => row.runtime).filter((x) => !isNaN(x)))
    let low = Math.min(...mediaData.map((row) => row.runtime).filter((x) => !isNaN(x)))
    return {low: low, high: high}
}

/**
 * Main function to run the visualisation from set up
 * Should not be called until load data has finished
 */
function runVis(current_view){
    view = current_view
    // console.log(view.length)
    renderSharedTitles(view);
    renderRatingBoxplot(view);
    renderRuntimeBoxplot(view);
    renderLanguages(view)
    renderGenreCharts(view)
    renderMovieList(view)
    renderBarChart(view)
}

/**
 * Once the data has loaded, call runVis.
 * This will ensure that run Vis is not called until the data has finished loading
 */
loadData().then(() => initialiseFilters()).then(() => runVis(mediaData))