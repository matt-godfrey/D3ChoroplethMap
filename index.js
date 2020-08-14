window.addEventListener('DOMContentLoaded', function() {

const mapReq = new XMLHttpRequest();
const eduDataReq = new XMLHttpRequest();

const geoURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

const svg = d3.select('svg')
  
const colours = ["#ffe0ba", "#ffbf70", "#ffac45", "#f7961e", "#e37e00", "#b06200", "#613600"]
const width = +svg.attr('width');
const height = +svg.attr('height');

let countyData;
let educationData;
    
let path = d3.geoPath();

let makeMap = (data) => {
    
    let toolTip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('position', 'absolute')

    svg.selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('d', path)
        .attr('data-fips', (d, i) => { return educationData[i].fips; })
        .attr('data-education', (d, i) => { return educationData[i].bachelorsOrHigher; })
        .attr('fill', (d, i) => {
            let stat = educationData[i].bachelorsOrHigher
           
            if (stat <= 5) {
    return '#ffe0ba'
}
else if (stat > 5 && stat <= 15) {
    return '#ffbf70'
}
else if (stat > 15 && stat <= 25) {
    return '#ffac45'
}
else if (stat > 25 && stat <= 35) {
    return '#f7961e'
}
else if (stat > 35 && stat <= 45) {
    return '#e37e00'
}
else if (stat > 45 && stat <= 55) {
    return '#b06200'
}
else if (stat > 55) {
    return '#613600'
}
})
.on('mouseover', (d, i) => {

toolTip.transition()
    .duration(50)
    .style('visibility', 'visible')
    .attr('data-education', educationData[i].bachelorsOrHigher)
    .style('left', `${d3.event.pageX}`+"px")
    .style('top', `${d3.event.pageY}`+"px")
    .style('opacity', '0.8')
    .style('background-color', 'red')
    .style('font-size', 'small')
    .style('color', 'white')
    

    toolTip.text(educationData[i].area_name + ", " + educationData[i].state + ": " + educationData[i].bachelorsOrHigher + "%")
            .style('padding', '10px')

})
.on('mouseout', (d, i) => {
    toolTip.transition()
        .duration(50)
        .style('visibility', 'hidden')
})



   
}

let makeLegend = () => {
  var legend = svg.append('g')
        .attr('id', 'legend')
        .attr('width', '340px')
        .attr('transform', 'translate('+ (width - 430) +', '+ (10) +')')

legend.selectAll('rect').data(colours).enter()
    .append('rect')
    .attr('height', '20px')
    .attr('width', '40px')
    .attr('class', 'rect')
    .attr('x', (d, i) => { return i * 40 })
    .attr('y', 10)
    .attr('fill', (d, i) => { return colours[i] })

legend.selectAll('line').data(colours).enter()
    .append('line')
    .attr('class', 'line')
    .attr('x1', (d, i) => { return i * 40 })
    .attr('y1', 10)
    .attr('x2', (d, i) => { return i * 40 })
    .attr('y2', 35)
    .style('stroke-width', '1px')
    .style('stroke', 'black')

legend.selectAll('text').data(colours).enter()
    .append('text')
    .attr('x', (d, i) => { 
        if (i === 0) {
            return -6
        } else {
            return i * 38
        }
     })
    .attr('y', 50)
    .style('font-size', '11px')
    .style('font-family', "Spectral")
    .text(function(d, i) {
        if (i === 0) {
            return "2.5%"
        } else if (i === 1) {
            return "5%"
        } else if (i === 2) {
            return "15%"
        } else if (i === 3) {
            return "25%"
        } else if (i === 4) {
            return "35%"
        } else if (i === 5) {
            return "45%"
        } else {
            return "55%"
        }

    })
}

eduDataReq.open('GET', educationURL, true);
eduDataReq.send();
eduDataReq.onload = function() {
    educationData = JSON.parse(eduDataReq.responseText)
    }

mapReq.open('GET', geoURL, true);
mapReq.send();
mapReq.onload = function() {
   let json = JSON.parse(mapReq.responseText)
    countyData = topojson.feature(json, json.objects.counties).features
    
    console.log(educationData)
    console.log(countyData)
    makeMap(countyData);
    makeLegend();
}

})


