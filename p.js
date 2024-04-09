let e = "empty"
let b = "block"

class Cell{
    constructor(isEmpty, type){
        if(isEmpty){
            this.st = e
            this.shouldMove = false
            this.didMove = false
            this.controllable = false
            this.type = e
        }
        else{
            this.st = b
            this.shouldMove = true
            this.didMove = false
            this.controllable = true
            this.type = type
        }
    }

    static placeNewPiece(g, next){
        // let t = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        let t = randomElement(["I", "J","O"])
        let center = Math.floor(maxInRows/2) - 2
        switch (t) {
            case "I":
                for (let o = 0; o < 4; o++) {
                    g[0][o + center] = new Cell(false, t)
                }
                break
            case "J":
                for (let o = 0; o < 3; o++) {
                    g[1][o + center] = new Cell(false, t)
                }
                g[0][center] = new Cell(false)
                break
            case "O": 
                for (let o = 1; o < 3; o++) {
                    g[1][o + center] = new Cell(false, t)
                }
                for (let o = 1; o < 3; o++) {
                    g[0][o + center] = new Cell(false, t)
                }
                break
            }
    }
}
