
// modified from: https://www.d3-graph-gallery.com/graph/boxplot_several_groups.html
// particularly: changed the nest function to the updated group function to make it work properly
// keys no longer accessed, it is d[0] instead of d.key and d[1] instead of d.value

window.renderRuntimeBoxplot = function (view) {

    var data = runtime(view)
  //  console.log(data);

}



// data process
function runtime(view){
    const data = []
    for (const movie of view){
        if (movie.netflix) data.push({platform: "netflix", runtime: movie.runtime})
        if (movie.hulu) data.push({platform: "hulu", runtime: movie.runtime})
        if (movie.disney) data.push({platform: "disney", runtime: movie.runtime})
        if (movie.prime) data.push({platform: "prime", runtime: movie.runtime})
    }

    //sort it so it goes in order (idk if its needed but the example CSVs I looked at had it sorted
    data.sort((a, b) => a.platform.localeCompare(b.platform))

    return data
}
