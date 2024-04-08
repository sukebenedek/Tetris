ctx.fillStyle = "black"
ctx.fillRect(0, 0, width, height)

let g = []
let next = []
let pause = false
let putNext = true
for (let i = 0; i < maxInCols; i++) {
    g.push([])
    for (let j = 0; j < maxInRows; j++) {
        g[i].push(new Cell(true))
    }
}

Cell.placeNewPiece(g, next)

let pencil = {posx: 0, posy: 0}
function drawFrame(){
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    pencil.posx = 0
    pencil.posy = 0
    for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
            if(g[i][j].controllable){
                ctx.fillStyle = "blue"
            }
            else if(g[i][j].shouldMove){
                ctx.fillStyle = "red"
            }
            else if(g[i][j].st == b){
                ctx.fillStyle = "gray"
            }
            else if(g[i][j].st == e){
                ctx.fillStyle = "white"
            }
            else{
                console.log(`Nínó`);
            }
            ctx.fillRect(pencil.posx, pencil.posy, particleSize - border, particleSize - border)
            pencil.posx += particleSize

        }
        pencil.posy += particleSize
        pencil.posx = 0
    }
}

function move(){
    for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
            g[i][j].didMove = false
        }
    }

    for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
            if(i != maxInCols - 1 && g[i][j].controllable && g[i][j].st == b && g[i][j].shouldMove && (g[i+1][j].st == b && !g[i+1][j].controllable)){
                stopControllables()
            }
        }
    }

    for (let i = g.length-1; i >= 0; i--) {
        for (let j = 0; j < g[i].length; j++) {
            let cell = g[i][j]
            if(i == maxInCols - 1 && cell.st == b && cell.shouldMove){
                stopControllables() //legalsó blockok álljanak meg
            }
            else if (cell.st == b && cell.shouldMove && g[i+1][j].st == b){ //
                stopControllables()
            }
            else if(i != maxInCols - 1 && cell.st == b && g[i+1][j].st == e && cell.shouldMove && !cell.didMove){
                console.log(g[i][j]);
                changeST(g[i+1][j], g[i][j])
            }
        }
    }

    if(g.map((r) => r.filter((a) => a.shouldMove === true)).filter((r) => r.length != 0).length == 0){
        Cell.placeNewPiece(g, next)
    }
    drawFrame()
}

function stopControllables(){
    let stopThem = []
    for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
            if(g[i][j].controllable){
                stopThem.push(g[i][j])
            }
        }
    }

    for (let stopIt of stopThem) {
        stopIt.controllable = false
        stopIt.shouldMove = false
        stopIt.didMove = true
    }
}

function changeST(c1, c2){
    let temp = {st: c2.st, shouldMove: c2.shouldMove, didMove: c2.didMove, controllable: c2.controllable}
    c2.st = c1.st
    c2.shouldMove = c1.shouldMove
    c2.didMove = true
    c2.controllable = c1.controllable

    c1.st = temp.st
    c1.shouldMove = temp.shouldMove
    c1.didMove = true
    c1.controllable = temp.controllable
}


































document.querySelector("body").addEventListener("keydown", function(e) {
    if(e.key == "ArrowLeft"){
        let control = g.flatMap(row => row.filter(obj => obj.controllable === true));


        console.log(control);
    }
}) 









document.querySelector("body").addEventListener("click", move)
drawFrame()