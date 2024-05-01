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

ctx.fillStyle = "black"
ctx.fillRect(0, 0, width, height)

let g = []
let lines = 0
let pause = false
let firstTime = true
let paused = true
let didStart = false
let moveInterval

let fps = 2.5
let maxfps = 7.5
let fpsIncrease = 0.5

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

let nextPiece = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
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
                drawCell(new Color("white"), pencil, ctx)
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
                drawCell(new Color(window.getComputedStyle(document.body, null).getPropertyValue('background-color')), pencil, ctx2)
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

function nameToRgb(name) { //https://stackoverflow.com/questions/26414770/getting-the-rgb-values-for-a-css-html-named-color-in-javascript
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.fillStyle = name;
    context.fillRect(0,0,1,1);
    let d = context.getImageData(0,0,1,1).data
    return [d[0], d[1], d[2]]
}

function drawCell(color, pencil, ctx){
    let borderSize = 3.5
    ctx.fillStyle = color.def
    ctx.fillRect(pencil.posx, pencil.posy, particleSize - border, particleSize - border)

    ctx.fillStyle = color.light
    ctx.fillRect(pencil.posx, pencil.posy, particleSize - border, borderSize);
    ctx.fillRect(pencil.posx, pencil.posy, borderSize, particleSize - border)
    ctx.fillStyle = color.dark
    ctx.fillRect(pencil.posx, pencil.posy + particleSize - border - borderSize, particleSize - border, borderSize)
    ctx.fillRect(pencil.posx + particleSize - border - borderSize, pencil.posy, borderSize, particleSize - border);
}

function changeST(c1, c2){
    let temp = {st: c2.st, shouldMove: c2.shouldMove, controllable: c2.controllable, type: c2.type, center: c2.center, color: c2.color.def}
    c2.st = c1.st
    c2.shouldMove = c1.shouldMove
    c2.controllable = c1.controllable
    c2.type = c1.type
    c2.center = c1.center
    c2.color = new Color(c1.color.def)

    
    c1.st = temp.st
    c1.shouldMove = temp.shouldMove
    c1.controllable = temp.controllable
    c1.type = temp.type
    c1.center = temp.center
    c1.color = new Color(temp.color)

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
    document.getElementById("N").style.display = "none"
    document.getElementById("nextC").style.display = "none"
    pp.style.display = "none"
    let div = document.getElementById("restart")
    div.innerHTML = "Restart"
    div.style.position = "fixed"
}

function replace(withwhat, pos){
    if(pos.st == b){
        end()
    }
    else{
        changeST(pos, withwhat)
    }

}

document.querySelector("body").addEventListener("keydown", keydown)
function keydown(event) {
    if(!pause && didStart && paused){
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
            let virtualRotate = rotate(list)
            let rotatedC = []

            for (let i = 0; i < virtualRotate.length; i++) {
                for (let j = 0; j < virtualRotate[i].length; j++) {
                    if(virtualRotate[i][j].controllable){
                        rotatedC.push({cell: virtualRotate[i][j], x: j, y: i})
                    }
                }
            }

            // for (let cell of list.flat(1)) {
            //     if((isPossible && cell.st == b && !cell.controllable)){
            //         isPossible = false
            //     }
            // }

            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].length; j++) {
                    if(list[i][j].controllable){
                        list[i][j] = new Cell(true)
                    }
                }
            }

            for (let i = 0; i < rotatedC.length; i++) {
                let rortatedControllable = rotatedC[i]
                let cellOnThatPlace = list[rortatedControllable.y][rortatedControllable.x]
                if((isPossible && !cellOnThatPlace.controllable && cellOnThatPlace.st == b)){
                    console.log(cellOnThatPlace);
                    isPossible = false
                }
            }

            // for (let i = 0; i < list.length; i++) {
            //     for (let j = 0; j < list[i].length; j++) {
            //         let cell = list[i][j]
            //         let rotatedcell = virtualRotate[i][j]
            //         console.log(e + b);
            //         console.log(cell.st + ": " + cell.controllable + ", " + rotatedcell.st + ": " + rotatedcell.controllable);
            //         if(isPossible && ((cell.st == b && !cell.controllable && (rotatedcell.st == e || rotatedcell.controllable)))){
            //             isPossible = false
            //         }
            //     }
            // }

            if(isPossible){
                for (let i = 0; i < rotatedC.length; i++) {
                    let rortatedControllable = rotatedC[i]
                    let cellOnThatPlace = list[rortatedControllable.y][rortatedControllable.x]
                    changeST(cellOnThatPlace, rortatedControllable.cell)
                }


                list = list.flat(1)
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
    
    if((event.key == " ")){
        PP()
    }

    if((event.key == " " || event.key == "Enter") && !didStart){
        didStart = true
        drawFrame()
        drawNext()
        document.getElementById("N").style.display = "block"
        // moveInterval = setInterval(move, 1000/fps) 
    }


}

