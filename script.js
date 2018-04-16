var SVG_HEIGHT = 900;
var SVG_WIDTH = 1100;
var DETAILS_WIDTH = 290;
var DETAILS_HEIGHT = 900;
var TEAM_SPACING = 2;
var DETAILS_TEAM_SPACING = 5;
var ROUND_HEIGHT = 120;
var FLAG_WIDTH = 25;
var DETAILS_FLAG_WIDTH = 100;
var TIMELINE_BAR_WIDTH = 12;
var COMPETITIVE_WEIGHT = 1;
var FRIENDLY_WEIGHT = 1;
var GOLD_COLOR = "#E4C484";
var YEARS = 90;
var SPECIAL_NATIONS = {"Saudi Arabia": "ksa", Spain: "esp", Japan: "jpn", Iran: "irn", Morocco: "mar", Iceland: "isl", Nigeria: "nga", "Costa Rica": "crc", "Switzerland": "sui", "Serbia": "srb"}
var flagData, grpMatches, groupings, historicalMatches;

function getNationSHORT(name) {
    if (SPECIAL_NATIONS[name] == null) {
        return name.slice(0,3).toLowerCase();
    } else {
        return SPECIAL_NATIONS[name];
    }
}

function drawRound(roundHeading, matchesData, matchLayer, roundHeight) {

    var numberOfMatches = matchesData.length;
    var matchWidth = SVG_WIDTH / numberOfMatches;

    var round = matchLayer.append("g")
    .attr("class", "round")
    .attr("transform", "translate(0," + roundHeight + ")");
    
    if (roundHeading == "Finals") {
        var roundHeader = round.append("text")
        .attr("class", "round-header")
        .attr("x", 275)
        .attr("y", 5)
        .style("text-anchor", "middle")
        .style("alighment-basline", "middle")
        .text("Third Place");

        var roundHeader = round.append("text")
        .attr("class", "round-header")
        .attr("x", SVG_WIDTH/4*2)
        .attr("y", 5)
        .style("text-anchor", "middle")
        .style("alighment-basline", "middle")
        .text(roundHeading);
    } else {
        var roundHeader = round.append("text")
        .attr("class", "round-header")
        .attr("x", SVG_WIDTH/2)
        .attr("y", 5)
        .style("text-anchor", "middle")
        .style("alighment-basline", "middle")
        .text(roundHeading);
    }
    
    var matches = round.append("g").attr("class", "matches")
    .attr("transform", "translate(0, 20)");

    var match = matches.selectAll(".match")
    .data(matchesData).enter()
    .append("g").attr("class", "match")
    .attr("transform", function(d, idx) {
        if (roundHeading == "Finals" && idx == 1){
            return "translate(" + (idx*matchWidth-275) + ",0)";
        } else if (roundHeading == "Finals" && idx == 0){
            return "translate(" + (idx*matchWidth) + ",0)";
        } else {
            return "translate(" + idx*matchWidth + ",0)";
        }
    });
   
    // Source for drop shadow: http://bl.ocks.org/cpbotha/5200394
    //Begin from Source
    var rectShadow = match.append("defs")
    var shadowFilter = rectShadow.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "150%");

    shadowFilter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 3)
    .attr("result", "blur");

    var shadowOffset = shadowFilter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 4)
    .attr("dy", 4)
    .attr("opacity",0.1)
    .attr("result", "offsetBlur");

    var shadowMerge = shadowFilter.append("feMerge");
    shadowMerge.append("feMergeNode")
    .attr("in", "offsetBlur");
    shadowMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");
    //End from Source

    match.append("rect")
    .attr("class", "match-rect")
    .attr("transform", "translate(" + (matchWidth/2-30) + ",0)")
    .attr("width", 60)
    .attr("height", 60)
    .style("stroke", "black")
    .style("stroke-width", 0.3)
    .style("opacity", 0.7)
    .style("fill", (d, idx) => (roundHeading == "Finals" && idx == 1) ? GOLD_COLOR : "#103673")
    .on("click", function(match) {
        d3.selectAll(".match-rect")
        .style("fill", "#103673")
        .attr("filter", 'none');

        d3.select(this).style("fill", GOLD_COLOR)
        .transition()
        .ease(d3.easeLinear)
        .attr("filter", 'url(#drop-shadow)');
        
        populateDetails(match);
    });

    ['home', 'away'].forEach(function (side) {
        var team = match.append("g")
        .attr("class", (d) => "team " + side + "-team team-" + getNationSHORT(d[side].name))
        .attr("transform", "translate(" + (matchWidth/2-25-TEAM_SPACING) + ", 5)");

        var matchBg = team.append("rect")
        .attr("class", "flag")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 25)
        .attr("height", 15)
        .attr("fill", (d) => "url(#countryName-" + getNationSHORT(d[side].name) + ")");
        
        var teamLabel = team.append("text")
        .attr("class", (d) => "team-label team-" + getNationSHORT(d[side].name))
        .attr("x", 12.5)
        .attr("y", 30)
        .style("text-anchor", "middle")
        .text((d) => getNationSHORT(d[side].name).toUpperCase());
    
        var goalLabel = team.append("text")
        .attr("class", (d) => "goal-label team-" + getNationSHORT(d[side].name))
        .attr("x", 12.5)
        .attr("y", 47.5)
        .style("text-anchor", "middle")
        .text((d) => d[side].score);
        
        if (side == "away") {
            team.attr("transform", "translate(" + (matchWidth/2+TEAM_SPACING) + ", 5)")
            teamLabel.attr("x", 12.5).style("text-anchor", "middle");
        }
    })
}

