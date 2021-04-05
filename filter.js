let filters = {
    rating: undefined,
    genres: undefined
}

function updateFilters(){
    console.log("Made it here")
    filteredByGenre()
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
    $(genreSelector).on('change', filteredByGenre)
    // create a multiselector
    // modified from: https://materializecss.com/select.html
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});

    // modified from: https://codepen.io/souvik1809/pen/rvNMyO?fbclid=IwAR3lxAlSq8wmShlAta5N2EKgEc02e3r9txS_YzoE2XJrp0X2w5VC6zKatZQ
    $('select.select_all').siblings('ul').prepend('<li id=sm_select_all><span>Select All</span></li>');
    $('li#sm_select_all').on('click', function () {
        var jq_elem = $(this),
            jq_elem_span = jq_elem.find('span'),
            select_all = jq_elem_span.text() == 'Select All',
            set_text = select_all ? 'Select None' : 'Select All';
        jq_elem_span.text(set_text);
        jq_elem.siblings('li').filter(function() {
            return $(this).find('input').prop('checked') != select_all;
        }).click();
    });

}

// updates the objects key value for rating to be the function min to max
function filteredByRating(min, max){
    filters.rating = (d) => d.imdb >= min && d.imdb <= max
    applyFilters()
}

// updates the genre filter
// not currently applied yet but now we can get the list of values
function filteredByGenre(e){
    var instance = M.FormSelect.getInstance(document.getElementById("genreSelector"));
    const selectedValues = instance.getSelectedValues()
    if (selectedValues.length !== 0) {
        filters.genres = (d) => d.genres.some((x) => selectedValues.includes(x))
    } else {
        filters.genres = undefined
    }
    applyFilters()
}

// apply the filter and run the vis again
function applyFilters(){
    let data = getMediaData()
    if (filters.rating) data = data.filter(filters.rating)
    if (filters.genres) data = data.filter(filters.genres)
    runVis(data)
}
