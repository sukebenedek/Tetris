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

    static placeNewPiece(g){
        // let t = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        let t = randomElement(["I", "J", "L", "O", "S", "T", "Z"])
        let center = Math.floor(maxInRows/2) - 2
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

function replace(withwhat, pos){
    if(pos.st == b){
        end()
    }
    else{
        changeST(pos, withwhat)
    }

}
