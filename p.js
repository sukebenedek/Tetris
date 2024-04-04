let e = "empty"
let b = "block"

class EmptyCell{ //empty cell
    constructor(x, y){
        this.x = x
        this.y = y
        this.st = e
    }
}

class Cell{
    constructor(x, y, t){
        this.x = x
        this.y = y
        this.st = b
        this.t = t
    }
}

class Piece{
    constructor(g){
        // this.t = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        this.t = "I"
        switch (this.t) {
            case "I":
                for (let i = 0; i < 4; i++) {
                    g[0][i + Math.floor(maxInRows/2)] = new Cell(0, i + Math.floor(maxInRows/2), this.t)
                }
                break;
        }

    }
}