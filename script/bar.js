console.log("barchat")
 window.renderAgeBarplot = function (view) {

     //1、set the height and width
     const width = 500;
     const height = 450;
     const margin = { top: 25, right: 35, bottom: 100, left: 50 }; // todo:the graph is on the wrong position


     const [data, groups] = formatAges(view)
     // todo: the graph will be work, if the format of the data like below
            //todo: 1.group_age means the age of the group
            //todo: 2.the value of group means the frequency of a certain group in a certain platform

     // const data = [ //fake data
     //     {platform:"netflix", group_age1:1300, group_age2:1499, group_age3:1008},
     //     {platform:"hulu", group_age1:1289, group_age2:1098, group_age3:2988},
     //     {platform:"prime", group_age1:1289, group_age2:1098, group_age3:2988},
     //     {platform:"disney", group_age1:1289, group_age2:1098, group_age3:2988}
     // ];



     //3、colour setting
     // const colors = ['orange', 'red',"purple", "yellow", "green"];  //colour group TODO :set enough colour
     // const groups = ['netflix', 'hulu',"disney", "prime"]; //group_age means（"13+"， "18+" , "all"...）
     const colors = ['orange', 'red',"purple", "yellow", "green"];  //colour group TODO :set enough colour
     // const groups = ['group_age1', 'group_age2',"group_age3"]; //group_age means（"13+"， "18+" , "all"...）

     const layout = d3.stack().keys(groups)(data);

     const svg = d3.select('#ageBarPlots')
         .html("")
         .append('svg')
         .attr("preserveAspectRatio", "xMidYMid meet")
         .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
         // .attr('width', width + margin.left + margin.right)
         // .attr('height', height + margin.top + margin.bottom)
             .append('g')
             .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

     //4、x axis
     // x axis
     const xScale = d3.scaleBand()
             .padding(0.5)  // set the interval between bar and bar
             .domain(data.map(d => d.platform))
             .range([0, width]);

     //y axis
     const yMax = 7000;
     const yScale = d3.scaleLinear()
             .domain([0, yMax])
             .range([height, 0]);

     const xAxis = d3.axisBottom(xScale);
     const yAxis = d3.axisLeft(yScale).ticks(10);

     svg.append('g')
             .attr('transform', `translate(0, ${height})`)
             .call(xAxis)
             .selectAll('text')
             // .attr('transform', 'rotate(-45)')
             svg.append('g').call(yAxis);


     // 5、draw the bar

     svg
             .selectAll('.group')
             .data(layout)
             .enter()
             .append('g')
             .attr('platform', ({key}) => key)
             .attr('fill', (d, i) => colors[i])
             .selectAll('body')
             .data(d => d)
             .enter()
             .append('rect')
             .attr('x', ({data: {platform}}) => xScale(platform))
             .attr('y', ([y, h]) => yScale(h))
             .attr('width', xScale.bandwidth())
             .attr('height', ([y, h]) => {console.log(y, h, height); return height - yScale(h - y)});


 }


// data process
function test(view) {

    const platform = ["netflix", "hulu", "prime", "disney"]

    let results = {}
    for (const g of platform) {
        results[g] = {
            platform: g,
            A_age_group: 0, // age_group should be "13+", "18+", "all"...
            B_age_group: 0,
            C_age_group: 0,
            D_age_group: 0
        }
    }

  //  console.log(results)

    for (const movie of view) {
        for (const g of movie.age) {
            //console.log(g)
           if (g === "13+") results[g].A_age_group++

        }
    }
}

function createPlatformObject(platform, ages){
    let platformObject = {}
    platformObject.platform = platform
    for (const a of ages){
        platformObject[a] = 0
    }
    return platformObject
}

function formatAges(view){
    // get a list of the ages in the view
    const ages =  mediaData
        .map((row) => row.age)
        .flat()
        .filter((e, i, arr) => arr.indexOf(e) === i && e !== "")

    // console.log(ages)
    let results = [
        createPlatformObject("netflix", ages),
        createPlatformObject("hulu", ages),
        createPlatformObject("disney", ages),
        createPlatformObject("prime", ages)
    ]

    for (const movie of view){
        const movieAge = movie.age
        if (movieAge === "") continue
        if (movie.netflix) results[0][movieAge]++
        if (movie.hulu) results[1][movieAge]++
        if (movie.disney) results[2][movieAge]++
        if (movie.prime) results[3][movieAge]++
    }

    return [results, ages]
}


