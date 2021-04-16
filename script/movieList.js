// modified from: https://stackoverflow.com/questions/14643617/create-table-using-javascript
window.renderMovieList = function (view) {

    const rowsPerPage = 10
    let currentPage = 0


    // get the div and create table and body
    let div = document.getElementById("movieList")
    div.innerText = ""

    const header = document.createElement("h4")
    header.innerHTML = '<h4> Movie Count: ' + view.length + ' </h4>'
    const table = document.createElement("table")
    const tableHead = document.createElement("thead")
    const tableBody = document.createElement("tbody")

    let nextPageButton = document.createElement("button")
    nextPageButton.innerText = "Next Page"
    nextPageButton.onclick = () => {
        if ((currentPage + 1) * rowsPerPage > view.length) return
        currentPage ++
        changeMoviePage(tableBody, currentPage, rowsPerPage)
    }

    let previousPageButton = document.createElement("button")
    previousPageButton.innerText = "Previous Page"
    previousPageButton.onclick = () => {
        if ((currentPage - 1) < 0) return
        currentPage --
        changeMoviePage(tableBody, currentPage, rowsPerPage)
    }

    // create the header row
    const headers = ["Movie", "N", "H", "D", "P"]
    const headerRow = document.createElement("tr")

    for (const h of headers){
        const headerCell = document.createElement("th")
        headerCell.appendChild(document.createTextNode(h))
        headerRow.appendChild(headerCell)
    }
    tableHead.appendChild(headerRow)
    table.appendChild(tableHead)

    changeMoviePage(tableBody, currentPage, rowsPerPage)

    table.appendChild(tableBody)
    div.appendChild(header)
    div.appendChild(table)
    div.appendChild(previousPageButton)
    div.appendChild(nextPageButton)


}

function changeMoviePage(tableBody, currentPage, rowsPerPage){
    tableBody.innerText = ""

    const platform = ["netflix", "hulu", "disney", "prime"]

    // create rows and add cells
    for (const movie of view.slice(rowsPerPage * currentPage, rowsPerPage * (currentPage + 1))){
        const row = document.createElement("tr")
        const movieCell= document.createElement("td")
        movieCell.appendChild(document.createTextNode(movie.title))
        row.appendChild(movieCell)
        for (const p of platform){
            const cell = document.createElement("td")
            if (movie[p]) cell.appendChild(document.createTextNode("☑"))
            else cell.appendChild(document.createTextNode(""))
            row.appendChild(cell)
        }
        tableBody.appendChild(row)
    }
}