let e = "empty"
let b = "block"

class Cell{
    constructor(isEmpty, type, center = false){
        if(isEmpty){
            this.st = e
            this.shouldMove = false
            this.didMove = false
            this.controllable = false
            this.type = e
            this.center = false
        }
        else{
            this.st = b
            this.shouldMove = true
            this.didMove = false
            this.controllable = true
            this.type = type
            this.center = center
        }
    }

    static placeNewPiece(g, next){
        // let t = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        let t = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        let center = Math.floor(maxInRows/2) - 2
        switch (t) {
            case "I":
                for (let o = 0; o < 4; o++) {
                    g[0][o + center] = new Cell(false, t)
                }
                break
            case "J":
                for (let o = 0; o < 3; o++) {
                    if(o == 1){
                        g[1][o + center] = new Cell(false, t, true)
                    }
                    else{
                        g[1][o + center] = new Cell(false, t)
                    }
                }
                g[0][center] = new Cell(false, t)
                break
            case "O": 
                for (let o = 1; o < 3; o++) {
                    g[1][o + center] = new Cell(false, t)
                }
                for (let o = 1; o < 3; o++) {
                    g[0][o + center] = new Cell(false, t)
                }
                break
            case "L":
                for (let o = 0; o < 3; o++) {
                    if(o == 1){
                        g[1][o + center] = new Cell(false, t, true)
                    }
                    else{
                        g[1][o + center] = new Cell(false, t)
                    }

                }
                g[0][center + 2] = new Cell(false, t)
                break
            case "S":
                for (let o = 0; o < 2; o++) {
                    g[1][center + o] = new Cell(false, t)
                }
                for (let o = 0; o < 2; o++) {
                    if(o == 1){
                        g[0][center + o + 1] = new Cell(false, t, true)
                    }
                    else{
                        g[0][center + o + 1] = new Cell(false, t)
                    }
                }
                break;
            case "Z":
                for (let o = 0; o < 2; o++) {
                    g[1][2 + center - o] = new Cell(false, t)
                }
                for (let o = 0; o < 2; o++) {
                    if(o == 0){
                        g[0][center - o + 1] = new Cell(false, t, true)
                    }
                    else{
                        g[0][center - o + 1] = new Cell(false, t)
                    }
                }
                break;
            case "T":
                g[0][center + 1] = new Cell(false, t)
                for (let o = 0; o < 3; o++) {
                    if(o == 1){
                        g[1][center + o] = new Cell(false, t, true);
                    }
                    else{
                        g[1][center + o] = new Cell(false, t);
                    }
                }
                break;
        }
    }
}
