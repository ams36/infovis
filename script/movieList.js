// sources used: https://stackoverflow.com/questions/14643617/create-table-using-javascript

/**
 * creates the table for the movie list shown in the overview page
 * @param view the filtered version of the data to be shown
 */
window.renderMovieList = function (view) {

    // can be modified, but just chose to show 20 rows on a page
    const rowsPerPage = 20

    // since we cant show 16000+ movies in one div, add paging to it and set the first current page to 0
    let currentPage = 0

    //***********************
    // Creating The table
    //************************
    // get the div
    let div = document.getElementById("movieList")
    // empty the div in case theres already something in it
    div.innerText = ""
    // create a div to hold the table to make scrolling work properly
    let tb = document.createElement('div');
    tb.classList = 'table-fix'
    // add a header
    const header = document.createElement("h4")
    header.innerHTML = 'Movie Count: ' + view.length + '<br><small>Showing 20 records per page</small>'
    // create a table, body and head
    const table = document.createElement("table")
    const tableHead = document.createElement("thead")
    const tableBody = document.createElement("tbody")


    //*******************************************
    // Creating the next and previous page buttons
    //*******************************************

    // next page
    let nextPageButton = document.createElement("button")
    nextPageButton.innerText = "Next Page"
    nextPageButton.classList = 'btn';
    nextPageButton.onclick = () => {
        // if they try to click beyond what can be shown, return
        if ((currentPage + 1) * rowsPerPage > view.length) return
        currentPage ++
        changeMoviePage(tableBody, currentPage, rowsPerPage)
    }

    // previous page
    let previousPageButton = document.createElement("button")
    previousPageButton.innerText = "Previous Page"
    previousPageButton.classList = 'btn';
    previousPageButton.onclick = () => {
        // if they try to click beyond what can be shown, return
        if ((currentPage - 1) < 0) return
        currentPage --
        changeMoviePage(tableBody, currentPage, rowsPerPage)
    }

    //*******************************************
    // Adding Headers to the Table
    //*******************************************
    // create the header row
    const headers = ["Movie", "N", "H", "D", "P"]
    const headerRow = document.createElement("tr")

    // for each element in the header row, append a cell
    for (const h of headers){
        const headerCell = document.createElement("th")
        headerCell.appendChild(document.createTextNode(h))
        headerRow.appendChild(headerCell)
    }

    // add it to the table
    tableHead.appendChild(headerRow)
    table.appendChild(tableHead)

    //***********************************************
    // Populate the table and append the results
    //***********************************************
    changeMoviePage(tableBody, currentPage, rowsPerPage)

    // append everything to the page
    table.appendChild(tableBody)
    div.appendChild(header)
    tb.appendChild(table)
    div.appendChild(tb)
    div.appendChild(previousPageButton)
    div.appendChild(nextPageButton)


}

// sets the page that to be shown
function changeMoviePage(tableBody, currentPage, rowsPerPage){
    // empty it in case theres anything already there (because headers and buttons do not get deleted)
    tableBody.innerText = ""

    // hold an array of the platforms to be used for the order the table is visualised in
    const platform = ["netflix", "hulu", "disney", "prime"]

    // populate the table
    for (const movie of view.slice(rowsPerPage * currentPage, rowsPerPage * (currentPage + 1))){
        // create a row
        const row = document.createElement("tr")
        // create a cell to hold the movie name
        const movieCell= document.createElement("td")
        // add movie name as text to the cell
        movieCell.appendChild(document.createTextNode(movie.title))
        // add the cell to the row
        row.appendChild(movieCell)
        // for each of the platforms, add a check mark or an empty box to show if they are on that platform
        for (const p of platform){
            const cell = document.createElement("td")
            if (movie[p]) cell.appendChild(document.createTextNode("☑"))
            else cell.appendChild(document.createTextNode("☐"))
            row.appendChild(cell)
        }
        // add row to tableBody
        tableBody.appendChild(row)
    }
}