function populateDetails(selectedMatch) {

    d3.select("#details").selectAll("*").remove();

    // set Width and Height for details container
    d3.select("#details").style("width", DETAILS_WIDTH);
    var svgDetails =  d3.select("#details").append("svg")
    .attr("width", DETAILS_WIDTH)
    .attr("height", DETAILS_HEIGHT);

    var details = svgDetails.append("g");

    var detailsHeader = details.append("g")
    .attr("class", "details-header");

    var detailsTitle = detailsHeader
    .append("image")
    .attr("width", DETAILS_WIDTH/2)
    .attr("x" ,140-DETAILS_WIDTH/4)
    .attr("y", 0)
    .attr("xlink:href", "./images/detail-match-header.svg");

    var soccerField = detailsHeader
    .append("image")
    .attr("width", DETAILS_WIDTH)
    .attr("y", 185)
    .attr("xlink:href", "./images/football-field.svg");

    ['home', 'away'].forEach(function (side) {
        var team = detailsHeader.append("g").attr("class", side + "-team")
        .attr("transform", "translate(" + (DETAILS_WIDTH/2-DETAILS_FLAG_WIDTH-DETAILS_TEAM_SPACING) + ",0)");

        team.append("rect")
        .attr("class", "flag")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", DETAILS_FLAG_WIDTH)
        .attr("height", DETAILS_FLAG_WIDTH * 0.6)
        .attr("fill", "url(#countryNameBigger-" + getNationSHORT(selectedMatch[side].name) + ")")
        .attr("transform", "translate(0, 70)");
        
        var teamLabel = team.append("text")
        .attr("class", "team-label")
        .attr("x", DETAILS_FLAG_WIDTH/2)
        .attr("y", 145)
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text(selectedMatch[side].name);
    
        var goalLabel = team.append("text")
        .attr("class", "goal-label")
        .attr("x", DETAILS_FLAG_WIDTH/2)
        .attr("y", 175)
        .style("font-size", "30px")
        .style("text-anchor", "middle")
        .text(selectedMatch[side].score);

        if (side == "away") {
            team.attr("transform", "translate(" + (DETAILS_WIDTH/2+DETAILS_TEAM_SPACING) + ",0)");
        }
    })

    if (selectedMatch['history'][0] == null && selectedMatch['history'][1] == null) {

        var noHistory = details.append("text")
        .attr("class", "no-history")
        .style("font-size", "14px")
        .style("text-anchor", "middle");
        
        noHistory.append("tspan")
        .attr("x", DETAILS_WIDTH/2)
        .attr("y", 310)
        .text("Both team have never met");

        noHistory.append("tspan")
        .attr("x", DETAILS_WIDTH/2)
        .attr("y", 325)
        .text("before in the past " + YEARS + " years.");

    } else {

        var detailsMatches = [];
        var homeAway = selectedMatch['history'][0];
        var awayHome = selectedMatch['history'][1];
        
        if (homeAway != null) {
            if (homeAway.Competitive != null) {
                homeAway.Competitive.forEach(function (match) {
                    detailsMatches.push({
                        home: {score: match.home_score}, 
                        away: {score: match.away_score},
                        date: match.Date,
                        tournament: "Competitive"
                    });
                });
            }
            if (homeAway.Friendly != null) {
                homeAway.Friendly.forEach(function (match) {
                    detailsMatches.push({
                        home: {score: match.home_score}, 
                        away: {score: match.away_score},
                        date: match.Date,
                        tournament: "Friendly"
                    });
                });
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
                    });
                });
            }
            if (awayHome.Friendly != null) {
                awayHome.Friendly.forEach(function (match) {
                    detailsMatches.push({
                        home: {score: match.away_score}, 
                        away: {score: match.home_score},
                        date: match.Date,
                        tournament: "Friendly"
                    });
                });
            }
        }

        detailsMatches.sort((x, y) => d3.ascending(x.date, y.date));

        // Only show max 32 matches
        if (detailsMatches.length > 32) {
            detailsMatches = detailsMatches.slice(detailsMatches.length-32, detailsMatches.length);
        }

        // Hide matches
        if (COMPETITIVE_WEIGHT == 0) {
            detailsMatches = detailsMatches.filter(match => match.tournament != "Competitive");
        }
        if (FRIENDLY_WEIGHT == 0) {
            detailsMatches = detailsMatches.filter(match => match.tournament != "Friendly");
        }

        if (detailsMatches.length != 0) {

            details.append("text")
            .attr("class", "timeline-header")
            .attr("x", 15)
            .attr("y", 278)
            .attr("text-anchor", "start")
            .text("Head to Head")
            .style("fill", GOLD_COLOR);
            
            var timeline = details.append("g").attr("class", "details-timeline")
            .attr("transform", "translate(" + 0 + "," +  295 + ")");

            timeline.append("rect")
            .attr("class", "timeline-rect")
            .attr("width", DETAILS_WIDTH)
            .attr("height", (detailsMatches.length+2) * TIMELINE_BAR_WIDTH)
            .style("opacity", 0);

            var xScale = d3.scaleLinear().domain([0, 9]).range([DETAILS_WIDTH/2, DETAILS_WIDTH-50]);
            var trophy = (tournament) => tournament == "Friendly" ? "🤝" : "🏆";
            var footballs = function (score) {
                var balls = ""
                for (var i = 0; i < score; i++) balls += "⚽";
                if (score > 6) balls = balls.slice(0,5) + " .. " + "⚽";
                return balls;
            } 
            
            detailsMatches.forEach(function (d, idx) {
                var timelineMatch = timeline.append("g")
                .attr("class", "timeline-match")
                .attr("transform", "translate(0," + (idx*(TIMELINE_BAR_WIDTH + 5))+ ")");
                
                timelineMatch.append("text")
                .attr("class", "score timeline-date-" + idx)
                .attr("x", 15)
                .attr("y", 1)
                .style("text-anchor", "start")
                .attr("alignment-baseline", "middle")
                .text(d.date.slice(2,4) + '\'');

                timelineMatch.append("text")
                .attr("class", "score timeline-trophy-" + idx)
                .attr("x", DETAILS_WIDTH-15)
                .attr("y", 1)
                .style("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .text(trophy(d.tournament));

                timelineMatch.append("text")
                .attr("class", "score timeline-score-" + idx)
                .attr("x", xScale(0)-15)
                .attr("y", 2)
                .style("text-anchor", "end")
                .attr("alignment-baseline", "middle")
                .text(footballs(d.home.score));

                timelineMatch.append("text")
                .attr("class", "score timeline-score-" + idx)
                .attr("x", xScale(0)+15)
                .attr("y", 2)
                .style("text-anchor", "start")
                .attr("alignment-baseline", "middle")
                .text(footballs(d.away.score));

                timelineMatch.append("text")
                .attr("class", "score timeline-score-" + idx)
                .attr("x", DETAILS_WIDTH/2)
                .attr("y", 1)
                .style("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .text(d.home.score + " - " + d.away.score);

                timelineMatch.append("rect")
                .attr("class", "timeline-rect timeline-rect-" + idx)
                .attr("height", TIMELINE_BAR_WIDTH*1.2)
                .attr("width", DETAILS_WIDTH)
                .attr("x", 0)
                .attr("y", -TIMELINE_BAR_WIDTH*0.6)
                .attr("fill", GOLD_COLOR)
                .attr("opacity", 0)
                .on("mouseover", function() {
                    d3.selectAll(".timeline-rect-"+idx).attr("opacity", 0.2);
                    d3.selectAll(".timeline-"+idx).attr("opacity", 1.0);
                })
                .on("mouseout", function() {
                    d3.selectAll(".timeline-rect-"+idx).attr("opacity", 0);
                    d3.selectAll(".timeline-"+idx).attr("opacity", 0.7);
                });
            });

        } else {

            if (COMPETITIVE_WEIGHT == 1) {
                var msg = " in a competitive match ";
            } else if (FRIENDLY_WEIGHT == 1)  {
                var msg = " in a friendly match ";
            }

            if (COMPETITIVE_WEIGHT == 1 || FRIENDLY_WEIGHT == 1) {
                var noHistory = details.append("text")
                .attr("class", "no-history")
                .style("font-size", "14px")
                .style("text-anchor", "middle");
                
                noHistory.append("tspan")
                .attr("x", DETAILS_WIDTH/2)
                .attr("y", 310)
                .text("Both team have never met");

                noHistory.append("tspan")
                .attr("x", DETAILS_WIDTH/2)
                .attr("y", 325)
                .text(msg);

                noHistory.append("tspan")
                .attr("x", DETAILS_WIDTH/2)
                .attr("y", 340)
                .text("before in the past " + YEARS + " years.");
            }
        } 
    }
}


