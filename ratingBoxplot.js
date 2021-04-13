window.renderRuntimeBoxplot = function (view) {

    const ratings = formatData(view)
    console.log(ratings)



    chart = {
        // // set the height and width used to create the visualisation but not as seen on screen
        // // get the svg and set the size of the view box
        // // TODO: Note this currently isnt stored as a svg so you may need to make one, its just a div rn

    }

    // boxes: set the min, max, q1-q3
    boxes = {
        let arrMap = Array.from(d3.group(ratings, d => d.platform), ([platform, imdb]) => ({
            platform,
            imdb
        }));
        arrMap.map(o => {
            const values = o.imdb.map(d => d.imdb);
            const min = d3.min(values);
            const max = d3.max(values);
            const q1 = d3.quantile(values, .25);
            const q2 = d3.quantile(values, .5);
            const q3 = d3.quantile(values, .75);
            const iqr = q3 - q1;
            const r0 = Math.max(min, q1 - iqr * 1);
            const r1 = Math.min(max, q3 + iqr * 1.5);
            o.quartiles = [q1, q2, q3];
            o.range = [r0, r1];
            o.outliers = values.filter(v => v < r0 || v > r1);
            return o;
        });

        return arrMap.sort((a, b) => keys.indexOf(a.key) - keys.indexOf(b.key));
    }




    // keys = [...new Set(ratings.map(x => x.platform))]
    // console.log(keys);



}




// data process
function formatData(view){
    const data = []
    for (const movie of view){
        if (movie.netflix) data.push({platform: "netflix", imdb: movie.imdb})
        if (movie.hulu) data.push({platform: "hulu", imdb: movie.imdb})
        if (movie.disney) data.push({platform: "disney", imdb: movie.imdb})
        if (movie.prime) data.push({platform: "prime", imdb: movie.imdb})
    }

    //sort it so it goes in order (idk if its needed but the example CSVs I looked at had it sorted
    data.sort((a, b) => a.platform.localeCompare(b.platform))
    return data
}
