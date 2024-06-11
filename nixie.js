const hours = document.querySelector('.hours');
const mins = document.querySelector('.mins');
const secs = document.querySelector('.secs');

var timer = null;

function getTime() {
    const now = new Date();
    return {
        hours: now.getHours() <= 9 ? `0${now.getHours()}` : `${now.getHours()}`,
        mins: now.getMinutes() <= 9 ? `0${now.getMinutes()}` : `${now.getMinutes()}`,
        secs: now.getSeconds() <= 9 ? `0${now.getSeconds()}` : `${now.getSeconds()}`
    }
}

function setDigits(section, digit) {
    try {
    const tens = [...section.children[0].children];
    const ones = [...section.children[1].children];
    tens.forEach(number => number.classList.remove('active'));
    tens[digit[0]].classList.add('active');
    ones.forEach(number => number.classList.remove('active'));
    ones[digit[1]].classList.add('active');
    } catch (e) {
        console.log(e);
    }
}

function tick() {
    const time = getTime();
    setDigits(hours, time.hours);
    setDigits(mins, time.mins);
    setDigits(secs, time.secs);
}

var isLoopColor = false
var loopColorInterval = 0;
var hue = 0;
function loopColor() {
    if (!isLoopColor) {
        isLoopColor = true;
        document.getElementById("selcolor").disabled=true;
        loopColorInterval = setInterval(function () {
            hue = (hue + 1) % 360;
            setColor(hsb2rgb(hue, 100, 100));
        }, 1000);
    } else {
        isLoopColor = false;
        document.getElementById("selcolor").disabled=false;
        clearInterval(loopColorInterval);
    }
}

function changeColor(color) {
    var rgbColor = hexToRgb(color);

    setColor(rgbColor);
}

function setColor(rgbColor) {
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);

    //var rgbColor = hexToRgb(color);

    r.style.setProperty('--red', rgbColor.r);
    r.style.setProperty('--green', rgbColor.g);
    r.style.setProperty('--blue', rgbColor.b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const map = function (value, x1, y1, x2, y2) {
    const nv = Math.round((value - x1) * (y2 - x2) / (y1 - x1) + x2);
    return (x2 > y2) ? Math.min(Math.max(nv, y2), x2) : Math.max(Math.min(nv, y2), x2);
}

function hsb2rgb(_h, _s, _b) {
    let h = _h, s = _s / 100, b = _b / 100;
    let f = (n, k = (n + h / 60) % 6) => b - b * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return {r:map(f(5), 0, 1, 0, 255),g:map(f(3), 0, 1, 0, 255),b:map(f(1), 0, 1, 0, 255)};
}

//loopColor();