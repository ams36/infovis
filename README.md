# Information Visualisation Project
*by Mao and Mika*

#### Important Links: 
- Trello: https://trello.com/invite/b/7O1n5UjH/24dacb2dd616e3f5a9c05e6c49842e1b/visualisation-group-project
- Chosen Data Set: https://www.kaggle.com/ruchi798/movies-on-netflix-prime-video-hulu-and-disney
- Using D3 V6: [Documentation Can Be Found Here](https://github.com/d3/d3/blob/master/API.md)

---
# Glossary 

#### mediaData (Javascript Object holding Data from the CSV)

| Tag            | Type     | Description                                                  |
| -------------- | -------- | ------------------------------------------------------------ |
| uid            | int      | Unique ID for that Movie Entry                               |
| title          | String   | Title of the Movie                                           |
| year           | int      | Year the movie was released                                  |
| age            | String*  | Currently stored as a string but will eventually be a map to a ordinal scale |
| imdb           | float    | 1-10 rating (with decimals) for IMDb Movie Rating            |
| rottenTomatoes | int      | Percent (0-100) rating for the movie from Rotten Tomatoes (not including % sign) |
| netflix        | boolean  | True if the movie is on Netflix, False if it is not on Netflix |
| hulu           | boolean  | True if the movie is on Hulu, False if it is not on Hulu     |
| prime          | boolean  | True if the movie is on Prime Video, False if it is not on Prime Video |
| disney         | boolean  | True if the movie is on Disney+, False if it is not on Disney+ |
| directors      | Array    | an array of strings for all directors for the movie          |
| genres         | String[] | an array of strings for all genres attached to the movie     |
| country        | String[] | an array of countries where the movie was produced in        |
| language       | String[] | an array of languages the movie is available in              |
| runtime        | int      | length of the movie in minutes                               |



#### Javascript File

| Variable  | Type                                                | Description                                                  |
| --------- | --------------------------------------------------- | ------------------------------------------------------------ |
| mediaData | Array of Objects (The Rows) with a Column Attribute | holds the results from the csv file (without the first column) |
|           |                                                     |                                                              |
|           |                                                     |                                                              |

#### HTML and CSS
| Description                                                  | ID                | Class       | Tag  |
| ------------------------------------------------------------ | ----------------- | ----------- | ---- |
| **First "Page" View**                                        | page1             | page        | div  |
| Page 1 spacer for the filter section (since the filter is fixed its not included in the page view and the rest of the view needs to be pushed to the side) | filterSpacer_1    | filter      | div  |
| Area for the venn diagram view                               | vennDiagram       | vennDiagram | div  |
| a list of all movies for the results with check boxes to indicate which platforms its avialable on | movieList         | movieList   | div  |
| **Second "Page" View**                                       | page2             | page        | div  |
| A quick view of statistics for Netflix                       | netflixQuickstats | quickStats  | div  |
| A quick view of statistics for Hulu                          | huluQuickstats    | quickStats  | div  |
| A quick view of statistics for Disney+                       | disneyQuickstats  | quickStats  | div  |
| A quick view of statistics for Amazon Prime                  | primeQuickstats   | quickStats  | div  |


---
# Javascript Functions 





| Function Name | Parameters | Return                               | Description                                                  |
| ------------- | ---------- | ------------------------------------ | ------------------------------------------------------------ |
| loadData()    |            | `PromiseLike<void> or Promise<void>` | Reads in Data from the CSV file and returns a promise of the data |
| runVis()      |            |                                      |                                                              |
|               |            |                                      |                                                              |



