ctx.fillStyle = "black"
ctx.fillRect(0, 0, width, height)

let g = []
let next = []
let pause = false
let fps = 2
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
                console.log(`Nínó: ${g[i][j].st}`);
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
    let temp = {st: c2.st, shouldMove: c2.shouldMove, controllable: c2.controllable}
    c2.st = c1.st
    c2.shouldMove = c1.shouldMove
    c2.controllable = c1.controllable
    
    c1.st = temp.st
    c1.shouldMove = temp.shouldMove
    c1.controllable = temp.controllable

    c2.didMove = true
    c1.didMove = true
}


















document.querySelector("body").addEventListener("keydown", function(event) {
    let control = []
    if(event.key == "ArrowLeft" || event.key.toLowerCase() == "a"){
        for (let i = 0; i < g.length; i++) {
            for (let j = 0; j < g[i].length; j++) {
                if(g[i][j].controllable){
                    control.push({cell: g[i][j], x: j, y: i})
                }
            }
        }

        isPossible = true
        for (let i = 0; i < control.length; i++) {
            let neighbour = g[control[i].y][control[i].x-1]
            if(!(isPossible && control[i].x != 0 && (neighbour.st == e || neighbour.controllable))){
                isPossible = false
            }
        }

        console.log(isPossible);
        if(isPossible){
            for (let i = 0; i < control.length; i++) {
                changeST(g[control[i].y][control[i].x-1], control[i].cell)
            }
            drawFrame()
        }
    }

    if(event.key == "ArrowRight" || event.key.toLowerCase() == "d"){
        for (let i = 0; i < g.length; i++) {
            for (let j = 0; j < g[i].length; j++) {
                if(g[i][j].controllable){
                    control.push({cell: g[i][j], x: j, y: i})
                }
            }
        }

        isPossible = true
        for (let i = 0; i < control.length; i++) {
            let neighbour = g[control[i].y][control[i].x+1]
            if(!(isPossible && control[i].x != maxInRows-1 && (neighbour.st == e || neighbour.controllable))){
                isPossible = false
            }
        }

        console.log(isPossible);
        if(isPossible){
            for (let i = control.length-1; i >= 0; i--) {
                changeST(g[control[i].y][control[i].x+1], control[i].cell)
            }
            drawFrame()
        }
    }








    if(event.key == "ArrowDown" || event.key.toLowerCase() == "s"){
        move()
    }
}) 

document.querySelector("body").addEventListener("click", move)
drawFrame()
let moveInterval = setInterval(move, 1000/fps)