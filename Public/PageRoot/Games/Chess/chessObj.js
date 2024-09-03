export const columnId =  ['a','b','c','d','e','f','g','h'];

export class chessBoard{
    constructor(){
        this.pieces = []
        this.piecesCaptured = []
        this.turn = 0;
        this.lastPieceTuched = ""
        this.promotePieceIdx = 0
    }
    
    resetBoard(){
        for( let i =0; i<8; i++)
        {
            this.pieces.push( new Pawn(1, i, `${i}wp`, false))
            this.pieces.push( new Pawn(6, i, `${i}bp`, true))
        }
    
        this.pieces.push(new Rook(0,0, `${0}wr`, false))
        this.pieces.push(new Rook(0,7, `${1}wr`, false))
        this.pieces.push(new Rook(7,7, `${0}br`, true))
        this.pieces.push(new Rook(7,0, `${1}br`, true))

        this.pieces.push(new Knight(0,1, `${0}wn`, false))
        this.pieces.push(new Knight(0,6, `${1}wn`, false))
        this.pieces.push(new Knight(7,6, `${0}bn`, true))
        this.pieces.push(new Knight(7,1, `${1}bn`, true))

        this.pieces.push(new Bishop(0,2, `${0}wb`, false))
        this.pieces.push(new Bishop(0,5, `${1}wb`, false))
        this.pieces.push(new Bishop(7,5, `${0}bb`, true))
        this.pieces.push(new Bishop(7,2, `${1}bb`, true))

        this.pieces.push(new Queen(0,3, `${0}wq`, false))
        this.pieces.push(new King(0,4, `${1}wk`, false))
        this.pieces.push(new King(7,4, `${0}bk`, true))
        this.pieces.push(new Queen(7,3, `${1}bq`, true))       

    }

    getState(){
        const board = []
        for(let rank =0; rank< 8 ; rank++){
            board.push([])
            for(let col =0; col< 8 ; col++){
                //board[rank].push(this.turn%2===0? 'w' : 'b')
                board[rank].push('E')
            }
        }

        
        for(const currPiece of this.pieces){
            board[currPiece.rank][currPiece.col] = currPiece.color? "B": "W";
        }

        return board
    }

    getStateStr(){
        const board = this.getState()
        board.forEach(element => element= element.join(' '));
        return board.join('\n')
    }

    findPiece(x,y){
        return  this.pieces.find(currPiece=> (currPiece.rank === y && currPiece.col === x))
    }

    getPiece(searchId){
        return this.pieces.find(currPiece =>  currPiece.id === searchId)
    }

    updateMove(x,y, pieceId){
        const possiblyCapturedPiece = this.findPiece(x,y);
        const pieceMoved = this.getPiece(pieceId);
        
        const foundMove = pieceMoved.getMoves(this.getState()).find(el => JSON.stringify(el) === JSON.stringify([x,y]))

        if(foundMove === undefined){
            return
        }

        if (this.turn % 2 === (pieceMoved.color?0:1)){
            return
        }

        if(possiblyCapturedPiece != undefined)
        {
            const possiblyCapturedIdx = this.pieces.indexOf(possiblyCapturedPiece)
            if (possiblyCapturedIdx > -1) {    
                this.piecesCaptured.push(this.pieces.splice(possiblyCapturedIdx, 1))
                this.lastPieceTuched = "ded"
                console.log(`Piece ${possiblyCapturedPiece.constructor.name} Captured`)
            }
        }

        if (pieceMoved.constructor.name === 'Pawn' && pieceMoved.rank === pieceMoved.endGoal){
            //promote
            
            const pieceMovedIdx = this.pieces.indexOf(pieceMoved)
            if (pieceMovedIdx > -1) {    
                this.pieces.splice(pieceMovedIdx, 1)
                this.pieces.push(new Queen(y,x,`${this.promotePieceIdx}${pieceMoved.color?'b':'w'}P`,pieceMoved.color))
                this.promotePieceIdx++
                this.lastPieceTuched = "ded"
            }
        }
        else{
            this.pieces[this.pieces.indexOf(pieceMoved)].updatePos(x,y)
        }

        this.turn++
    }
    
}

export class Piece {
    constructor(rank, column, id, colour){
        this.rank=rank;
        this.col=column;
        this.id = id
        this.color = colour; // false = white
        this.value=-1;
    }

    getPos(){
        return  (this.rank, this.col)
    }

    updatePos(x,y){
        this.rank = y;
        this.col  = x;
    }
    
    getMoves(state){
        return []
    }
}

export class Pawn extends Piece{
    constructor(rank, column, id, colour){
        super(rank, column, id, colour)
        this.value = 1
        this.endGoal = colour ? 1 : 6;
    }

    moveForward(state, color){
        let moves = []
        if(this.rank  < 7 && this.rank > 0){
            if(state[this.rank+ color][this.col] === 'E'){
                moves.push([ this.col, this.rank+ color])
            }

            if ( (this.rank === 6 && this.color) || (this.rank === 1 && !this.color)){
                //No jumps
                if (moves.length >= 1 && state[this.rank + color*2][this.col] === 'E')
                {    
                    moves.push([ this.col , this.rank + (color*2)])
                }
            }
        }
        return moves
    }

    takePiece(state, color){
        let moves = []

        const team = this.color? ['E', 'B'] : ['E','W']; 
        if(this.rank < 7 && this.rank > 0){
            if(this.col < 7 && !(team.includes(state[this.rank + color][this.col + 1]))){
                moves.push([ this.col+1, this.rank+color])
            }
            if(this.col > 0 && !(team.includes(state[this.rank + color][this.col - 1]))){
                moves.push([this.col-1, this.rank+color])
            }

        }
        return moves;
    }

