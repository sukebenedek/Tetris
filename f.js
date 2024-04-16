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

let nextPiece = randomElement(["I", "J", "L", "O", "S", "T", "Z"])

function drawNext(){
    let g = []
    for (let i = 0; i < 2; i++){
        g.push([])
        for (let j = 0; j < 4; j++) {
            g[i].push(new Cell(true))
        }
    }
    Cell.placeNewPiece(g, 0, nextPiece)

    let cvs2 = document.getElementById("nextC")
    let ctx2 = cvs2.getContext("2d")

    let width = 4 * particleSize
    width = width - width % particleSize - border;
    let height = 2 * particleSize
    height = height - height % particleSize - border;

    cvs2.width = width
    cvs2.height = height

    ctx2.fillStyle = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
    ctx2.fillRect(0, 0, width, height)

    let pencil = {posx: 0, posy: 0}
    pencil.posx = 0
    pencil.posy = 0
    for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
            if(g[i][j].controllable){
                drawCell(g[i][j].color, pencil, ctx2)
            }
            else if(g[i][j].shouldMove){
                // drawCell("lightblue")
                drawCell(g[i][j].color, pencil, ctx2)
            }
            else if(g[i][j].st == b){
                // drawCell("#b4b4b4")
                drawCell(g[i][j].color, pencil, ctx2)
            }
            else if(g[i][j].st == e){
                drawCell(window.getComputedStyle(document.body, null).getPropertyValue('background-color'), pencil, ctx2)
            }
            else{
                console.log(`Nínó: ${g[i][j].st}`);
            }
            pencil.posx += particleSize

        }
        pencil.posy += particleSize
        pencil.posx = 0
    }

}

function drawCell(color, pencil, ctx){
    ctx.fillStyle = color
    ctx.fillRect(pencil.posx, pencil.posy, particleSize - border, particleSize - border)
}

function changeST(c1, c2){
    let temp = {st: c2.st, shouldMove: c2.shouldMove, controllable: c2.controllable, type: c2.type, center: c2.center, color: c2.color}
    c2.st = c1.st
    c2.shouldMove = c1.shouldMove
    c2.controllable = c1.controllable
    c2.type = c1.type
    c2.center = c1.center
    c2.color = c1.color

    
    c1.st = temp.st
    c1.shouldMove = temp.shouldMove
    c1.controllable = temp.controllable
    c1.type = temp.type
    c1.center = temp.center
    c1.color = temp.color

    c2.didMove = true
    c1.didMove = true
}

function randomElement(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}