# Information Visualisation Project
*by Mao and Mika*

#### Important Links: 
- Trello: https://trello.com/invite/b/7O1n5UjH/24dacb2dd616e3f5a9c05e6c49842e1b/visualisation-group-project
- Chosen Data Set: https://www.kaggle.com/ruchi798/movies-on-netflix-prime-video-hulu-and-disney
- Using D3 V6: [Documentation Can Be Found Here](https://github.com/d3/d3/blob/master/API.md)

---
# Glossary 

####Javascript File
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