    getMoves(state){
        let possibleMoves = []
        const mult = this.color? -1 : 1;//black:white 
        
        this.moveForward(state,mult).forEach( el => {possibleMoves.push(el)})
        this.takePiece(state,mult).forEach( el => {possibleMoves.push(el)})

        return possibleMoves
    }
}

export class Knight extends Piece{
    constructor(rank, column, id, colour){
        super(rank, column, id, colour)
        this.value = 3
    }

    getYCoords(){ return [this.rank + 1, this.rank + 2, this.rank - 1,this.rank - 2] }

    getXCoords(){ return [this.col + 1, this.col + 2, this.col - 1 ,this.col - 2] }
    
    getLs(state, colorSelf){
        let moves = []
        const yDiff = this.getYCoords()
        const xDiff = this.getXCoords()
        
        for (let y =0; y < yDiff.length; y++){
            
            if (yDiff[y] < 0 || yDiff[y] > 7){ continue }

            for (let x = 0; x < xDiff.length; x++){
                if (xDiff[x] < 0 || xDiff[x] > 7){ continue }
                if (x %2  ===  y%2 ) { continue }
                if (state[yDiff[y]][xDiff[x]] === colorSelf) { continue }
                
                moves.push([xDiff[x], yDiff[y]])
            }
        }
        return moves
    }

    getMoves(state){
        let possibleMoves = []
        const mult = this.color? 'B' : 'W';//black:white 

        this.getLs(state, mult).forEach(el => possibleMoves.push(el))

        return possibleMoves
    }
}

export class Bishop extends Piece{
    constructor(rank, column, id, colour){
        super(rank, column, id, colour)
        this.value = 3
    }
    
    getDiagonals(state, colorStop){
        let moves = []
       
        Queen.getLines(state,1,1, this.rank, this.col, colorStop).forEach(el => moves.push(el))
        Queen.getLines(state,-1,-1, this.rank, this.col, colorStop).forEach(el => moves.push(el))
        Queen.getLines(state,-1,1, this.rank, this.col, colorStop).forEach(el => moves.push(el))
        Queen.getLines(state,1,-1, this.rank, this.col, colorStop).forEach(el => moves.push(el))

        return moves
    }

    
    getMoves(state){
        let possibleMoves = []
        const mult = this.color? 'W' : 'B';
        this.getDiagonals(state,mult).forEach(el => possibleMoves.push(el))
        return possibleMoves
    }
    
}

export class Rook extends Piece{
    constructor(rank, column, id, colour){
        super(rank, column, id, colour)
        this.value = 5
    }
    getLines(state, colorStop){
        let moves = []
        
        Queen.getLines(state,0,1, this.rank, this.col, colorStop).forEach(el => moves.push(el))
        Queen.getLines(state,0,-1, this.rank, this.col, colorStop).forEach(el => moves.push(el))
        Queen.getLines(state,1,0, this.rank, this.col, colorStop).forEach(el => moves.push(el))
        Queen.getLines(state,-1,0, this.rank, this.col, colorStop).forEach(el => moves.push(el))

        return moves
    }


    getMoves(state){
        let possibleMoves = []
        const mult = this.color? 'W' : 'B';//black:white 

        this.getLines(state, mult).forEach(el => possibleMoves.push(el))
        return possibleMoves
    }
    
}

export class Queen extends Piece{
    constructor(rank, column, id, colour){
        super(rank, column, id, colour)
        this.value = 9
    }

    static getLines(state, xIncrement, yIncrement, rank, col, colorStp){
        let moves = []
        for(let i = 1; i < 8; i++){
            const newRank = (xIncrement * i) + rank
            const newCol = (yIncrement * i) + col

            if (newRank > 7 || newRank < 0 || newCol < 0 || newCol > 7) { break }

            if(state[newRank][newCol] === 'E'){
                moves.push([newCol, newRank])
            }
            else if(state[newRank][newCol] === colorStp){
                moves.push([newCol, newRank])
                break
            }
            else{
                break
            }
        }
        return moves
    }

    getMoves(state){
        let possibleMoves = []
        const colorStop = this.color? 'W' : 'B';

        //diagonal
        Queen.getLines(state,1,1, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))
        Queen.getLines(state,-1,-1, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))
        Queen.getLines(state,-1,1, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))
        Queen.getLines(state,1,-1, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))
        
        //line
        Queen.getLines(state,0,1, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))
        Queen.getLines(state,0,-1, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))
        Queen.getLines(state,1,0, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))
        Queen.getLines(state,-1,0, this.rank, this.col, colorStop).forEach(el => possibleMoves.push(el))

        return possibleMoves
    }
    
}

export class King extends Piece{
    constructor(rank, column, id, colour){
        super(rank, column, id, colour)
        this.value = 14
    }

    kingWalk(state, frendly){
        let moves = []
        
        for(let i = -1; i < 2; i++)
        {
            for (let j = -1; j < 2; j++){
                const newRank = this.rank + i
                const newCol = this.col + j

                if ( newRank<0 || newRank >7 ||  newCol<0 || newCol >7) { continue }
                if ((i === 0 && j === i)|| (state[newRank][newCol] ===  frendly)) { continue }
                moves.push([newCol,newRank])
            }
        }

        return moves
    }

    getMoves(state){
        let possibleMoves = []
        const colorteam = this.color? 'B' : 'W';

        this.kingWalk(state, colorteam).forEach(el => possibleMoves.push(el))

        return possibleMoves
    }
    
}
