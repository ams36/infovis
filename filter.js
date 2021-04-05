let filters = {
    rating: undefined
}

function initialiseFilters() {
    createRatingSlider()
    createGenreSelector()
}

function createRatingSlider(){
    // create a range slider for the filter
    // modified from: https://materializecss.com/range.html
    var slider = document.getElementById('ratingSlider');
    noUiSlider.create(slider, {
        start: [0, 10],
        connect: true,
        step: 0.1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': 0,
            'max': 10
        },
        // show only one decimal place
        format: {
            'to': function (d){ return String(Math.round(d * 10) / 10) },
            'from': function (d){ return Number(d)}
        }
    });
    // on sliding, should call filteredByRating
    slider.noUiSlider.on("change", ([min, max]) => filteredByRating(min, max))
    // can do it on update, but concerns about laginess
    //slider.noUiSlider.on("update", ([min, max]) => filteredByRating(min, max))
}

function createGenreSelector(){
    let genres = getGenres()
    const genreSelector = document.getElementById("genreSelector");
    for (const genre of genres) {
        // modified from: https://stackoverflow.com/questions/17730621/how-to-dynamically-add-options-to-an-existing-select-in-vanilla-javascript
        genreSelector.options[genreSelector.options.length] = new Option(genre, genre)
    }
    // create the multiselect
    document.multiselect('#genreSelector');
}

// updates the objects key value for rating to be the function min to max
function filteredByRating(min, max){
    filters.rating = (d) => d.imdb >= min && d.imdb <= max
    applyFilters()
}

// apply the filter and run the vis again
function applyFilters(){
    let data = getMediaData()
    if (filters.rating) data = data.filter(filters.rating)
    runVis(data)
}
