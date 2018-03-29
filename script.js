var SVG_HEIGHT = 950;
var SVG_WIDTH = 1100;
var DETAILS_WIDTH = 280;
var TEAM_SPACING = 3;
var DETAILS_TEAM_SPACING = 10;
var ROUND_HEIGHT = 120;
var FLAG_WIDTH = 25;
var DETAILS_FLAG_WIDTH = 100;
var TIMELINE_BAR_WIDTH = 10;
var FIRST_MATCH = true;
var flagLinks = [];

function drawRound16(matchNum, roundHeading, matchesData, matchLayer) {

    var numberOfMatches = matchesData.length;
    var matchWidth = SVG_WIDTH / numberOfMatches;

    var round = matchLayer.append("g")
    .attr("class", "round")
    .attr("transform", "translate(0," + matchNum * ROUND_HEIGHT + ")")
    
    var roundHeader = round.append("text")
    .attr("class", "round-header")
    .attr("x", SVG_WIDTH/2)
    .attr("y", 10)
    .style("text-anchor", "middle")
    .text(roundHeading)

    var matches = round.append("g").attr("class", "matches")
    .attr("transform", "translate(0, 20)")

    var match = matches.selectAll(".match")
    .data(matchesData).enter()
    .append("g").attr("class", "match")
    .attr("transform", (d, idx) => "translate(" +  idx*matchWidth + ",0)");

    var hometeam = match.append("g").attr("class", "home-team")
    .attr("transform", "translate(" + (matchWidth/2-25-TEAM_SPACING) + ", 5)")

    hometeam.append("rect")
    .attr("class", "flag")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 25)
    .attr("height", 15)
    .attr("fill", (d) => "url(#countryName" + d.homeFlagID + ")")

    hometeam.append("text")
    .attr("class", "team-label")
    .attr("x", 25)
    .attr("y", 30)
    .style("text-anchor", "end")
    .text((d) => d.home)

    hometeam.append("text")
    .attr("class", "goal-label")
    .attr("x", 12)
    .attr("y", 50)
    .style("text-anchor", "middle")
    .text((d) => d.homeScore)

    var awayteam = match.append("g").attr("class", "away-team")
    .attr("transform", "translate(" + (matchWidth/2+TEAM_SPACING) + ", 5)")

    awayteam.append("rect")
    .attr("class", "flag")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 25)
    .attr("height", 15)
    .attr("fill", (d) => "url(#countryName" + d.awayFlagID + ")")

    awayteam.append("text")
    .attr("class", "team-label")
    .attr("x", 0)
    .attr("y", 30)
    .style("text-anchor", "start")
    .text((d) => d.away)

    awayteam.append("text")
    .attr("class", "goal-label")
    .attr("x", 12)
    .attr("y", 50)
    .style("text-anchor", "middle")
    .text((d) => d.awayScore)

    match.append("rect")
    .attr("class", "match-rect")
    .attr("width", matchWidth)
    .attr("height", 70)
    .attr("stroke", "black")
    .style("fill", function() {
        if (FIRST_MATCH) {
            FIRST_MATCH = false;
            return "white"
        } else {
            return "black"
        }})
    .style("opacity", 0.1)
    .on("click", function(d) {
        d3.selectAll(".match-rect").style("fill", "black")
        d3.select(this).style("fill", "white")
        populateDetails(d,  matchNum * ROUND_HEIGHT, generateTimeline(40))
    });
}