function matchPrediction(homeTeam, awayTeam, homeAwayHistory) {

    var homeGoals = {Competitive: [], Friendly:[]};
    var awayGoals = {Competitive: [], Friendly:[]};
    var history = [];
    var homeAway = homeAwayHistory[homeTeam][awayTeam];
    var awayHome = homeAwayHistory[awayTeam][homeTeam];

    history = [homeAway, awayHome]

    if (homeAway != null) {  
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
        if (awayHome.Competitive != null) {
            homeGoals.Competitive = homeGoals.Competitive.concat(awayHome.Competitive.map((d) => d.away_score));
            awayGoals.Competitive = awayGoals.Competitive.concat(awayHome.Competitive.map((d) => d.home_score));
        }
        if (awayHome.Friendly != null) {
            homeGoals.Friendly = homeGoals.Friendly.concat(awayHome.Friendly.map((d) => d.away_score));
            awayGoals.Friendly = awayGoals.Friendly.concat(awayHome.Friendly.map((d) => d.home_score));
        }
    }

    var safeMean = (d, l) => l > 0 ? d/l : 0;
    var weighted = (weight, goals) => d3.sum(goals) * weight;
    var length = (goals) => goals.Competitive.length*COMPETITIVE_WEIGHT + goals.Friendly.length*FRIENDLY_WEIGHT;
    var value = (goals) => weighted(COMPETITIVE_WEIGHT,goals.Competitive) + weighted(FRIENDLY_WEIGHT,goals.Friendly);
    var weightedGoals = (goals) => Math.round(safeMean(value(goals), length(goals)));

    var prediction = {
        home: {name: homeTeam, score: weightedGoals(homeGoals)},
        away: {name: awayTeam, score: weightedGoals(awayGoals)},
        history: history,
        winner: "",
        loser: ""
    }
    prediction.winner = knockout(prediction);
    prediction.loser =  prediction.winner == homeTeam ? awayTeam : homeTeam;

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

function populateTournament() {

    d3.select("#tournament").selectAll("*").remove();
    d3.select("#details").selectAll("*").remove();
    d3.select('.highlight-select').property('value', '- Select Team -');

    var svg = d3.select("#tournament").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height",  SVG_HEIGHT)

    var defs = svg.append("defs");
    flagData.forEach(function (flag, idx) {
        defs.append("pattern")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", "countryName-" + flag.url.slice(-3))
        .attr("patternUnits", "userSpaceOnUse")
        .append("image")
        .attr("width", 25)
        .attr("height", 15)
        .attr("xlink:href", flag.url)

        defs.append("pattern")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("id", "countryNameBigger-" + flag.url.slice(-3))
        .attr("patternUnits", "userSpaceOnUse")
        .append("image")
        .attr("width", DETAILS_FLAG_WIDTH)
        .attr("height", DETAILS_FLAG_WIDTH * 0.6)
        .attr("xlink:href", flag.url)
    })

    var matchPredictions = worldCupPrediction(historicalMatches, grpMatches, groupings);
    
    // Draw progression links
    var linkLayer = svg.append("g").attr("class", "link-layer")
    linkLayer.attr("transform", "translate(0,10)")

    var nextMatchID = function(name, currentMatchID) {
        for(var i = currentMatchID+1; i < matchPredictions.length; i++) {
            if (matchPredictions[i].home.name == name || matchPredictions[i].away.name == name ) {
                return i;
            }
        }
    }
    var getMatchWidth = function (matchID) {
        if (matchID < 16) {
            return matchID * (SVG_WIDTH/16) + (SVG_WIDTH/16)/2
        } else if (matchID < 32) {
            return (matchID-16) * (SVG_WIDTH/16) + (SVG_WIDTH/16)/2
        } else if (matchID < 48) {
            return (matchID-32) * (SVG_WIDTH/16) + (SVG_WIDTH/16)/2
        } else if (matchID < 56) {
            return (matchID-48) * (SVG_WIDTH/8) + (SVG_WIDTH/8)/2
        } else if (matchID < 60) {
            return (matchID-56) * (SVG_WIDTH/4) + (SVG_WIDTH/4)/2
        } else if (matchID < 62) {
            return (matchID-60) * (SVG_WIDTH/2) + (SVG_WIDTH/2)/2
        } else if (matchID == 62){
            return (SVG_WIDTH/2)/2
        } else{
            return (SVG_WIDTH/2)
        }
    }
    var getRoundNum = function (matchID) {
        if (matchID < 16) {
            return 0
        } else if (matchID < 32) {
            return 1
        } else if (matchID < 48) {
            return 2
        } else if (matchID < 56) {
            return 3
        } else if (matchID < 60) {
            return 4
        } else if (matchID < 62) {
            return 5
        } else {
            return 6
        }
    }

    matchPredictions.forEach(function(match, idx) {

        var xHome = 12.5 + (-25-TEAM_SPACING) + getMatchWidth(idx)
        var xAway = 12.5 + (TEAM_SPACING) + getMatchWidth(idx)
        var y1 = 20 + 60 + 100 * getRoundNum(idx);
        var y2 = y1 + 40;
        var generatePath = function(x1, x2, y1, y2) {
            var pivotX = x1 < x2 ? x1 + (x2 - x1)/2 : x1 - (x1 - x2)/2
            return ["M", x1, y1, "Q", x1, y1+10, pivotX, y1+20, x2, y1+30, x2, y2].join(" ")
        }

        if (nextMatchID(match.home.name, idx) != null) {
            var nextMatch = matchPredictions[nextMatchID(match.home.name, idx)]
            if (match.home.name == nextMatch.home.name) {
                var x2 = 12.5 - 25 - TEAM_SPACING + getMatchWidth(nextMatchID(match.home.name, idx))
            } else {
                var x2 = 12.5 + TEAM_SPACING + getMatchWidth(nextMatchID(match.home.name, idx))
            }
            linkLayer.append("path")
            .attr("class", "link team team-" + getNationSHORT(match.home.name))
            .attr("fill", "none")
            .style("stroke", GOLD_COLOR)
            .style("stroke-width", 1)
            .style("opacity", 0.6)
            .attr("d", generatePath(xHome, x2, y1, y2))
        }

        if (nextMatchID(match.away.name, idx) != null) {
            var nextMatch = matchPredictions[nextMatchID(match.away.name, idx)]
            if (match.away.name == nextMatch.home.name) {
                var x2 = 12.5 + (-25-TEAM_SPACING) + getMatchWidth(nextMatchID(match.away.name, idx))
            } else {
                var x2 = 12.5 + (TEAM_SPACING) + getMatchWidth(nextMatchID(match.away.name, idx))
            }

            linkLayer.append("path")
            .attr("class", "link team team-" + getNationSHORT(match.away.name))
            .attr("fill", "none")
            .style("stroke", GOLD_COLOR)
            .style("stroke-width", 1)
            .style("opacity", 0.6)
            .attr("d", generatePath(xAway, x2, y1, y2))
        }

        if (idx == 63) {
            var winner = (match.winner == match.home.name) ? match.home : match.away
            var x1 = (match.winner == match.home.name) ? xHome : xAway
            var generatePath = function(x1, x2, y1, y2) {
                var pivotX = x1 < x2 ? x1 + (x2 - x1)/2 : x1 - (x1 - x2)/2
                var pivotY = y1 < y2 ? y1 + (y2 - y1)/2 : y1 - (y1 - y2)/2
                return ["M", x1, y1, "Q", x1, y1+2, pivotX, pivotY, x2, y2-2, x2, y2+15].join(" ")
            }
            linkLayer.append("path")
            .attr("class", "link team team-" + getNationSHORT(winner.name))
            .attr("fill", "none")
            .style("stroke", GOLD_COLOR)
            .style("stroke-width", 1)
            .style("opacity", 0.6)
            .attr("d", generatePath(x1, SVG_WIDTH/2, y1, 5 * ROUND_HEIGHT + 100))
        }

    })

    var matchLayer = svg.append("g").attr("class", "match-layer")
    matchLayer.attr("transform", "translate(0,10)")

    drawRound("Group Stage Match #1", matchPredictions.slice(0, 16), matchLayer, 0);
    drawRound("Group Stage Match #2", matchPredictions.slice(16, 32), matchLayer, 100);
    drawRound("Group Stage Match #3", matchPredictions.slice(32, 48), matchLayer, 200);
    drawRound("Round of 16", matchPredictions.slice(48, 56), matchLayer, 300);
    drawRound("Quarter Finals", matchPredictions.slice(56, 60), matchLayer, 400);
    drawRound("Semi Finals", matchPredictions.slice(60, 62), matchLayer, 500);
    drawRound("Finals", matchPredictions.slice(62, 64), matchLayer, 600);

    populateDetails(matchPredictions[63])

    var championRound = matchLayer.append("g")
    .attr("class", "round")
    .attr("transform", "translate(0," + (5 * ROUND_HEIGHT +100) + ")")

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
    .style("font-size", "18px")
    .style("text-anchor", "middle")
    .text(matchPredictions[63].winner)
}

d3.select("#tournament").style("width", SVG_WIDTH)
d3.select("#credits").style("width", SVG_WIDTH)

d3.queue()
.defer(d3.csv, "./data/countries_flag_links.csv")
.defer(d3.csv, "./data/groups_flags.csv")
.defer(d3.csv, "./data/wc_2018_grp_schedule.csv")
.defer(d3.csv, "./data/history_2018.csv")
.await(ready);

function ready(error, flags, grps, grpMatches2018, history) {

    flagData = flags;
    grpMatches = grpMatches2018;
    historicalMatches = history;
    groupings = grps;

    var periods = [];
    for(var i = 90; i >= 10; i -= 10) periods.push(i);

    var yearsSelect = d3.select("#years-control")
    .append("div").attr("class", "select-style")
    .append("select").attr("class", "highlight-select")

    yearsSelect.selectAll("option")
    .data(periods).enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d + " years");

    yearsSelect.on("change", function(d) {
        YEARS = Number(d3.select(this).property("value"));
        historicalMatches = history.filter((match) => Number(match.Date.slice(0,4)) > (2018-YEARS))
        populateTournament();
    });

    var teams = grps.map((d) => d.Team);
    teams.push("- Select Team -")
    teams.sort((x, y) => d3.ascending(x, y))
    
    var highlight = d3.select("#team-control")
    .append("div").attr("class", "select-style")
    .append("select").attr("class", "highlight-select")

     highlight.on("change", function(d) {
        var value = d3.select(this).property("value");
        if (value == "- Select Team -") {
            d3.selectAll(".team").style("opacity", 1)
            d3.selectAll(".link").style("opacity", 0.6)
        } else {
            d3.selectAll(".team").style("opacity", 0.2)
            d3.selectAll(".team-" + getNationSHORT(value))
                .transition().delay(function (d,i) {return i * 40;})
                .ease(d3.easeLinear)
                .style("opacity", 1);      
        }
    });
    
    highlight.selectAll("option")
    .data(teams).enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

    populateTournament();
}

function checkMatchType(matchType) {
    var on = document.getElementById(matchType).checked
    if (matchType == "competitive") {
        COMPETITIVE_WEIGHT = on ? 1 : 0
    } else {
        FRIENDLY_WEIGHT = on ? 1 : 0
    }
    populateTournament();
}
