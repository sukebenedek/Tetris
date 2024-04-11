let cvs = document.getElementById("mainC")
let ctx = cvs.getContext("2d")

let particleSize = 40
let borderSize = particleSize / 8
let border = 1.2

let width = 10 * particleSize
width = width - width % particleSize - border;
let height = 19 * particleSize
height = height - height % particleSize - border;

cvs.width = width
cvs.height = height

let maxInCols = (height + border) / particleSize
let maxInRows = (width + border) / particleSize

function randomElement(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}