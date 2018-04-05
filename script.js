var SVG_HEIGHT = 950;
var SVG_WIDTH = 1100;
var DETAILS_WIDTH = 280;
var TEAM_SPACING = 2;
var DETAILS_TEAM_SPACING = 5;
var ROUND_HEIGHT = 120;
var FLAG_WIDTH = 25;
var DETAILS_FLAG_WIDTH = 100;
var TIMELINE_BAR_WIDTH = 15;
var FIRST_MATCH = false;
var flagData, grpMatches, historicalMatches;


function drawRound16(roundHeading, matchesData, matchLayer, roundHeight) {

    var numberOfMatches = matchesData.length;
    var matchWidth = SVG_WIDTH / numberOfMatches;

    var round = matchLayer.append("g")
    .attr("class", "round")
    .attr("transform", "translate(0," + roundHeight + ")")
    
    var roundHeader = round.append("text")
    .attr("class", "round-header")
    .attr("x", SVG_WIDTH/2)
    .attr("y", 5)
    .style("text-anchor", "middle")
    .style("alighment-basline", "middle")
    .text(roundHeading)

    var matches = round.append("g").attr("class", "matches")
    .attr("transform", "translate(0, 20)")

    var match = matches.selectAll(".match")
    .data(matchesData).enter()
    .append("g").attr("class", "match")
    .attr("transform", (d, idx) => "translate(" + idx*matchWidth + ",0)");

    match.append("rect")
    .attr("class", "match-rect")
    .attr("transform", "translate(" + (matchWidth/2-30) + ",0)")
    .attr("width", 60)
    .attr("height", 60)
    .attr("stroke", "E4C484")
    .style("fill", function() {
        if (FIRST_MATCH) {
            FIRST_MATCH = false;
            return "#E4C484"
        } else {
            return "#103673"
        }})
    .style("opacity", 0.7)
    .on("click", function(d) {
        d3.selectAll(".match-rect").style("fill", "#103673")
        d3.select(this).style("fill", "#E4C484")
        populateDetails(d)
    });


    ['home', 'away'].forEach(function (side) {
        var team = match.append("g").attr("class", side + "-team")
        .attr("transform", "translate(" + (matchWidth/2-25-TEAM_SPACING) + ", 5)")

        team.append("rect")
        .attr("class", "flag")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 25)
        .attr("height", 15)
        .attr("fill", (d) => "url(#countryName" + randomScore() + ")")
        
        var teamLabel = team.append("text")
        .attr("class", "team-label")
        .attr("x", 12.5)
        .attr("y", 30)
        .style("text-anchor", "middle")
        .text((d) => d[side].name.slice(0,3).toUpperCase())
    
        var goalLabel = team.append("text")
        .attr("class", "goal-label")
        .attr("x", 12.5)
        .attr("y", 47.5)
        .style("text-anchor", "middle")
        .text((d) => d[side].score)
        
        if (side == "away") {
            team.attr("transform", "translate(" + (matchWidth/2+TEAM_SPACING) + ", 5)")
            teamLabel.attr("x", 12.5).style("text-anchor", "middle")
        }
    })
}

