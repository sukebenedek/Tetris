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
            if(g[i][j].st == b){
                ctx.fillStyle = "gray"
            }
            else{
                ctx.fillStyle = "white"
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

    for (let i = g.length-1; i >= 0; i--) {
        for (let j = 0; j < g[i].length; j++) {
            let cell = g[i][j]
            if(i == maxInCols - 1 && cell.st == b){
                cell.shouldMove = false
            }
            else if(i != maxInCols - 1 && cell.st == b && (g[i+1][j].st == e || g[i+1][j].shouldMove == true) && !cell.didMove){
                g[i+1][j].st = b
                g[i][j].st = e
                g[i+1][j].shouldMove = true
                g[i][j].shouldMove = false
                g[i+1][j].didMove = true
                g[i][j].didMove = true
            }
            else if (cell.st == b && cell.shouldMove == true){
                cell.shouldMove = false
            }
        }
    }

    console.log();
    if(g.map((r) => r.filter((a) => a.shouldMove === true)).filter((r) => r.length != 0).length == 0){
        Cell.placeNewPiece(g, next)
    }



    drawFrame()
}




































document.querySelector("body").addEventListener("keydown", function(e) {
    if(e.key == "ArrowLeft"){
        let control = g.flatMap(row => row.filter(obj => obj.controllable === true));


        console.log(control);
    }
}) 









document.querySelector("body").addEventListener("click", move)
drawFrame()