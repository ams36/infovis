let filters = {
    rating: undefined,
    genres: undefined,
    runtime: undefined,
    language: undefined,
    year: undefined
}

let filterStack = []

let supressGenreFilter = false;
let supressLanguageFilter = false;

/**
 * calls all create filter functions after the data has finished loading in index.js
 */
function initialiseFilters() {
    document.getElementById("undo").onclick = () => undoClicked()
    filterStack.push(filters)
    createRatingSlider()
    createGenreSelector()
    createYearSlider()
    createRuntimeSlider()
    createLanguageSelector()
}

/**
 * creates the rating slider for filtering by rating (min = 0, max = 10)
 */
function createRatingSlider(){
    // create a range slider for the filter
    // modified from: https://materializecss.com/range.html
    const slider = document.getElementById('ratingSlider');
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

/**
 * creates a year slider for filtering by year
 * min and max are determined by years recorded in the dataset
 */
function createYearSlider(){
    const range = getYearRange()
    // create a range slider for the filter
    // modified from: https://materializecss.com/range.html
    const slider = document.getElementById('yearSlider');
    noUiSlider.create(slider, {
        start: [range.low, range.high],
        connect: true,
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': range.low,
            'max': range.high
        },
        // show only one decimal place
        format: {
            'to': function (d){ return String(Math.round(d * 10) / 10) },
            'from': function (d){ return Number(d)}
        }
    });
    // on sliding, should call filteredByRating
    slider.noUiSlider.on("change", ([min, max]) => filteredByYear(min, max))
}

/**
 * creates a run time slider for filtering by run time
 * min and max are determined by run time in the data set
 */
function createRuntimeSlider(){
    const range = getRuntimeRange()
    // console.log(range)
    // create a range slider for the filter
    // modified from: https://materializecss.com/range.html
    const slider = document.getElementById('runtimeSlider');
    noUiSlider.create(slider, {
        start: [range.low, range.high],
        connect: true,
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': range.low,
            'max': range.high
        },
        // show only one decimal place
        format: {
            'to': function (d){ return String(Math.round(d * 10) / 10) },
            'from': function (d){ return Number(d)}
        }
    });
    // on sliding, should call filteredByRating
    slider.noUiSlider.on("change", ([min, max]) => filteredByRuntime(min, max))
}

/**
 * creates a genre selector for filtering by genre
 * options are dynamically filled by whats in the data set
 * Null or "" were replaced to "Unknown"
 */
function createGenreSelector(){
    let genres = getGenres()
    genres = genres.sort()
    const genreSelector = document.getElementById("genreSelector");
    for (const genre of genres) {
        // modified from: https://stackoverflow.com/questions/17730621/how-to-dynamically-add-options-to-an-existing-select-in-vanilla-javascript
        genreSelector.options[genreSelector.options.length] = new Option(genre, genre)
    }
    $(genreSelector).on('change', filteredByGenre)
    // create a multiselector
    // modified from: https://materializecss.com/select.html
    var elems = document.querySelectorAll('#genreSelector');
    var instances = M.FormSelect.init(elems, {});

    // modified from: https://codepen.io/souvik1809/pen/rvNMyO?fbclid=IwAR3lxAlSq8wmShlAta5N2EKgEc02e3r9txS_YzoE2XJrp0X2w5VC6zKatZQ
    const selectAll = $('<li><span>Select All</span></li>');
    $('#genreSelector').siblings('ul').prepend(selectAll);
    selectAll.on('click', function () {
        supressGenreFilter = true
        var jq_elem = $(this),
            jq_elem_span = jq_elem.find('span'),
            select_all = jq_elem_span.text() === 'Select All',
            set_text = select_all ? 'Select None' : 'Select All';
        jq_elem_span.text(set_text);
        jq_elem.siblings('li').filter(function() {
            return $(this).find('input').prop('checked') !== select_all;
        }).click();
        supressGenreFilter = false;
        filteredByGenre()
    });

}

/**
 * creates a language selector for filtering by language
 * options are dynamically lfilled by whats in teh data set
 * Null or "" were replaced with "Unknown"
 */
