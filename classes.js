let e = "empty"
let b = "block"

let colorTable = {
    "I" : "cyan",
    "J" : "blue",
    "L" : "orange",
    "O" : "yellow",
    "S" : "green",
    "T" : "purple",
    "Z" : "red"
}

let borderColorAmount = 100

class Color{
    constructor(c){
        if(c == "white" || c == window.getComputedStyle(document.body, null).getPropertyValue('background-color')){
            this.def = c
            this.light = c
            this.dark = c
        }else{
            this.def = c
            this.light = Color.decrease(nameToRgb(c), -borderColorAmount)
            this.dark = Color.decrease(nameToRgb(c), borderColorAmount)
        }

    }
    
    static decrease(c, amount) {
        return `rgb(${Math.max(0, Math.min(255, c[0] - amount))}, ${Math.max(0, Math.min(255, c[1] - amount))}, ${Math.max(0, Math.min(255, c[2] - amount))})`;
    }
}

class Cell{
    constructor(isEmpty, type, center = false){
        if(isEmpty){
            this.st = e
            this.shouldMove = false
            this.didMove = false
            this.controllable = false
            this.type = e
            this.center = false
            this.color = new Color("white")
        }
        else{
            this.st = b
            this.shouldMove = true
            this.didMove = false
            this.controllable = true
            this.type = type
            this.center = center
            this.color = new Color(colorTable[type])
        }
    }

    static placeNewPiece(g, center, t){
        // let t = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        switch (t) {
            case "I":
                for (let o = 0; o < 4; o++) {
                    if(o == 1){
                        replace(new Cell(false, t, true), g[0][o + center])
                    }
                    else{
                        replace(new Cell(false, t), g[0][o + center])
                    }
                }
                break
            case "J":
                for (let o = 0; o < 3; o++) {
                    if(o == 1){
                        replace(new Cell(false, t, true), g[1][o + center])
                    }
                    else{
                        replace(new Cell(false, t), g[1][o + center])
                    }
                }
                replace(new Cell(false, t), g[0][center])
                break
            case "O": 
                for (let o = 1; o < 3; o++) {
                    replace(new Cell(false, t), g[1][o + center])
                }
                for (let o = 1; o < 3; o++) {
                    replace(new Cell(false, t), g[0][o + center])
                }
                break
            case "L":
                for (let o = 0; o < 3; o++) {
                    if(o == 1){
                        replace(new Cell(false, t, true), g[1][o + center])
                    }
                    else{
                        replace(new Cell(false, t), g[1][o + center])
                    }

                }
                replace(new Cell(false, t), g[0][center + 2])
                break
            case "S":
                for (let o = 0; o < 2; o++) {
                    replace(new Cell(false, t), g[1][center + o])
                }
                for (let o = 0; o < 2; o++) {
                    if(o == 0){
                        replace(new Cell(false, t, true), g[0][center + o + 1])
                    }
                    else{
                        replace(new Cell(false, t), g[0][center + o + 1])
                    }
                }
                break;
            case "Z":
                for (let o = 0; o < 2; o++) {
                    replace(new Cell(false, t), g[1][2 + center - o])
                }
                for (let o = 0; o < 2; o++) {
                    if(o == 0){
                        replace(new Cell(false, t, true), g[0][center - o + 1])
                    }
                    else{
                        replace(new Cell(false, t), g[0][center - o + 1])
                    }
                }
                break;
            case "T":
                replace(new Cell(false, t), g[0][center + 1])
                for (let o = 0; o < 3; o++) {
                    if(o == 1){
                        replace(new Cell(false, t, true), g[1][center + o])
                    }
                    else{
                        replace(new Cell(false, t), g[1][center + o])
                    }
                }
                break;
        }
    }
}