function populateDetails(selectedMatch, yPosition, detailsMatches) {

    d3.select("#details").selectAll("*").remove();

    // set Width and Height for details container
    d3.select("#details").style("width", DETAILS_WIDTH);
    var svgDetails =  d3.select("#details").append("svg")
    .attr("width", DETAILS_WIDTH)
    .attr("height", (detailsMatches.length+2)*TIMELINE_BAR_WIDTH + 160)
    .attr("transform", "translate(0," + yPosition + ")")
    .style("background-color", "rgba(255, 255, 255, 0.1)")

    var details = svgDetails.append("g")

    var detailsHeader = details.append("g").attr("class", "details-header")
    .attr("transform", "translate(0, 20)")

    var hometeam = detailsHeader.append("g").attr("class", "home-team")
    .attr("transform", "translate(" + (DETAILS_WIDTH/2-DETAILS_FLAG_WIDTH-DETAILS_TEAM_SPACING) + ", 0)")

    hometeam.append("rect")
    .attr("class", "flag")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", DETAILS_FLAG_WIDTH)
    .attr("height", DETAILS_FLAG_WIDTH * 0.6)
    .attr("fill", "url(#countryNameBigger" + selectedMatch.homeFlagID + ")")

    hometeam.append("text")
    .attr("class", "team-label")
    .attr("x", DETAILS_FLAG_WIDTH)
    .attr("y", 80)
    .style("text-anchor", "end")
    .text(selectedMatch.home)

    hometeam.append("text")
    .attr("class", "goal-label")
    .attr("x", 77)
    .attr("y", 100)
    .style("text-anchor", "middle")
    .text(selectedMatch.homeScore)

    var awayteam = detailsHeader.append("g").attr("class", "away-team")
    .attr("transform", "translate(" + (DETAILS_WIDTH/2+DETAILS_TEAM_SPACING) + ", 0)")

    awayteam.append("rect")
    .attr("class", "flag")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", DETAILS_FLAG_WIDTH)
    .attr("height", DETAILS_FLAG_WIDTH * 0.6)
    .attr("fill", "url(#countryNameBigger" + selectedMatch.awayFlagID + ")")

    awayteam.append("text")
    .attr("class", "team-label")
    .attr("x", 0)
    .attr("y", 80)
    .style("text-anchor", "start")
    .text(selectedMatch.away)

    awayteam.append("text")
    .attr("class", "goal-label")
    .attr("x", 22)
    .attr("y", 100)
    .style("text-anchor", "middle")
    .text(selectedMatch.awayScore)

    var timeline = details.append("g").attr("class", "details-timeline")
    .attr("transform", "translate(" + 0 + "," +  140 + ")")

    timeline.append("rect")
    .attr("class", "timeline-rect")
    .attr("width", DETAILS_WIDTH)
    .attr("height", (detailsMatches.length+2) * TIMELINE_BAR_WIDTH)
    .style("opacity", 0.1);

    var xScale = d3.scaleLinear().domain([0, 10]).range([DETAILS_WIDTH/2, DETAILS_WIDTH]);
    var yScale = d3.scaleLinear().domain([0, detailsMatches.length-1]).range([TIMELINE_BAR_WIDTH, TIMELINE_BAR_WIDTH*(detailsMatches.length+1)]);

    detailsMatches.forEach(function (d, idx) {
        var timelineMatch = timeline.append("g")
        .attr("class", "timeline-match")

        timelineMatch.append("line")
        .attr("class", "timeline-home-score timeline-" + idx)
        .style("stroke-width", TIMELINE_BAR_WIDTH)
        .attr("stroke", "red" )
        .attr("opacity", 0.7)
        .attr("x1", xScale(0))
        .attr("x2", xScale(-d.homeScore))
        .attr("y1", 0)
        .attr("y2", 0)
        .transition().delay(1000).duration(1000)
        .attr("y1", yScale(idx))
        .attr("y2", yScale(idx))

        timelineMatch.append("line")
        .attr("class", "timeline-away-score timeline-" + idx)
        .style("stroke-width", TIMELINE_BAR_WIDTH)
        .attr("stroke", "green" )
        .attr("opacity", 0.7)
        .attr("x1", xScale(0))
        .attr("x2", xScale(d.awayScore))
        .attr("y1", 0)
        .attr("y2", 0)
        .transition().delay(1000).duration(1000)
        .attr("y1", yScale(idx))
        .attr("y2", yScale(idx))

        timelineMatch.append("rect")
        .attr("class", "timeline-rect-" + idx)
        .attr("height", TIMELINE_BAR_WIDTH)
        .attr("width", DETAILS_WIDTH)
        .attr("x", 0)
        .attr("y", yScale(idx) - TIMELINE_BAR_WIDTH*0.5)
        .attr("fill", "grey")
        .attr("opacity", 0)
        .on("mouseover", function() {
            d3.selectAll(".timeline-rect-"+idx).attr("opacity", 0.2)
            d3.selectAll(".timeline-"+idx).attr("opacity", 1.0)
        })
        .on("mouseout", function() {
            d3.selectAll(".timeline-rect-"+idx).attr("opacity", 0)
            d3.selectAll(".timeline-"+idx).attr("opacity", 0.7)
        })
    });

    timeline.append("line")
    .style("stroke-width", 1)
    .attr("x1", DETAILS_WIDTH/2)
    .attr("x2", DETAILS_WIDTH/2)
    .attr("y1", 0)
    .attr("y2", (detailsMatches.length+2)*TIMELINE_BAR_WIDTH)
    .attr("stroke", "black")
}

