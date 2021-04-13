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
>| loadData()          |                                                     | `PromiseLike<void> or Promise<void>`                         |
>| runVis()            |                                                     | calls all visualisation functions to make vis and is recalled every time a filter is changed |
>| getGenres()         | Array of Strings (The genres)                       | Used for the filter functions to create the genres filter    |
>| getLanguages()      | Array of Strings (The languages)                    | Used for the filter functions to create the languages filter |
>| getYearRange()      | Object: {low: Number, high: Number}                 | Used to set the min and max for the years filter             |
>| getRuntimeRange()   | Object: {low: Number, high: Number}                 | Used to set the min and max for the runtime filter           |

##### filter.js

A javascript file to create filter UI elements in javascript and calls the runVis() function in index.js with the updated data based on the filters applied.

>| Variable / Function         | Type / Return                       | Description                                                  |
>| --------------------------- | ----------------------------------- | ------------------------------------------------------------ |
>| netflixColor                | '#E50914'                           | The color used for all netflix visualisaitons. This is placed here because filter.js is called first. |
>| huluColor                   | '#1CE783'                           | The color used for all hulu visualisaitons. This is placed here because filter.js is called first. |
>| disneyColor                 | '#006E99'                           | The color used for all disney visualisaitons. This is placed here because filter.js is called first. |
>| primeColor                  | '#00A8E1'                           | The color used for all prime visualisaitons. This is placed here because filter.js is called first. |
>| filters                     | Object of functions for each filter | Each key represents one filter, it maps to a function that takes one row and returns whether or not that row should be included in the visualised data set |
>| supressGenreFilter          | boolean                             | When clicking the "select all" filter for genres, it mimics clicking thorugh all the filters. To not cause the page go into overdrive, this boolean is set to true until it has finished mimicing the clicks. |
>| supressLanguageFilter       | boolean                             | When clicking the "select all" filter for languages, it mimics clicking thorugh all the filters. To not cause the page go into overdrive, this boolean is set to true until it has finished mimicing the clicks. |
>| initialiseFilters()         |                                     | Creates filters and any other HTML elements needed for the filter section of the page as soon as its opened |
>| createRatingSlider()        |                                     | Creates the rating slider in the filter div                  |
>| creatingRuntimeSlider()     |                                     | Creates the runtime slider in the filter div                 |
>| createGenreSelector()       |                                     | Creates the drop down check box list for genres in the filter div |
>| createLanguageSelector()    |                                     | Creates the drop down check box list for languages in the filter div |
>| filteredByRating()          |                                     | is called whenever a the rating slider bar is changed to update how the data should be filtered |
>| filteredByYear(min, max)    |                                     | is called whenever the year slider bar is changed to update how the data should be filtered |
>| filteredByRuntime(min, max) |                                     | is called whenever the runtime slider bar is changed to update how the data should be filtered |
>| filteredByGenre(event)      |                                     | is called whenever a value is changed in the genre check list to update how the data should be filtered |
>| filteredByLanguage(event)   |                                     | is called whenever a value is changed in the language check list to update how the data should be filtered |
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

---

# Libraries Used

* **Materialize Framework** - Creating UI elements and making them prettier 
* **NoUISlider** - Creating a rating slider for a filter 
* **D3.js (V6)**  - creating visualisations 
* **JQuery** - To create select all button for drop down check boxes 

