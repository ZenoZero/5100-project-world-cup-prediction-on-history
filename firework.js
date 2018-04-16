

// <![CDATA[
var bits = 80; // how many bits
var speed = 20; // how fast - smaller is faster
var bangs = 10; // how many can be launched simultaneously (note that using too many can slow the script down)
var colours = new Array("#E4C484", "#E4C484", "#FF0000", "#0043FF");
var bitSize = 0
var bangheight = new Array();
var intensity = new Array();
var colour = new Array();
var Xpos = new Array();
var Ypos = new Array();
var dX = new Array();
var dY = new Array();
var stars = new Array();
var decay = new Array();
var swide = 1800;
var shigh = 1200;
var boddie;

// if (typeof('addRVLoadEvent')!='function') function addRVLoadEvent(funky) {
//   var oldonload=window.onload;
//   if (typeof(oldonload)!='function') window.onload=funky;
//   else window.onload=function() {
//     if (oldonload) oldonload();
//     funky();
//   }
// }
// 
// addRVLoadEvent(light_blue_touchpaper);
// light_blue_touchpaper()
firework()
function firework() {
    if (document.getElementById) {
        var i;
        boddie = document.createElement("div");
        boddie.style.position = "fixed";
        boddie.style.top = "0px";
        boddie.style.left = "0px";
        boddie.style.overflow = "visible";
        boddie.style.width = "2px";
        boddie.style.height = "2px";
        boddie.style.backgroundColor = "transparent";
        
        document.getElementById("celebrite").addEventListener("mouseover", function () {
            bitSize=30;
        })
        document.getElementById("celebrite").addEventListener("mouseout", function () {
            bitSize=0;
        })
        document.body.appendChild(boddie);
        set_width();
        for (i = 0; i < bangs; i++) {
            write_fire(i);
            launch(i);
            setInterval('stepthrough(' + i + ')', speed);
        }
    }
}

function write_fire(N) {
    var i, rlef, rdow;
    stars[N + 'r'] = createDiv('|', bitSize);
    boddie.appendChild(stars[N + 'r']);
    for (i = bits * N; i < bits + bits * N; i++) {
        stars[i] = createDiv('*', bitSize);
        boddie.appendChild(stars[i]);
    }
}

function createDiv(char, size) {
    var div = document.createElement("div");
    div.style.font = size + "px monospace";
    div.style.position = "absolute";
    div.style.backgroundColor = "transparent";
    div.appendChild(document.createTextNode(char));
    return (div);
}

function launch(N) {
    colour[N] = Math.floor(Math.random() * colours.length);
    Xpos[N + "r"] = swide * 0.5 - 150;
    Ypos[N + "r"] = shigh - 5;
    bangheight[N] = Math.round((0.5 + Math.random()) * shigh * 0.4);
    dX[N + "r"] = (Math.random() - 0.5) * swide / bangheight[N];
    // if (dX[N + "r"] > 1.25) stars[N + "r"].firstChild.nodeValue = "/";
    // else if (dX[N + "r"] < -1.25) stars[N + "r"].firstChild.nodeValue = "\\";
    // else stars[N + "r"].firstChild.nodeValue = "|";
    stars[N + "r"].style.color = colours[colour[N]];
}

function bang(N) {
    var i, Z, A = 0;
    for (i = bits * N; i < bits + bits * N; i++) {
        Z = stars[i].style;
        Z.left = Xpos[i] + "px";
        Z.top = Ypos[i] + "px";
        if (decay[i]) decay[i]--;
        else A++;
        if (decay[i] == 15) Z.fontSize = bitSize;
        else if (decay[i] == 7) Z.fontSize = bitSize;
        else if (decay[i] == 1) Z.visibility = "hidden";
        if (decay[i] > 1 && Math.random() < .1) {
            Z.visibility = "hidden";
            setTimeout('stars[' + i + '].style.visibility="visible"', speed - 1);
        }
        Xpos[i] += dX[i];
        Ypos[i] += (dY[i] += 1.25 / intensity[N]);

    }
    if (A != bits) setTimeout("bang(" + N + ")", speed);
}

function stepthrough(N) {
    var i, M, Z;
    var oldx = Xpos[N + "r"];
    var oldy = Ypos[N + "r"];
    Xpos[N + "r"] += dX[N + "r"];
    Ypos[N + "r"] -= 4;
    if (Ypos[N + "r"] < bangheight[N]) {
        M = Math.floor(Math.random() * 3 * colours.length);
        intensity[N] = 5 + Math.random() * 4;
        for (i = N * bits; i < bits + bits * N; i++) {
            Xpos[i] = Xpos[N + "r"];
            Ypos[i] = Ypos[N + "r"];
            dY[i] = (Math.random() - 0.5) * intensity[N];
            dX[i] = (Math.random() - 0.5) * (intensity[N] - Math.abs(dY[i])) * 1.25;
            decay[i] = 16 + Math.floor(Math.random() * 16);
            Z = stars[i];
            if (M < colours.length) Z.style.color = colours[i % 2 ? colour[N] : M];
            else if (M < 2 * colours.length) Z.style.color = colours[colour[N]];
            else Z.style.color = colours[i % colours.length];
            Z.style.fontSize = bitSize;
            Z.style.visibility = "visible";
        }
        bang(N);
        launch(N);
    }
    stars[N + "r"].style.left = oldx + "px";
    stars[N + "r"].style.top = oldy + "px";
}

window.onresize = set_width;
function set_width() {
    var sw_min = 999999;
    var sh_min = 999999;
    if (document.documentElement && document.documentElement.clientWidth) {
        if (document.documentElement.clientWidth > 0) sw_min = document.documentElement.clientWidth;
        if (document.documentElement.clientHeight > 0) sh_min = document.documentElement.clientHeight;
    }
    if (typeof (self.innerWidth) != "undefined" && self.innerWidth) {
        if (self.innerWidth > 0 && self.innerWidth < sw_min) sw_min = self.innerWidth;
        if (self.innerHeight > 0 && self.innerHeight < sh_min) sh_min = self.innerHeight;
    }
    if (document.body.clientWidth) {
        if (document.body.clientWidth > 0 && document.body.clientWidth < sw_min) sw_min = document.body.clientWidth;
        if (document.body.clientHeight > 0 && document.body.clientHeight < sh_min) sh_min = document.body.clientHeight;
    }
    if (sw_min == 999999 || sh_min == 999999) {
        sw_min = 1800;
        sh_min = 1200;
    }
    swide = sw_min;
    shigh = sh_min;
}

// ]]>