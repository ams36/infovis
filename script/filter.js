let filters = {
    rating: undefined,
    genres: undefined,
    runtime: undefined,
    language: undefined,
    year: undefined
}

// this was going to be used for an undo filter button (in opposition to the reset one) but
// did not have enough time to fix it, there were errors copying the object correctly
// let filterStack = []

// boolean to indiciate when the select all buttons are mimicking the clicking every option
let supressGenreFilter = false;
let supressLanguageFilter = false;

// pointers to the filter elements so we can reset them on reset or when theres not enough
let runtimeSliderPointer
let yearSliderPointer
let ratingSliderPointer

/**
 * calls all create filter functions after the data has finished loading in index.js
 */
function initialiseFilters() {
    // this used to be the undo button, so it would apply in the same way as reset
    document.getElementById("undo").onclick = () => resetClicked()
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
    ratingSliderPointer = slider.noUiSlider
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
    yearSliderPointer = slider.noUiSlider
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
    runtimeSliderPointer = slider.noUiSlider
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
    genreSelector.innerHTML = ""
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
    languageSelector.innerHTML = ""
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
    filters.rating = {
        apply: (d) => d.imdb >= min && d.imdb <= max,
        min, max
    }
    applyFilters(false)
}

// updates the objects key value for year to be the function min to max
function filteredByYear(min, max){
    filters.year = {
        apply: (d) => d.year >= min && d.year <= max,
        min, max
    }
    applyFilters(false)
}

// updates the objects key value for runtime to be the function min to max
function filteredByRuntime(min, max){
    const range = getRuntimeRange()
    if (min === range.low && max === range.high) filters.runtime = undefined
    else {
        filters.runtime = {
            apply:(d) => d.runtime >= min && d.runtime <= max && !isNaN(d.runtime),
            min, max
        }
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

// resets the filters and applies the filters, resets the filter elements in view too
function resetClicked(){
    filters.rating = undefined
    filters.genres = undefined
    filters.language = undefined
    filters.runtime = undefined
    filters.year = undefined
    applyFilters()

    // reset the sliders and option boxes
    const runtimeRange = getRuntimeRange()
    const yearRange = getYearRange()

    // move the slider back to start
    runtimeSliderPointer.set([runtimeRange.low, runtimeRange.high])
    ratingSliderPointer.set([0, 10])
    yearSliderPointer.set([yearRange.low, yearRange.high])

    // re-call the create functions, which will delete the old one and replace it as a new selector
    createGenreSelector()
    createLanguageSelector()

}

// apply the filter and run the vis again
function applyFilters(fromReset){
    // filter the data
    let data = getMediaData()
    if (filters.rating) data = data.filter(filters.rating.apply)
    if (filters.genres) data = data.filter(filters.genres)
    if (filters.language) data = data.filter(filters.language)
    if (filters.runtime) data = data.filter(filters.runtime.apply)
    if (filters.year) data = data.filter(filters.year.apply)
    if (data.length > 0) {
        runVis(data)
    } else {
        alert("Not enough data to run visusalisation. Please try adjusting your filters. Resetting Filters now.")
        resetClicked() // mimic the reset clicked, which will recall apply filters but with no filters applied now
    }
}

// ******************************************************
// These were the working versions of the functions to apply
// an undo with the most recent filter change
// applying filters with undo
// ******************************************************


// function applyFilters(fromUndo){
//     let data = getMediaData()
//     console.log(filterStack)
//     console.log(filters)
//     if (filters.rating) data = data.filter(filters.rating.apply)
//     if (filters.genres) data = data.filter(filters.genres)
//     if (filters.language) data = data.filter(filters.language)
//     if (filters.runtime) data = data.filter(filters.runtime.apply)
//     if (filters.year) data = data.filter(filters.year.apply)
//     if (data.length > 0) {
//         if (!fromUndo) filterStack.push({...filters})
//         // console.log(filterStack)
//         runVis(data)
//     } else {
//         alert("Not enough data to run visusalisation. Please try adjusting your filters.")
//
//         const runtimeRange = getRuntimeRange()
//
//         if (filterStack.length > 0){
//             const recentFilters =  filterStack[filterStack.length - 1]
//             if (recentFilters.rating) runtimeSliderPointer.set([recentFilters.runtime.min, recentFilters.runtime.max])
//             else runtimeSliderPointer.set([runtimeRange.low, runtimeRange.high])
//         } else {
//             runtimeSliderPointer.set([runtimeRange.low, runtimeRange.high])
//         }
//     }
// }

// was working function for undo the filter change, but as this was taken out, this has been commented out
/*
function undoClicked(){
    if (filterStack.length > 1){
        console.log(filterStack.pop())
        filters = filterStack[filterStack.length -1]
        //update the slider to be the previous one
        if (filters.rating) runtimeSliderPointer.set([filters.runtime.min, filters.runtime.max])
        else {
            const runtimeRange = getRuntimeRange()
            runtimeSliderPointer.set([runtimeRange.low, runtimeRange.high])
        }
        applyFilters(true)
    } else {
        alert("Sorry, Nothing left to undo.")
    }
}
*/


