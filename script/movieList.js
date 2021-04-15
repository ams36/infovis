// modified from: https://stackoverflow.com/questions/14643617/create-table-using-javascript
window.renderMovieList = function (view) {

    // get the div and create table and body
    let div = document.getElementById("movieList")
    div.innerText = ""
    const table = document.createElement("table")
    const tableHead = document.createElement("thead")
    const tableBody = document.createElement("tbody")

    // create the header row
    const headers = ["Movie", "Netflix", "Hulu", "Disney", "Prime"]
    const headerRow = document.createElement("tr")

    for (const h of headers){
        const headerCell = document.createElement("th")
        headerCell.appendChild(document.createTextNode(h))
        headerRow.appendChild(headerCell)
    }
    tableHead.appendChild(headerRow)
    table.appendChild(tableHead)


    const platform = ["netflix", "hulu", "disney", "prime"]

    // create rows and add cells
    for (const movie of view){
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
    table.appendChild(tableBody)
    div.appendChild(table)


}
