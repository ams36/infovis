# Information Visualisation Project
*by Mao yingqian and Mika*

#### Important Links: 
- Trello: https://trello.com/invite/b/7O1n5UjH/24dacb2dd616e3f5a9c05e6c49842e1b/visualisation-group-project
- Chosen Data Set: https://www.kaggle.com/ruchi798/movies-on-netflix-prime-video-hulu-and-disney
- Using D3 V6: [Documentation Can Be Found Here](https://github.com/d3/d3/blob/master/API.md)

---
# Glossary 

### mediaData (Javascript Object holding Data from the CSV)

| Tag       | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| uid       | int      | Unique ID for that Movie Entry                               |
| title     | String   | Title of the Movie                                           |
| year      | int      | Year the movie was released                                  |
| age       | String*  | Currently stored as a string but will eventually be a map to a ordinal scale |
| imdb      | float    | 1-10 rating (with decimals) for IMDb Movie Rating            |
| rotten    | int      | Percent (0-100) rating for the movie from Rotten Tomatoes (not including % sign) |
| netflix   | boolean  | True if the movie is on Netflix, False if it is not on Netflix |
| hulu      | boolean  | True if the movie is on Hulu, False if it is not on Hulu     |
| prime     | boolean  | True if the movie is on Prime Video, False if it is not on Prime Video |
| disney    | boolean  | True if the movie is on Disney+, False if it is not on Disney+ |
| directors | Array    | an array of strings for all directors for the movie          |
| genres    | String[] | an array of strings for all genres attached to the movie     |
| country   | String[] | an array of countries where the movie was produced in        |
| language  | String[] | an array of languages the movie is available in              |
| runtime   | int      | length of the movie in minutes                               |



### Javascript Files 

##### index.js

Main javascript file to connect all other files and parse the data initially 

>| Variable / Function | Type / Return                                       | Description                                                  |
>| ------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
>| mediaData           | Array of Objects (The Rows) with a Column Attribute | holds the results from the csv file (without the first column) |
>| view                | Array of Objects (The Rows) with a Column Attribute | A shortened version of mediaData which has the results of the filters |
>| getMediaData()      | A copy of mediaData                                 | returns a copy of media data                                 |
>| loadData()          | `PromiseLike<void> or Promise<void>`                | reads the data in, parses numbers and numbers, splits lists into arrays, updates and removes incorrect data |
>| runVis()            |                                                     | calls all visualisation functions to make vis and is recalled every time a filter is changed |
>| getGenres()         | Array of Strings (The genres)                       | Used for the filter functions to create the genres filter    |
>| getLanguages()      | Array of Strings (The languages)                    | Used for the filter functions to create the languages filter |
>| getYearRange()      | Object: {low: Number, high: Number}                 | Used to set the min and max for the years filter             |
>| getRuntimeRange()   | Object: {low: Number, high: Number}                 | Used to set the min and max for the runtime filter           |

##### utilities.js 

>| Variable / Function | Type / Return    | Description                                                  |
>| ------------------- | ---------------- | ------------------------------------------------------------ |
>| netflixColor        | '#E50914'        | The color used for all netflix visualisaitons. This is placed here because filter.js is called first. |
>| huluColor           | '#1CE783'        | The color used for all hulu visualisaitons. This is placed here because filter.js is called first. |
>| disneyColor         | '#006E99'        | The color used for all disney visualisaitons. This is placed here because filter.js is called first. |
>| primeColor          | '#00A8E1'        | The color used for all prime visualisaitons. This is placed here because filter.js is called first. |
>| capitalise()        | String           | capitalises any strings its passed                           |
>| colorMap            | color (hex code) | an object with indexes that all the functions can call to get the correct colour for visualisations |
>| tooltip             |                  | a pointer to the tooltip HTML element                        |
>| initialise()        |                  | adds any script to HTML elements that need them. Its called after DOM has finished loading |
>| configureHelp()     |                  | Loads the info button on any page for more information about the visualisation |
>| formatValue         |                  | Formats a value as a number                                  |
>| stackSVG            |                  | SVG element imported for the stack button                    |
>| rhombusSVG          |                  | SVG element i,ported for the group button                    |
>| leftArrowSVG        |                  | SVG element for paging buttons                               |
>| rightArrowSG        |                  | SVG element for paging buttons                               |
>
>

##### filter.js

A javascript file to create filter UI elements in javascript and calls the runVis() function in index.js with the updated data based on the filters applied.

>| Variable / Function         | Type / Return                       | Description                                                  |
>| --------------------------- | ----------------------------------- | ------------------------------------------------------------ |
>| filters                     | Object of functions for each filter | Each key represents one filter, it maps to a function that takes one row and returns whether or not that row should be included in the visualised data set |
>| supressGenreFilter          | boolean                             | When clicking the "select all" filter for genres, it mimics clicking thorugh all the filters. To not cause the page go into overdrive, this boolean is set to true until it has finished mimicing the clicks. |
>| supressLanguageFilter       | boolean                             | When clicking the "select all" filter for languages, it mimics clicking thorugh all the filters. To not cause the page go into overdrive, this boolean is set to true until it has finished mimicing the clicks. |
>| initialiseFilters()         |                                     | Creates filters and any other HTML elements needed for the filter section of the page as soon as its opened |
>| createRatingSlider()        |                                     | Creates the rating slider in the filter div                  |
>| ratingSliderPointer         |                                     | a copy of the slider instance so it can be updated when filters are cleared |
>| createRuntimeSlider()       |                                     | Creates the runtime slider in the filter div                 |
>| runtimeSliderPointer        |                                     | a copy of the slider instance so it can be updated when filters are cleared |
>| createYearSlider()          |                                     | Creates the year slider in the filter div                    |
>| yearSliderPointer           |                                     | a copy of the slider instance so it can be updated when filters are cleared |
>| createGenreSelector()       |                                     | Creates the drop down check box list for genres in the filter div |
>| createLanguageSelector()    |                                     | Creates the drop down check box list for languages in the filter div |
>| filteredByRating()          |                                     | is called whenever a the rating slider bar is changed to update how the data should be filtered |
>| filteredByYear(min, max)    |                                     | is called whenever the year slider bar is changed to update how the data should be filtered |
>| filteredByRuntime(min, max) |                                     | is called whenever the runtime slider bar is changed to update how the data should be filtered |
>| filteredByGenre(event)      |                                     | is called whenever a value is changed in the genre check list to update how the data should be filtered |
>| filteredByLanguage(event)   |                                     | is called whenever a value is changed in the language check list to update how the data should be filtered |
>| resetClicked()              |                                     | resets the filter object's values to undefined, resets sliders and selectors, calls applyFilter |
>| applyFilters                |                                     | calls runVis() again to pass it the filtered data. This is called at the end of every ```filteredBy<x>``` function |

### HTML and CSS

| Description                                                  | ID                 | Class              | Tag  |
| ------------------------------------------------------------ | ------------------ | ------------------ | ---- |
| **Fixed Filter Bar**                                         | filter             | filter             | div  |
| Slider for filtering by rating (Eventually becomes a NoUISlider in filter.js) | ratingSlider       |                    | div  |
| **First "Page" View**: Overview Chord Diagram                | overviewPage       | page               | div  |
| Page 1 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_1     | filter             | div  |
| Area for the Chord Diagram View                              | chordDiagram       | chordDiagram       | div  |
| SVG to be updated for Chord Diagram Shared Titles (child element of chordDiagram) | sharedTitles       | sharedTitles       | svg  |
| a list of all movies for the results with check boxes to indicate which platforms its avialable on | movieList          | movieList          | div  |
| **Second "Page" View**: Rating and Runtime Boxplots          | boxplotsPage       | page               | div  |
| Page 2 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_2     | filter             | div  |
| Holds both boxplots in this view so we can do flex-wrap with smaller screens | allBoxplots        | boxplotsParent     | div  |
| Area for the Rating Boxplots to go within allBoxplots        | ratingBoxplot      | boxplots           | div  |
| Area for the Runtime Boxplots to go within allBoxplots       | runtimeBoxplot     | boxplots           | div  |
| **Third "Page" View**: Genre Analysis Page                   | genrePage          | page               | div  |
| Page 3 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_3     | filter             | div  |
| area for the genre diagrams to go                            | genreDiagram       | genres             | div  |
| **Fourth "Page" View**: Age Bar Plots (Stacked to Grouped)   | agePage            | page               | div  |
| Page 4 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_4     | filter             | div  |
| area for age barplot to go                                   | ageBarPlots        | barPlots           | div  |
| **Fifth "Page" View**: World Page (Currently only languages but maybe map too) | worldPage          | page               | div  |
| Page 4 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_5     | filter             | div  |
| Area for the language visualisation to go                    | languageComparison | languageComparison | div  |
| area under languageComparison for Netflix Vis                | netflixLanguages   | languages          | div  |
| area under languageComparison for Hulu Vis                   | huluLanguages      | languages          | div  |
| area under languageComparison for Disney Vis                 | disneyLanguages    | languages          | div  |
| area under languageComparison for Prime Vis                  | primeLanguages     | languages          | div  |

## Visualisation Scripts

##### sharedTitles.js

Javscript file to render the chord visualisation of shared titles between platforms. It takes in the view stored in Index.js. 

>| Variable / Function | Type / Return           | Description                                                  |
>| ------------------- | ----------------------- | ------------------------------------------------------------ |
>| connections         | Number[ ] [ ]           | matrix version of the data needed for a chord diagram in d3  |
>| names               | String[ ]               | the names of each platform in the same order as the matrix   |
>| formatMatrix()      | return ```Number[][]``` | takes the view that sharedTitles was passed, counts the number of exclusive and shared titles between the platforms, and returns the matrix version of the data |

##### movieList.js

Javscript file to render the list of movies on the right hand side of the overview page. It takes in the view stored in index.js

>| Variable / Function   | Type / Return | Description                                                  |
>| --------------------- | ------------- | ------------------------------------------------------------ |
>| renderMovieList(view) |               | is called to create and update the movie list on the right hand side of the overview page |
>| changeMoviePage()     |               | takes the table body, current page count, and number of rows that should be on a page and updates the table forward or backward |

##### genrePieCharts.js

Javscript file to render the chord visualisation of shared titles between platforms. It takes in the view stored in Index.js. 

>| Variable / Function   | Type / Return | Description                                                  |
>| --------------------- | ------------- | ------------------------------------------------------------ |
>| renderMovieList(view) |               | is called to create and update genre pie chart visualisation. Uses D3 circle packing (bubble) to place the circles and their sizes, attaches tooltips containing the count for each part of the pie chart and integrates d3-zoom to allow for zooming and panning within the frame |
>| formatGenres(view)    |               | takes the view and formats it into a format usable by bubble pie charts. This groups the data by genre, each genre countaining counts for each of the platforms, original movie titles are discarded |

##### ageBar.js

Javascript file to render the age bar chart visualisation of number of movies per age category by platform. It takes the view stored in index.js

> | Variable / Function                  | Type / Return                                     | Description                                                  |
> | ------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------ |
> | renderBarChart(view)                 |                                                   | is called to create and update the age bar chart. This will manipulate the data and arrange the data in either a stacked bar chart or a side-by-side bar chart based on the users selected choice. This also attaches a tooltip to each record containing the number of records by that age category for that platform |
> | createPlatformObject(ages)           | array of 0s                                       | generates an array of 0s to hold the amount of movies in each of the age categories |
> | getIndexofAge(age, entry)            | index of entry in ages                            | returns the index of the entry in the array of ages          |
> | formatAgeData                        | array of formatted data, groups and maximum total | reformats the data to group the movies by their age value. returns a 2d array, the first index being the platform, the second index being the age group. any movie without an age is assigned unknown |
> | addAgeEntry(result, index, platform) | new platform length                               | increments the value at the index in result and returns the value of platform + 1 |

##### languages.js

Javascript file to render the modified lollipop plot showing count of movies by platform for each language.

> | Variable / Function                      | Type / Return          | Description                                                  |
> | ---------------------------------------- | ---------------------- | ------------------------------------------------------------ |
> | renderLanguages(view)                    |                        | creates and updates the visualisation of languages based on the provided view. it shows each language followed by a lollipop chart showing one circle for each platform joined by a line, it also attaches a tooltip to each record. It limits the data based on the page and the records per page, assigning forward and backwards buttons |
> | formatLanguageData(view)                 | array of language data | converts the view data into an array of values, one per language selected, each value being an object containing the count of movies in that language for each platform |
> | getSelectedList()                        | array of languages     | queries the select element in the filters to get the set of languagess currently clicked, if none are selected it returns all |
> | addLanguageOccurence(language, platform) |                        | adds one to the platform in the language object and increments the total |

##### ratingBoxplot.js

Javascript file to render the boxplot of the IMDb ratings by platform

> | Variable / Function                            | Type / Return   | Description                                                  |
> | ---------------------------------------------- | --------------- | ------------------------------------------------------------ |
> | renderRatingBoxplot(view)                      |                 | renders the boxplot showing min, max, q1-q3 and median in a boxplot, one for each platform, at also attaches tooltips to each of the boxplots. outlier points are shown in semi-transparent circles |
> | formatData(view)                               | array of points | converts the view data to a set of points, each point containing the platform and imdb rating and sorts them by their platform to group them |
> | getRatingOutliers(rating_data, platformMinMax) | array of points | converts the rating data and selects only points outside of the provided minimum and maximum for each platform and combines them all into an array of points |

##### runningtimeboxplot.js

Javascript file to render and update the running time boxplot showing a boxplot of the running time of movies separated by platform

> | Variable / Function                              | Type / Return                                  | Description                                                  |
> | ------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
> | renderRuntimeBoxplot                             |                                                | renders and updates the boxplot for runtime showing the min, max, q1-q3 and median in a boxplot, one for each platform, and attaches tooltips to each of the boxplots and outliers. outlier points are shown in semi-transparent circles |
> | getRuntimeOutliers(runtime_data, platformMinMax) | array of points                                | converts the runtime data and selects only points outside of the provided minimum and maximum for each platform and combines them all into an array of points |
> | runtime(view)                                    | an array of data, the low value and high value | convers the view data in an array of points and the lowest and highest runtime. Each data point contains the platform and the runtime of the movie. Movies without a runtime (represented by NaN) are filtered out of the points |



---

# Libraries Used

* **Materialize Framework** - Creating UI elements and making them prettier 
* **NoUISlider** - Creating a rating slider for a filter 
* **D3.js (V6)**  - creating visualisations 
* **JQuery** - To create select all button for drop down check boxes 

