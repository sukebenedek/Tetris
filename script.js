ctx.fillStyle = "black"
ctx.fillRect(0, 0, width, height)

let g = []
let lines = 0
let pause = false
let didStart = false
let moveInterval

let fps = 2.5
let maxfps = 5.5
let fpsIncrease = 0.45

let topScore = 0
let cookie = document.cookie
if (cookie[0] == undefined){
    document.cookie = "0"
}
else{
    topScore = Number(cookie)
}
document.getElementById("T").innerHTML += topScore

for (let i = 0; i < maxInCols; i++){
    g.push([])
    for (let j = 0; j < maxInRows; j++) {
        g[i].push(new Cell(true))
    }
}

Cell.placeNewPiece(g, Math.floor(maxInRows/2) - 2, randomElement(["I", "J", "L", "O", "S", "T", "Z"]))

let pencil = {posx: 0, posy: 0}
function drawFrame(){
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    pencil.posx = 0
    pencil.posy = 0
    for (let i = 0; i < g.length; i++) {
        for (let j = 0; j < g[i].length; j++) {
            if(g[i][j].controllable){
                drawCell(g[i][j].color, pencil, ctx)
            }
            else if(g[i][j].shouldMove){
                // drawCell("lightblue")
                drawCell(g[i][j].color, pencil, ctx)
            }
            else if(g[i][j].st == b){
                // drawCell("#b4b4b4")
                drawCell(g[i][j].color, pencil, ctx)
            }
            else if(g[i][j].st == e){
                drawCell("white", pencil, ctx)
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
            if(i == maxInCols - 1 && cell.st == b && cell.shouldMove && cell.controllable){
                stopControllables() //legalsó blockok álljanak meg
                cell.shouldMove = false
            }
            else if(i == maxInCols - 1 && cell.st == b && cell.shouldMove){
                cell.shouldMove = false
            }
            else if (cell.st == b && cell.shouldMove && g[i+1][j].st == b && cell.controllable){ //
                stopControllables()
                cell.shouldMove = false
            }
            else if (cell.st == b && cell.shouldMove && g[i+1][j].st == b){ //
                cell.shouldMove = false
            }
            else if(i != maxInCols - 1 && cell.st == b && g[i+1][j].st == e && cell.shouldMove && !cell.didMove){
                changeST(g[i+1][j], g[i][j])
            }
        }
    }

    let linesCount = 0
    let theRow = null
    for (let i = g.length - 1; i >= 0; i--) {
        if(g[i].every(block => block.st == b && !block.controllable && !block.shouldMove) || g[i].every(block => block.st == b && !block.controllable && block.shouldMove)){
            theRow = i
            for (let j = 0; j < g[theRow].length; j++) {
                g[theRow][j] = new Cell(true)
            }
            for (let i = theRow; i >= 0; i--) {
                for (let j = 0; j < g[i].length; j++) {
                    if(g[i][j].st == b){
                        g[i][j].shouldMove = true
                        g[i][j].didMove = false
                    }
                }
            }
            document.getElementById("L").innerHTML = `Lines - ${++lines}`
            linesCount++
            if(lines % 10 == 0){
                fps += fpsIncrease
                explode()
                document.getElementById("E").innerHTML = `Level - ${((lines - (lines % 10)) / 10) + 1}`
                
            }
        }
    }

    if(linesCount != 0){
        let score = Number(document.getElementById("S").innerHTML.split(" - ")[1])
        if(!isNaN(score)){
            document.getElementById("S").innerHTML = `Score - ${score + calcScore(linesCount)}`
        }
        else{
            document.getElementById("S").innerHTML = `Score - ${calcScore(linesCount)}`
        }
        if(Number(document.getElementById("S").innerHTML.split(" - ")[1]) > topScore){
            topScore = Number(document.getElementById("S").innerHTML.split(" - ")[1])
            document.cookie = topScore
        }
    }

    if(g.map((r) => r.filter((a) => a.shouldMove == true && a.controllable)).filter((r) => r.length != 0).length == 0){
        Cell.placeNewPiece(g, Math.floor(maxInRows/2) - 2, nextPiece)
        nextPiece = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        drawNext()
        if(pause){
            return;
        }
    }

    drawFrame()
}

function calcScore(linesCount){
    return (linesCount * 100 * (1 + (linesCount - 1) * 0.5)) * 0.8
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

function end(){
    clearInterval(moveInterval)
    pause = true
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = "red"
    ctx.font = "60px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("You lost!", width/2, height/2 - 35);
    ctx.fillText(`Score - ${document.getElementById("S").innerHTML.split(" - ")[1]}`, width/2, height/2 + 35)
}



document.querySelector("body").addEventListener("keydown", function(event) {
    if(!pause && didStart){
        let control = []
        if(event.key == "ArrowLeft" || event.key.toLowerCase() == "a"){
            for (let i = 0; i < g.length; i++) {
                for (let j = 0; j < g[i].length; j++) {
                    if(g[i][j].controllable){
                        control.push({cell: g[i][j], x: j, y: i})
                    }
                }
            }

            let isPossible = true
            for (let i = 0; i < control.length; i++) {
                let neighbour = g[control[i].y][control[i].x-1]
                if(!(isPossible && control[i].x != 0 && (neighbour.st == e || neighbour.controllable))){
                    isPossible = false
                }
            }

            if(isPossible){
                for (let i = 0; i < control.length; i++) {
                    changeST(g[control[i].y][control[i].x-1], control[i].cell)
                }
                drawFrame()
            }
        }

        if(event.key == "ArrowRight" || event.key.toLowerCase() == "d"){
            let control = []
            for (let i = 0; i < g.length; i++) {
                for (let j = 0; j < g[i].length; j++) {
                    if(g[i][j].controllable){
                        control.push({cell: g[i][j], x: j, y: i})
                    }
                }
            }

            let isPossible = true
            for (let i = 0; i < control.length; i++) {
                let neighbour = g[control[i].y][control[i].x+1]
                if(!(isPossible && control[i].x != maxInRows-1 && (neighbour.st == e || neighbour.controllable))){
                    isPossible = false
                }
            }

            if(isPossible){
                for (let i = control.length-1; i >= 0; i--) {
                    changeST(g[control[i].y][control[i].x+1], control[i].cell)
                }
                drawFrame()
            }
        }

        if(event.key == "ArrowUp" || event.key.toLowerCase() == "w" || event.key.toLowerCase() == "r"){
            let control = []
            for (let i = 0; i < g.length; i++) {
                for (let j = 0; j < g[i].length; j++) {
                    if(g[i][j].controllable){
                        control.push({cell: g[i][j], x: j, y: i})
                    }
                }
            }

            let type = control[0].cell.type
            if(type == "O"){
                return;
            }

            let center = null
            for (let c of control) {
                if(c.cell.center){
                    // console.log(c.x + ", " + c.y);
                    // clearInterval(moveInterval)
                    center = {x: c.x, y: c.y}
                }
            }

            let list = []
            let indexes = []
            for (let i = center.y - 1; i <= center.y + 1; i++) {
                list.push([])
                for (let j = center.x - 1; j <= center.x + 1; j++) {
                    list[i - (center.y - 1)].push(g[i][j])
                    indexes.push({x: j, y: i})
                }
            }

            if(type == "I"){
                list = []
                indexes = []
                for (let i = center.y - 2; i <= center.y + 2; i++) {
                    list.push([])
                    for (let j = center.x - 2; j <= center.x + 2; j++) {
                        list[i - (center.y - 2)].push(g[i][j])
                        indexes.push({x: j, y: i})
                    }
                }
            }


            let isPossible = true
            for (let cell of list.flat(1)) {
                if((isPossible && cell.st == b && !cell.controllable)){
                    isPossible = false
                }
            }

            if(isPossible){
                rotate(list)
                list = list.flat(1)
                // console.log(list);
                for (let i = 0; i < indexes.length; i++) {
                    const coordinate = indexes[i];
                    g[coordinate.y][coordinate.x] = list[i]
                }
            }

            drawFrame()
        }

        if(event.key == "ArrowDown" || event.key.toLowerCase() == "s"){
            clearInterval(moveInterval)
            move()
            moveInterval = setInterval(move, 1000/fps)
        }
    }

    if((event.key == " " || event.key == "Enter") && !didStart){
        didStart = true
        drawFrame()
        drawNext()
        document.getElementById("N").style.display = "block"
        moveInterval = setInterval(move, 1000/fps)
    }
})

function explode(){
    let div = document.getElementById("explosion")
    div.style.backgroundImage = "url(imidzs/explosion.gif)"
    div.style.position = "relative"
    setTimeout(function() {
        div.style.backgroundImage = "";
        div.style.position = "absolute"
    }, 1100);
}

function rotate(matrix){ //https://leetcode.com/problems/rotate-image/solutions/4257626/js/
    for(let row = 0; row < matrix.length; row++)
        for(let col = row; col < matrix[row].length; col++)
            [matrix[row][col], matrix[col][row]] = [ matrix[col][row], matrix[row][col] ];
    
    for(let row = 0; row < matrix.length; row++)
        matrix[row].reverse();
    
    return matrix;
}

document.querySelector("body").addEventListener("click", () => {
    if(!pause && didStart){
        move()
    }
})

ctx.font = "37px Comic Sans MS";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "lightblue"
ctx.fillText("Press Space to start!", width/2, height/2)