function createLanguageSelector(){
    let languages = getLanguages()
    languages = languages.sort()
    const languageSelector = document.getElementById("languageSelector");
    for (const language of languages) {
        // modified from: https://stackoverflow.com/questions/17730621/how-to-dynamically-add-options-to-an-existing-select-in-vanilla-javascript
        languageSelector.options[languageSelector.options.length] = new Option(language, language)
    }
    $(languageSelector).on('change', filteredByLanguage)
    // create a multiselector
    // modified from: https://materializecss.com/select.html
    var elems = document.querySelectorAll('#languageSelector');
    var instances = M.FormSelect.init(elems, {});

    // modified from: https://codepen.io/souvik1809/pen/rvNMyO?fbclid=IwAR3lxAlSq8wmShlAta5N2EKgEc02e3r9txS_YzoE2XJrp0X2w5VC6zKatZQ
    const selectAll = $('<li><span>Select All</span></li>');
    $('#languageSelector').siblings('ul').prepend(selectAll);
    selectAll.on('click', function () {
        supressLanguageFilter = true
        var jq_elem = $(this),
            jq_elem_span = jq_elem.find('span'),
            select_all = jq_elem_span.text() === 'Select All',
            set_text = select_all ? 'Select None' : 'Select All';
        jq_elem_span.text(set_text);
        jq_elem.siblings('li').filter(function() {
            return $(this).find('input').prop('checked') !== select_all;
        }).click();
        supressLanguageFilter = false;
        filteredByLanguage()
    });

}

// updates the objects key value for rating to be the function min to max
function filteredByRating(min, max){
    filters.rating = (d) => d.imdb >= min && d.imdb <= max
    applyFilters(false)
}

// updates the objects key value for year to be the function min to max
function filteredByYear(min, max){
    filters.year = (d) => d.year >= min && d.year <= max
    applyFilters(false)
}

// updates the objects key value for runtime to be the function min to max
function filteredByRuntime(min, max){
    const range = getRuntimeRange()
    if (min === range.low && max === range.high) filters.runtime = undefined
    else {
        filters.runtime = (d) => d.runtime >= min && d.runtime <= max && !isNaN(d.runtime)
    }
    applyFilters(false)
}

// updates the genre filter
function filteredByGenre(e){
    // if supress is on, return straight away so we dont apply the filter till select all has completed
    if (supressGenreFilter) return;
    var instance = M.FormSelect.getInstance(document.getElementById("genreSelector"));
    const selectedValues = instance.getSelectedValues()
    if (selectedValues.length !== 0) {
        filters.genres = (d) => d.genres.some((x) => selectedValues.includes(x))
    } else {
        filters.genres = undefined
    }
    applyFilters(false)
}

// updates by language
function filteredByLanguage(e){
    // if supress is on, return straight away so we dont apply the filter till select all has completed
    if (supressLanguageFilter) return;
    var instance = M.FormSelect.getInstance(document.getElementById("languageSelector"));
    const selectedValues = instance.getSelectedValues()
    if (selectedValues.length !== 0) {
        filters.language = (d) => d.language.some((x) => selectedValues.includes(x))
    } else {
        filters.language = undefined
    }
    applyFilters(false)
}

function undoClicked(){
    if (filterStack.length > 1){
        console.log(filterStack.pop())
        filters = filterStack[filterStack.length -1]
        applyFilters(true)
    } else {
        alert("Sorry, Nothing left to undo.")
    }
}

// apply the filter and run the vis again
function applyFilters(fromUndo){
    let data = getMediaData()
    console.log(filterStack)
    console.log(filters)
    if (filters.rating) data = data.filter(filters.rating)
    if (filters.genres) data = data.filter(filters.genres)
    if (filters.language) data = data.filter(filters.language)
    if (filters.runtime) data = data.filter(filters.runtime)
    if (filters.year) data = data.filter(filters.year)
    if (data.length > 0) {
        if (!fromUndo) filterStack.push({...filters})
        // console.log(filterStack)
        runVis(data)
    } else {
        alert("Not enough data to run visusalisation. Please try adjusting your filters.")
    }
}