// Dummy Data Generation
var randomScore = () => Math.floor(Math.random() * 10);
var generateMatches = function (size) {
    dummyData = []
    for(var i = 0; i < size; i++) {
        dummyData.push({home: "HOM", away: "AWA", homeScore: randomScore(), awayScore: randomScore(), homeFlagID: randomScore(), awayFlagID: randomScore()})
    }
    return dummyData;
}

// Dummy Data Generation
var randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
var generateTimeline = function (size) {
    dummyData = []
    for(var i = 0; i < size; i++) {
        dummyData.push({"homeScore": randomScore(), awayScore: randomScore(), "date": randomDate(new Date(1928, 1, 1), new Date())})
    }
    return dummyData;
}

d3.select("#tournament").style("width", SVG_WIDTH)
d3.select("#trophy").style("width", SVG_WIDTH)
d3.select("#credits").style("width", SVG_WIDTH)

var svg = d3.select("#tournament").append("svg")
.attr("width", SVG_WIDTH)
.attr("height",  SVG_HEIGHT)

d3.queue()
.defer(d3.csv, "countries_flag_links.csv")
.await(ready);

function ready(error, flags){
    var defs = svg.append("defs");
    flagLinks = flags;
    flagLinks.forEach(function (flag, idx) {
        defs.append("pattern")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", "countryName" + idx)
        .attr("patternUnits", "userSpaceOnUse")
        .append("image")
        .attr("width", 25)
        .attr("height", 15)
        .attr("xlink:href", flag.url)

        defs.append("pattern")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", "countryNameBigger" + idx)
        .attr("patternUnits", "userSpaceOnUse")
        .append("image")
        .attr("width", DETAILS_FLAG_WIDTH)
        .attr("height", DETAILS_FLAG_WIDTH * 0.6)
        .attr("xlink:href", flag.url)
    })
    var grpMatch1 = generateMatches(16)
    var matchLayer = svg.append("g").attr("class", "match-layer")
    drawRound16(0, "Group Stage Match #1", grpMatch1, matchLayer);
    drawRound16(1, "Group Stage Match #2", generateMatches(16), matchLayer);
    drawRound16(2, "Group Stage Match #3", generateMatches(16), matchLayer);
    drawRound16(3, "Round of 16", generateMatches(8), matchLayer);
    drawRound16(4, "Quarter Finals", generateMatches(4), matchLayer);
    drawRound16(5, "Semi Finals", generateMatches(2), matchLayer);
    drawRound16(6, "", generateMatches(2), matchLayer);

    var championRound = matchLayer.append("g")
    .attr("class", "round")
    .attr("transform", "translate(0," + (7 * ROUND_HEIGHT + 50) + ")")

    var championLabel = championRound.append("text")
    .attr("class", "round-header")
    .attr("x", SVG_WIDTH/2)
    .attr("y", 10)
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("CHAMPIONS")

    var championNation = championRound.append("text")
    .attr("class", "round-header")
    .attr("x", SVG_WIDTH/2)
    .attr("y", 32)
    .style("font-size", "16px")
    .style("text-anchor", "middle")
    .text("GERMANY")

    populateDetails(grpMatch1[0], 0, generateTimeline(40))
}