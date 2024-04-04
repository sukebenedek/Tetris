ctx.fillStyle = "black"
ctx.fillRect(0, 0, width, height)

let g = []
let pause = false

for (let i = 0; i < maxInCols; i++) {
    g.push([])
    for (let j = 0; j < maxInRows; j++) {
        g[i].push(new EmptyCell(j, i)) // ez tetszik
    }
}

let pencil = {posx: 0, posy: 0}
function drawFrame(){
    new Piece(g)
    pencil.posx = 0
    pencil.posy = 0
    for (let i = 0; i < g.length; i++) {
        let row = g[i];
        for (let j = 0; j < row.length; j++) {
            let cell = row[j];

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

















































drawFrame()