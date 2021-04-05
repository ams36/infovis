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
>| runVis()            | calls all visualisation functions to make vis       |                                                              |

##### sharedTitles.js

Javscript file to render the chord visualisation of shared titles between platforms. It takes in the view stored in Index.js. 

>| Variable / Function | Type / Return           | Description                                                  |
>| ------------------- | ----------------------- | ------------------------------------------------------------ |
>| connections         | Number[ ] [ ]           | matrix version of the data needed for a chord diagram in d3  |
>| names               | String[ ]               | the names of each platform in the same order as the matrix   |
>| formatMatrix()      | return ```Number[][]``` | takes the view that sharedTitles was passed, counts the number of exclusive and shared titles between the platforms, and returns the matrix version of the data |

##### filter.js

A javascript file to create filter UI elements in javascript and calls the runVis() function in index.js with the updated data based on the filters applied.

>| Variable / Function | Type / Return                       | Description                                                  |
>| ------------------- | ----------------------------------- | ------------------------------------------------------------ |
>| filters             | Object of functions for each filter | Each key represents one filter, it maps to a function that takes one row and returns whether or not that row should be included in the visualised data set |
>| initialiseFilters() |                                     | Creates filters and any other HTML elements needed for the filter section of the page as soon as its opened |
>| filteredByRating    | calls applyFilters() on completion  | Updates the filters.rating key to a new function that checks if a records rating is in the given range |
>|                     |                                     |                                                              |
>|                     |                                     |                                                              |

### HTML and CSS

| Description                                                  | ID                | Class        | Tag  |
| ------------------------------------------------------------ | ----------------- | ------------ | ---- |
| **Fixed Filter Bar**                                         | filter            | filter       | div  |
| Slider for filtering by rating (Eventually becomes a NoUISlider in filter.js) | ratingSlider      |              | div  |
| **First "Page" View**                                        | page1             | page         | div  |
| Page 1 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_1    | filter       | div  |
| Area for the Chord Diagram View                              | chordDiagram      | chordDiagram | div  |
| SVG to be updated for Chord Diagram Shared Titles (child element of chordDiagram) | sharedTitles      | sharedTitles | svg  |
| a list of all movies for the results with check boxes to indicate which platforms its avialable on | movieList         | movieList    | div  |
| **Second "Page" View**                                       | page2             | page         | div  |
| Page 2 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_2    | filter       | div  |
| A quick view of statistics for Netflix                       | netflixQuickstats | quickStats   | div  |
| A quick view of statistics for Hulu                          | huluQuickstats    | quickStats   | div  |
| A quick view of statistics for Disney+                       | disneyQuickstats  | quickStats   | div  |
| A quick view of statistics for Amazon Prime                  | primeQuickstats   | quickStats   | div  |

---

# Libraries Used

* **Materialize Framework** - Creating UI elements and making them prettier 
* **NoUISlider** - Creating a rating slider for a filter 
* **D3.js (V6)**  - creating visualisations 