function populateDetails(selectedMatch) {

    d3.select("#details").selectAll("*").remove();

    // set Width and Height for details container
    d3.select("#details").style("width", DETAILS_WIDTH);
    var svgDetails =  d3.select("#details").append("svg")
    .attr("width", DETAILS_WIDTH)
    .attr("height", 800)

    var details = svgDetails.append("g");

    var detailsHeader = details.append("g")
    .attr("class", "details-header");

    var detailsTitle = detailsHeader
    .append("image")
    .attr("width", DETAILS_WIDTH/2)
    .attr("x" ,140-DETAILS_WIDTH/4)
    .attr("y", 0)
    .attr("xlink:href", "./images/detail_match_header.svg");

    var soccerField = detailsHeader
    .append("image")
    .attr("width", DETAILS_WIDTH)
    .attr("y", 200)
    .attr("xlink:href", "./images/football_field.svg");

    ['home', 'away'].forEach(function (side) {
        var team = detailsHeader.append("g").attr("class", side + "-team")
        .attr("transform", "translate(" + (DETAILS_WIDTH/2-DETAILS_FLAG_WIDTH-DETAILS_TEAM_SPACING) + ",0)")

        team.append("rect")
        .attr("class", "flag")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", DETAILS_FLAG_WIDTH)
        .attr("height", DETAILS_FLAG_WIDTH * 0.6)
        .attr("fill", "url(#countryNameBigger" + selectedMatch[side]+randomScore() + ")")
        .attr("transform", "translate(0, 70)")
        
        var teamLabel = team.append("text")
        .attr("class", "team-label")
        .attr("x", DETAILS_FLAG_WIDTH/2)
        .attr("y", 155)
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text(selectedMatch[side].name)
    
        var goalLabel = team.append("text")
        .attr("class", "goal-label")
        .attr("x", DETAILS_FLAG_WIDTH/2)
        .attr("y", 185)
        .style("font-size", "30px")
        .style("text-anchor", "middle")
        .text(selectedMatch[side].score)

        if (side == "away") {
            team.attr("transform", "translate(" + (DETAILS_WIDTH/2+DETAILS_TEAM_SPACING) + ",0)")
        }
    })

    if (selectedMatch['history'].length == 0) {
        var noHistory = details.append("text")
        .attr("class", "no-history")
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        
        noHistory.append("tspan")
        .attr("x", DETAILS_WIDTH/2)
        .attr("y", 310)
        .text("Both team have never met")

        noHistory.append("tspan")
        .attr("x", DETAILS_WIDTH/2)
        .attr("y", 325)
        .text("before in the past 90 years.")

    } else {

        var detailsMatches = []
        var homeAway = selectedMatch['history'][0]
        var awayHome = selectedMatch['history'][1]
        
        if (homeAway != null) {
            if (homeAway.Competitive != null) {
                homeAway.Competitive.forEach(function (match) {
                    detailsMatches.push({
                        home: {score: match.home_score}, 
                        away: {score: match.away_score},
                        date: match.Date,
                        tournament: "Competitive"
                    })
                })
            }
            if (homeAway.Friendly != null) {
                homeAway.Friendly.forEach(function (match) {
                    detailsMatches.push({
                        home: {score: match.home_score}, 
                        away: {score: match.away_score},
                        date: match.Date,
                        tournament: "Friendly"
                    })
                })
            }
        }

        if (awayHome != null) {
            if (awayHome.Competitive != null) {
                awayHome.Competitive.forEach(function (match) {
                    detailsMatches.push({
                        home: {score: match.away_score}, 
                        away: {score: match.home_score},
                        date: match.Date,
                        tournament: "Competitive"
                    })
                })
            }
            if (awayHome.Friendly != null) {
                awayHome.Friendly.forEach(function (match) {
                    detailsMatches.push({
                        home: {score: match.away_score}, 
                        away: {score: match.home_score},
                        date: match.Date,
                        tournament: "Friendly"
                    })
                })
            }
        }

        console.log(detailsMatches)

        detailsMatches.sort((x, y) => d3.ascending(x.date, y.date))

        var timeline = details.append("g").attr("class", "details-timeline")
        .attr("transform", "translate(" + 0 + "," +  300 + ")")

        timeline.append("rect")
        .attr("class", "timeline-rect")
        .attr("width", DETAILS_WIDTH)
        .attr("height", (detailsMatches.length+2) * TIMELINE_BAR_WIDTH)
        .style("opacity", 0);

        var xScale = d3.scaleLinear().domain([0, 9]).range([DETAILS_WIDTH/2, DETAILS_WIDTH]);
        var yScale = d3.scaleLinear().domain([0, detailsMatches.length-1])
        .range([TIMELINE_BAR_WIDTH, TIMELINE_BAR_WIDTH*(detailsMatches.length+1)]);

        detailsMatches.forEach(function (d, idx) {
            var timelineMatch = timeline.append("g")
            .attr("class", "timeline-match")

            timelineMatch.append("line")
            .attr("class", "timeline-home-score timeline-" + idx)
            .style("stroke-width", TIMELINE_BAR_WIDTH)
            .attr("stroke", "#E4C484" )
            .attr("opacity", 0.7)
            .attr("x1", xScale(0)-15)
            .attr("x2", xScale(-d.home.score)-15)
            .attr("y1", 0)
            .attr("y2", 0)
            .transition().delay(0).duration(1000)
            .attr("y1", yScale(idx))
            .attr("y2", yScale(idx))

            timelineMatch.append("line")
            .attr("class", "timeline-away-score timeline-" + idx)
            .style("stroke-width", TIMELINE_BAR_WIDTH)
            .attr("stroke", "#E4C484" )
            .attr("opacity", 0.7)
            .attr("x1", xScale(0)+15)
            .attr("x2", xScale(d.away.score)+15)
            .attr("y1", 0)
            .attr("y2", 0)
            .transition().delay(0).duration(1000)
            .attr("y1", yScale(idx))
            .attr("y2", yScale(idx))

            timelineMatch.append("text")
            .attr("class", "timeline-score-" + idx)
            .attr("x", DETAILS_WIDTH/2)
            .attr("y", 0)
            .transition().delay(0).duration(1000)
            .attr("y", yScale(idx)+2)
            .style("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text(d.home.score + ":" + d.away.score)

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

    }
}

// Dummy Data Generation
var randomScore = () => Math.floor(Math.random() * 10);

// Dummy Data Generation
var randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
var generateTimeline = function (size) {
    dummyData = []
    for(var i = 0; i < size; i++) {
        dummyData.push({
            home: {score: randomScore()}, 
            away: {score: randomScore()},
            date: randomDate(new Date(1928, 1, 1), new Date())
        });
    }
    return dummyData;
}

var controls = d3.select("#controls")
d3.select("#tournament").style("width", SVG_WIDTH)
d3.select("#trophy").style("width", SVG_WIDTH)
d3.select("#credits").style("width", SVG_WIDTH)

var svg = d3.select("#tournament").append("svg")
.attr("width", SVG_WIDTH)
.attr("height",  SVG_HEIGHT)

d3.queue()
.defer(d3.csv, "./data/countries_flag_links.csv")
.defer(d3.csv, "./data/groups_flags.csv")
.defer(d3.csv, "./data/wc_2018_grp_schedule.csv")
.defer(d3.csv, "./data/history_2018.csv")
.await(ready);

function matchPrediction(homeTeam, awayTeam, homeAwayHistory) {

    var homeGoals = {Competitive: [], Friendly:[]};
    var awayGoals = {Competitive: [], Friendly:[]};
    var history = [];
    var homeAway = homeAwayHistory[homeTeam][awayTeam];
    var awayHome = homeAwayHistory[awayTeam][homeTeam];

    if (homeAway != null) { 
        history = history.concat(homeAway) 
        if (homeAway.Competitive != null) {
            homeGoals.Competitive = homeGoals.Competitive.concat(homeAway.Competitive.map((d) => d.home_score));
            awayGoals.Competitive = awayGoals.Competitive.concat(homeAway.Competitive.map((d) => d.away_score));
        }
        if (homeAway.Friendly != null) {
            homeGoals.Friendly = homeGoals.Friendly.concat(homeAway.Friendly.map((d) => d.home_score));
            awayGoals.Friendly = awayGoals.Friendly.concat(homeAway.Friendly.map((d) => d.away_score));
        }
    }
    if (awayHome != null) { 
        history = history.concat(awayHome) 
        if (awayHome.Competitive != null) {
            homeGoals.Competitive = homeGoals.Competitive.concat(awayHome.Competitive.map((d) => d.away_score));
            awayGoals.Competitive = awayGoals.Competitive.concat(awayHome.Competitive.map((d) => d.home_score));
        }
        if (awayHome.Friendly != null) {
            homeGoals.Friendly = homeGoals.Friendly.concat(awayHome.Friendly.map((d) => d.away_score));
            awayGoals.Friendly = awayGoals.Friendly.concat(awayHome.Friendly.map((d) => d.home_score));
        }
    }

    var COMPETITIVE_WEIGHT = 1;
    var FRIENDLY_WEIGHT = 1;
    var safeMean = (d) => d.length > 0 ? d3.mean(d) : 0
    var weightedGoals = (goals) => Math.round(COMPETITIVE_WEIGHT * safeMean(goals.Competitive) + FRIENDLY_WEIGHT * safeMean(goals.Friendly))
    var prediction = {
        home: {name: homeTeam, score: weightedGoals(homeGoals)},
        away: {name: awayTeam, score: weightedGoals(awayGoals)},
        history: history,
        winner: "",
        loser: ""
    }
    prediction.winner = knockout(prediction)
    prediction.loser =  prediction.winner == homeTeam ? awayTeam : homeTeam

    return prediction;
}

function knockout(prediction) {
    if (prediction.home.score > prediction.away.score) {
        return prediction.home.name;
    } else if (prediction.home.score < prediction.away.score) {
        return prediction.away.name;
    } else {
        // Random if DRAW
        return [prediction.home.name, prediction.away.name][Math.floor(Math.random() * 2)];
    }
}

function worldCupPrediction(homeAwayHistory, grpMatches, grps) {

    var matchPredictions = [];
    var grpTables = {}

    var homeAwayHistory = d3.nest()
    .key((d) => d.home_team)
    .key((d) => d.away_team)
    .key((d) => d.tournament)
    .object(historicalMatches);

    var groupNations = d3.nest()
    .key((d) => d.Group)
    .object(grps)

    // Group Stage
    grpMatches.forEach(function (match) {

        var prediction = matchPrediction(match.home_team, match.away_team, homeAwayHistory)
        matchPredictions.push(prediction)

        if (grpTables[match.home_team] == null) {
            grpTables[match.home_team] = {
                team: match.home_team,
                points: 0, goalDiff: 0, goalScored: 0
            }
        }
        if (grpTables[match.away_team] == null) {
            grpTables[match.away_team] = {
                team: match.away_team,
                points: 0, goalDiff: 0, goalScored: 0
            }
        }

        grpTables[match.home_team].goalDiff += prediction.home.score - prediction.away.score;
        grpTables[match.home_team].goalScored += prediction.home.score;
        grpTables[match.away_team].goalDiff += prediction.away.score - prediction.home.score;
        grpTables[match.away_team].goalScored += prediction.away.score;

        if (prediction.home.score > prediction.away.score) {
            grpTables[match.home_team].points += 3
            grpTables[match.away_team].points += 0
        } else if (prediction.home.score < prediction.away.score) {
            grpTables[match.home_team].points += 0
            grpTables[match.away_team].points += 3
        } else {
            grpTables[match.home_team].points += 1
            grpTables[match.away_team].points += 1
        }
    })
    
    // Round 16
    var round16Teams = []
    var groups = Object.keys(groupNations)
    groups.forEach(function (grp) {
        var table = []
        groupNations[grp].forEach((nation) => table.push(grpTables[nation.Team]))
        table.sort((x, y) => d3.descending(x.goalScored, y.goalScored))
        table.sort((x, y) => d3.descending(x.goalDiff, y.goalDiff))
        table.sort((x, y) => d3.descending(x.points, y.points))
        // Top 2 teams progress to Round 16
        round16Teams.push(table.slice(0,2))
    })

    var quarterFinalists = [];
    for(var i = 0; i < round16Teams.length; i += 2) {
        var homeTeam = round16Teams[i][0].team;
        var awayTeam = round16Teams[i+1][1].team;
        var prediction = matchPrediction(homeTeam, awayTeam, homeAwayHistory)
        matchPredictions.push(prediction);
        quarterFinalists.push(prediction.winner);

        var homeTeam = round16Teams[i+1][0].team;
        var awayTeam = round16Teams[i][1].team;
        var prediction = matchPrediction(homeTeam, awayTeam, homeAwayHistory)
        matchPredictions.push(prediction);
        quarterFinalists.push(prediction.winner);
    }

    var semiFinalists = [];
    var prediction = matchPrediction(quarterFinalists[0], quarterFinalists[2], homeAwayHistory)
    matchPredictions.push(prediction);
    semiFinalists.push(prediction.winner);

    var prediction = matchPrediction(quarterFinalists[1], quarterFinalists[3], homeAwayHistory)
    matchPredictions.push(prediction);
    semiFinalists.push(prediction.winner);

    var prediction = matchPrediction(quarterFinalists[4], quarterFinalists[6], homeAwayHistory)
    matchPredictions.push(prediction);
    semiFinalists.push(prediction.winner);

    var prediction = matchPrediction(quarterFinalists[5], quarterFinalists[7], homeAwayHistory)
    matchPredictions.push(prediction);
    semiFinalists.push(prediction.winner);

    var prediction = matchPrediction(semiFinalists[0], semiFinalists[1], homeAwayHistory)
    matchPredictions.push(prediction);
    var finalist1 = prediction.winner;
    var thirdPlace1 = prediction.loser;

    var prediction = matchPrediction(semiFinalists[2], semiFinalists[3], homeAwayHistory)
    matchPredictions.push(prediction);
    var finalist2 = prediction.winner;
    var thirdPlace2 = prediction.loser;

    var prediction = matchPrediction(thirdPlace1, thirdPlace2, homeAwayHistory)
    matchPredictions.push(prediction);
    var winner = knockout(prediction);
    
    var prediction = matchPrediction(finalist1, finalist2, homeAwayHistory)
    matchPredictions.push(prediction);

    console.log("CHAMPIONS", prediction.winner)
    
    return matchPredictions
}

function ready(error, flags, grps, grpMatches2018, history) {

    flagData = flags;
    grpMatches = grpMatches2018;
    historicalMatches = history;

    var matchPredictions = worldCupPrediction(historicalMatches, grpMatches, grps);

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

    var matchLayer = svg.append("g").attr("class", "match-layer")
    drawRound16("Group Stage Match #1", matchPredictions.slice(0, 16), matchLayer, 40);
    drawRound16("Group Stage Match #2", matchPredictions.slice(16, 32), matchLayer, 140);
    drawRound16("Group Stage Match #3", matchPredictions.slice(32, 48), matchLayer, 240);
    drawRound16("Round of 16", matchPredictions.slice(48, 56), matchLayer, 360);
    drawRound16("Quarter Finals", matchPredictions.slice(56, 60), matchLayer, 480);
    drawRound16("Semi Finals", matchPredictions.slice(60, 62), matchLayer, 600);
    drawRound16("Finals", matchPredictions.slice(62, 64), matchLayer, 720);

    var championRound = matchLayer.append("g")
    .attr("class", "round")
    .attr("transform", "translate(0," + (7 * ROUND_HEIGHT - 150) + ")")

    var trophy = championRound
    .append("image")
    .attr("class","#trophy")
    .attr("width", 100)
    .attr("height", 140)
    .attr("x", SVG_WIDTH/2-50)
    .attr("y", 0)
    .attr("xlink:href", "./images/wc-2018-logo.png" )
    
    var championLabel = championRound.append("text")
    .attr("class", "round-header")
    .attr("x", SVG_WIDTH/2)
    .attr("y", 150)
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("CHAMPIONS")

    var championNation = championRound.append("text")
    .attr("class", "round-header")
    .attr("x", SVG_WIDTH/2)
    .attr("y", 170)
    .style("font-size", "16px")
    .style("text-anchor", "middle")
    .text(matchPredictions[63].winner)
}