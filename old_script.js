var worldCup = d3.select("#map").append("svg")
.attr("width", 1040)
.attr("height", 1200)

function drawGroup(groupNo) {

    var nations = [{"name": "A", "color": "red"},
                   {"name": "B", "color": "blue"},
                   {"name": "C", "color": "green"},
                   {"name": "D", "color": "purple"}];
    var matches = function(nations) {
        m = []
        m.push({"home": nations[0], "away": nations[1], "homeWin": 10, "awayWin": 25});
        m.push({"home": nations[2], "away": nations[3], "homeWin": 10, "awayWin": 9})
        m.push({"home": nations[3], "away": nations[0], "homeWin": 0, "awayWin": 25})
        m.push({"home": nations[1], "away": nations[2], "homeWin": 45, "awayWin": 25})
        m.push({"home": nations[0], "away": nations[2], "homeWin": 25, "awayWin": 25})
        m.push({"home": nations[1], "away": nations[3], "homeWin": 10, "awayWin": 25})
        return m
    }
    var groupMatches = matches(nations);

    var GROUP_WIDTH = 130;
    var GROUP_MID = GROUP_WIDTH / 2;
    var GROUP_HEIGHT = 300;
    var NATION_SPACING = GROUP_HEIGHT / groupMatches.length;
    var NATION_RADIUS = 5;

    var group = worldCup
    .append("g")
    .attr("width", GROUP_WIDTH)
    .attr("height", GROUP_HEIGHT)
    .attr("transform", "translate(" + groupNo*GROUP_WIDTH + ",0)")

    group.append("text")
    .text("Group " + String.fromCharCode(97 + groupNo).toUpperCase())
    .attr("x", GROUP_MID)
    .attr("y", 10)
    .style("font-size", "10px")
    .style("alignment-baseline", "middle")
    .style("text-anchor", "middle")

    group.append("rect")
    .attr("width", 1)
    .attr("height", GROUP_HEIGHT - NATION_SPACING)
    .style("fill", "#ccc")
    .attr("transform", "translate(" + GROUP_MID + "," + NATION_SPACING/2 + ")");

    group.append("g").attr("class", "match-circles")
    .selectAll(".matches")
    .data(groupMatches).enter()
    .append("circle")
    .attr("r", NATION_RADIUS)
    .style("fill", (d) => d.home.color)
    .attr("cx", GROUP_MID - NATION_RADIUS + 1)
    .attr("cy", (d, idx) => (idx * NATION_SPACING) + NATION_SPACING/2)

    group.append("g").attr("class", "match-circles")
    .selectAll(".matches")
    .data(groupMatches).enter()
    .append("circle")
    .attr("r", NATION_RADIUS)
    .style("fill", d => d.away.color)
    .attr("cx", GROUP_MID + NATION_RADIUS - 1)
    .attr("cy", (d, idx) => (idx * NATION_SPACING) + NATION_SPACING/2)

    var nationLines = group.append("g").attr("class", "nation-lines")

    nations.forEach(function (nation, nationID) {
        var ARC_WIDTH = 1
        var PIVOT_X_SHIFT = 0
        var nationMatches = []
        groupMatches.forEach(function (match, idx) {
            if (match.home == nation) {
                targetX = (GROUP_MID - NATION_RADIUS + 1)
                targetY = (idx * NATION_SPACING) + NATION_SPACING/2
                nationMatches.push([targetX, targetY, true, (match.homeWin > match.awayWin)])
            } else if (match.away == nation) {
                targetX = (GROUP_MID + NATION_RADIUS - 1)
                targetY = (idx * NATION_SPACING) + NATION_SPACING/2
                nationMatches.push([targetX, targetY, false, (match.homeWin < match.awayWin)])
            }
        })
        var path = "";
        path = "M " + nationMatches[0][0] + " " + nationMatches[0][1]
        for (var i = 1; i < 3; i++) {
            targetX = nationMatches[i][0] 
            targetY = nationMatches[i][1] 
            pivotX = ((nationMatches[i][2]) ? GROUP_MID/2 - (nationID * PIVOT_X_SHIFT) : GROUP_MID*1.5 + (nationID * PIVOT_X_SHIFT)) 
            pivotY = (targetY - nationMatches[i-1][1]) / 2 + nationMatches[i-1][1]
            path += " Q " + pivotX +  " " + pivotY + " " + targetX + " " + targetY
        }
        for (var i = 1; i >= 0; i--) {
            // console.log(nationMatches[i])
            // if (nationMatches[i][3]) {
            //     ARC_WIDTH = 20
            // }
            targetX = nationMatches[i][0] 
            targetY = nationMatches[i][1] 
            pivotX = ((nationMatches[i+1][2]) ? GROUP_MID/2 + ARC_WIDTH  - (nationID * PIVOT_X_SHIFT) : GROUP_MID*1.5 - ARC_WIDTH + (nationID * PIVOT_X_SHIFT)) 
            pivotY = (targetY - nationMatches[i+1][1]) / 2 + nationMatches[i+1][1]
            path += " Q " + pivotX +  " " + pivotY + " " + targetX + " " + targetY
        }
        nationLines
        .append("path")
        .attr("d", path)
        .style("fill", nation.color)
        .style("stroke", nation.color)
        .style("stroke-width", 1)
        .style("opacity", 0.4)
        .on("mouseover", function (d) {
            var nationLine = d3.select(this);
            nationLine.style("opacity", 1);
        })
        .on("mouseout", function (d) {
            var nationLine = d3.select(this);
            nationLine.style("opacity", 0.4);
        })
    })
}

for(var i = 0; i < 8; i++) {    
    drawGroup(i)
}


// TODO: Knockout stages