function explode(){
    let div = document.getElementById("explosion")
    div.style.backgroundImage = "url(imidzs/explosion.gif)"
    div.style.position = "fixed"
    setTimeout(function() {
        div.style.backgroundImage = "";
        div.style.position = "fixed"
    }, 1100);
}

// function rotate(matrix){ //https://leetcode.com/problems/rotate-image/solutions/4257626/js/
//     for(let row = 0; row < matrix.length; row++)
//         for(let col = row; col < matrix[row].length; col++)
//             [matrix[row][col], matrix[col][row]] = [ matrix[col][row], matrix[row][col] ];
    
//     for(let row = 0; row < matrix.length; row++)
//         matrix[row].reverse();
    
//     return matrix;
// }

function rotate(matrix) {
    const n = matrix.length;
    const rotatedMatrix = [];
    
    // Create a new matrix filled with zeros
    for (let i = 0; i < n; i++) {
        rotatedMatrix.push(new Array(n).fill(0));
    }

    // Populate the rotated matrix
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            rotatedMatrix[col][n - 1 - row] = matrix[row][col];
        }
    }

    return rotatedMatrix;
}


// document.querySelector("body").addEventListener("click", () => {
//     if(!pause && didStart){
//         move()
//     }
// })

ctx.font = "37px Comic Sans MS";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "lightblue"
ctx.fillText("Press Space to start!", width/2, height/2)

let isItOut = false
let set = document.getElementById("set")
let setdiv = document.querySelector(".settings")
set.addEventListener("click", () => {
    isItOut = !isItOut
    if(setdiv.style.display == "none"){
        setdiv.style.display = "block"
    }
    else{
        setdiv.style.display = "none"
    }
})

let pp = document.getElementById("P")
pp.addEventListener("click", PP)
function PP(){
    if(firstTime){
        pp.src = "imidzs\\pause.png"
        firstTime = false
        paused = false
        keydown({key: " "})
    }
    else{
        if(paused){
            pp.src = "imidzs\\play.png"
            clearInterval(moveInterval)
        }
        else{
            pp.src = "imidzs\\pause.png"
            moveInterval = setInterval(move, 1000/fps)
        }
        paused = !paused
    }
}

select = document.querySelector("#theme");
webBody =  document.querySelector("body");
select.addEventListener('change', changeTheme);

document.querySelector("#Border").addEventListener('change', () => {
    if (document.querySelector("#Border").checked) {
        border = 1.2
    }
    else{
        border = 0
    }
    if(!pause && didStart){
        drawFrame()
    }
});


function changeTheme(){
    if (select.value == "default"){
        webBody.style.backgroundColor = "#061330"
        webBody.style.color = "white"
        webBody.style.backgroundImage = "none";
        webBody.style.fontFamily = "Comic Sans MS";
    }
    if (select.value == "dark"){
        webBody.style.backgroundColor = "black"
        webBody.style.color = "white"
        webBody.style.backgroundImage = "none";
        webBody.style.fontFamily = "Arial"

    }
    if (select.value == "light"){
        webBody.style.backgroundColor = "bisque"
        webBody.style.color = "darkslategray"
        webBody.style.backgroundImage = "none";
        webBody.style.fontFamily = "cursive"
    }
    if (select.value == "egypt"){
        webBody.style.backgroundImage = `url("imidzs/piramisok.jpg")`;
        webBody.style.backgroundRepeat = "no-repeat";
        webBody.style.backgroundSize = "cover"
        webBody.style.color = "blanchedalmond"
        webBody.style.fontFamily = "'Times New Roman', Times, serif"
    }
    if (select.value == "cyber"){
        webBody.style.backgroundImage = `url("imidzs/cyber.jpg")`;
        webBody.style.backgroundRepeat = "no-repeat";
        webBody.style.backgroundSize = "cover"
        webBody.style.color = "cyan"
        webBody.style.fontFamily = "'Courier New', Courier, monospace"

    }
}