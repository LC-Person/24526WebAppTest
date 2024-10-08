export const columnId =  ['a','b','c','d','e','f','g','h'];

//Important state Deffinintions
const STATE_COLOR = 1<<9
const STATE_HASMOVED = 1 << 2
const STATE_LASTMOVED = 1 << 1
const STATE_ATTACKING = 1

const STATE_PAWN = 1 << 8
const STATE_KNIGHT = 1 << 7
const STATE_BISHOP = 1 << 6
const STATE_ROOK = 1 << 5
const STATE_QUEEN = 1 << 4
const STATE_KING = 1 << 3
const STATE_EMPTYSPACE = 0
export class chessBoard{
    constructor(){
        this.pieces = []
        this.piecesCaptured = []
        this.turn = 0;
        this.targetPiece = ""
        this.promotePieceIdx = 0
    }
    
    resetBoard(){
        this.emptyBoard()

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

    emptyBoard (){
        this.pieces = []
        this.piecesCaptured = []
        this.turn = 0;
        this.targetPiece = ""
        this.promotePieceIdx = 0
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

    getDetailState(){
        const board = []
        for(let rank =0; rank< 8 ; rank++){
            board.push([])
            for(let col =0; col< 8 ; col++){
                board[rank].push(STATE_EMPTYSPACE)
            }
        }

        
        for(const currPiece of this.pieces){
            let PieceState = 0
            
            PieceState = PieceState | (currPiece.color << 9)
            PieceState = PieceState | (currPiece.hasMoved << 2)

            switch (currPiece.constructor.name){
                case 'Pawn':
                    PieceState = PieceState | (STATE_PAWN)
                    break;
                case 'Knight':
                    PieceState = PieceState | (STATE_KNIGHT)
                    break;
                case 'Bishop':
                    PieceState = PieceState | (STATE_BISHOP)
                    break;
                case 'Rook':
                    PieceState = PieceState | (STATE_ROOK)
                    break;
                case 'Queen':
                    PieceState = PieceState | (STATE_QUEEN)
                    break;
                case 'King':
                    PieceState = PieceState | (STATE_KING)
                    break;
                default:
                    PieceState = PieceState | 0
            }
            board[currPiece.rank][currPiece.col] = PieceState;
        }

        return board
    }

    getStateStr(){
        const board = this.getDetailState()
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
        if (this.targetPiece === "GameEnded") { return }
        this.targetPiece=''
        
        const possiblyCapturedPiece = this.findPiece(x,y);
        const pieceMoved = this.getPiece(pieceId);
        const foundMove = pieceMoved.getMoves(this.getDetailState()).find(el => JSON.stringify(el) === JSON.stringify([x,y]))

        if(foundMove === undefined){
            if(possiblyCapturedPiece) {this.targetPiece = possiblyCapturedPiece.id}
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
                if (possiblyCapturedPiece.constructor.name === "King"){
                    this.targetPiece = "GameEnded"
                }

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
            }
        }
        else{
            const pIndex =this.pieces.indexOf(pieceMoved) 
            this.pieces[pIndex].updatePos(x,y)
            this.pieces[pIndex].hasMoved  = !this.pieces[pIndex].hasMoved
        }
        
        if (this.targetPiece !== 'GameEnded') {this.targetPiece='Valid'}
        this.turn++
    }
    
}

export class Piece {
    constructor(rank, column, id, color){
        this.rank=rank;
        this.col=column;
        this.id = id
        this.color = color; // false = white
        this.value=-1;
        this.hasMoved = false
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
    constructor(rank, column, id, color){
        super(rank, column, id, color)
        this.value = 1
        this.endGoal = color ? 1 : 6;
        this.img="/Public/PageRoot/Games/Chess/chessImg/P"+ (color?"black":"white") + ".png"
    }

    moveForward(state, color){
        let moves = []
        if(this.rank  < 7 && this.rank > 0){
            console.log(state[this.rank+ color][this.col])
            if(state[this.rank+ color][this.col] === STATE_EMPTYSPACE){
                moves.push([ this.col, this.rank+ color])
            }

            if ( (this.rank === 6 && this.color) || (this.rank === 1 && !this.color)){
                //No jumps
                if (moves.length >= 1 && state[this.rank + color*2][this.col] === STATE_EMPTYSPACE)
                {    
                    moves.push([ this.col , this.rank + (color*2)])
                }
            }
        }
        return moves
    }

    takePiece(state, march){
        let moves = []

        const color = this.color?STATE_COLOR:0
        if(this.rank < 7 && this.rank > 0){
            if (this.col < 7) {
                let pState = state[this.rank + march][this.col + 1];
                if (pState !== STATE_EMPTYSPACE && !((pState & STATE_COLOR) === color)) {
                    moves.push([this.col + 1, this.rank + march]);
                }
            }
        
            if (this.col > 0) {
                let pState = state[this.rank + march][this.col - 1];
                if (pState !== STATE_EMPTYSPACE && !((pState & STATE_COLOR) === color)) {
                    moves.push([this.col - 1, this.rank + march]);
                }
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
    constructor(rank, column, id, color){
        super(rank, column, id, color)
        this.value = 3
        this.img="/Public/PageRoot/Games/Chess/chessImg/N"+ (color?"black":"white") + ".png"
    }

    getYCoords(){ return [this.rank + 1, this.rank + 2, this.rank - 1,this.rank - 2] }

    getXCoords(){ return [this.col + 1, this.col + 2, this.col - 1 ,this.col - 2] }
    
    getLs(state){
        let moves = []
        const yDiff = this.getYCoords()
        const xDiff = this.getXCoords()
        
        for (let y =0; y < yDiff.length; y++){
            
            if (yDiff[y] < 0 || yDiff[y] > 7){ continue }

            for (let x = 0; x < xDiff.length; x++){
                if (xDiff[x] < 0 || xDiff[x] > 7){ continue }
                if (x %2  ===  y%2 ) { continue }
                if ((state[yDiff[y]][xDiff[x]] & STATE_COLOR) === this.color) { continue }
                
                moves.push([xDiff[x], yDiff[y]])
            }
        }
        return moves
    }

    getMoves(state){
        let possibleMoves = []

        this.getLs(state).forEach(el => possibleMoves.push(el))

        return possibleMoves
    }
}
export class Bishop extends Piece{
    constructor(rank, column, id, color){
        super(rank, column, id, color)
        this.value = 3
        this.img="/Public/PageRoot/Games/Chess/chessImg/B"+ (color?"black":"white") + ".png"
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
        const mult = !this.color;
        this.getDiagonals(state,mult).forEach(el => possibleMoves.push(el))
        return possibleMoves
    }
    
}

export class Rook extends Piece{
    constructor(rank, column, id, color){
        super(rank, column, id, color)
        this.value = 5
        this.img="/Public/PageRoot/Games/Chess/chessImg/R"+ (color?"black":"white") + ".png"
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
        const mult = !this.color;//black:white 

        this.getLines(state, mult).forEach(el => possibleMoves.push(el))
        return possibleMoves
    }
    
}

export class Queen extends Piece{
    constructor(rank, column, id, color){
        super(rank, column, id, color)
        this.value = 9
        this.img="/Public/PageRoot/Games/Chess/chessImg/Q"+ (color?"black":"white") + ".png"
    }

    static getLines(state, xIncrement, yIncrement, rank, col, colorStp){
        let moves = []
        for(let i = 1; i < 8; i++){
            const newRank = (xIncrement * i) + rank
            const newCol = (yIncrement * i) + col
            
            if (newRank > 7 || newRank < 0 || newCol < 0 || newCol > 7) { break }

            if((state[newRank][newCol]) === STATE_EMPTYSPACE){
                moves.push([newCol, newRank])
            }
            else if(!!(state[newRank][newCol] & STATE_COLOR) === !!colorStp){
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
        const colorStop = !this.color;

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
    constructor(rank, column, id, color){
        super(rank, column, id, color)
        this.value = 14
        this.img="/Public/PageRoot/Games/Chess/chessImg/K"+ (color?"black":"white") + ".png"
    }

    kingWalk(state, frendly){
        let moves = []
        
        for(let i = -1; i < 2; i++)
        {
            for (let j = -1; j < 2; j++){
                const newRank = this.rank + i
                const newCol = this.col + j

                if ( newRank<0 || newRank >7 ||  newCol<0 || newCol >7) { continue }
                if ((i === 0 && j === i)) { continue }
                if ((state[newRank][newCol]  !==  STATE_EMPTYSPACE) && (!!(state[newRank][newCol] & STATE_COLOR) ===  !!frendly)) {continue}
                moves.push([newCol,newRank])
                
            }
        }

        return moves
    }

    castle(state, frendly){
        let moves = []
        if(!this.hasMoved) {
            let rank = this.color? 7:0;
            if (state[rank][0] === frendly){ moves.push(['0-0-0'])}
            if (state[rank][7] === frendly){ moves.push(['0-0'])}
        }
        return moves
    }

    getMoves(state){
        let possibleMoves = []
        const colorteam = this.color;

        this.kingWalk(state, colorteam).forEach(el => possibleMoves.push(el))
        this.castle(state, colorteam).forEach(el => possibleMoves.push(el))

        return possibleMoves
    }
    
}

// AI Functions
export class AI_Analyse {
    static analyseState(state){
        let boardValue = 0
        for (const row of state){
            for(const piece of row){
                if (piece === STATE_EMPTYSPACE){ continue }
                const mult = (piece & STATE_COLOR) ? -1 : 1;
                if (piece & STATE_PAWN){
                    console.log('hello')
                    boardValue += (1 * mult )
                }
                else if (piece & STATE_BISHOP){
                    boardValue += (3 * mult )
                }
                else if  (piece & STATE_KNIGHT){
                    boardValue += (3 * mult )
                }
                else if  (piece & STATE_ROOK){
                    boardValue += (5 * mult )
                }
                else if  (piece & STATE_QUEEN){
                boardValue += (9 * mult )
                }
                else if  (piece & STATE_KING){
                boardValue += (1000 * mult )
                }
            }
        }
        return boardValue
    }


    static getMoves(pieces, state, color){
        let moves = []
        pieces.forEach( piece =>{
            //console.log(piece.id, `${color} !== ${piece.color}`)
            if (color !== piece.color) { return }
            const currPMoves = piece.getMoves(state)
            currPMoves.forEach(el => {moves.push([el[0], el[1], piece.id ,piece.rank, piece.col])})
        });
        return moves
    }

    static analyseMove([coord1,coord2, id, rank, col], state){

        let newState = state.map(row => [...row]);
        newState[coord2][coord1] = state[rank][col]
        newState[rank][col] = STATE_EMPTYSPACE

        //TODO:Special cases (promotion, castle ...)
        /*
            if (stuff)
        */
        //console.log(newState)
        return [this.analyseState(newState), newState] 
    }

    static getRandomInt(max){
        return Math.floor(Math.random() * max)
    }
}
export class ChessAI {
    constructor(color){
        this.color = color // false = white
    }


    getNextMove(pieces, state){
        if (pieces.length < 1 ) { return null }
    }
}

export class EzAI extends ChessAI {
    getNextMove(pieces, state){
        const AvailableMoves = AI_Analyse.getMoves(pieces,state, this.color)
        if (AvailableMoves.length < 1) { return null }
        return AvailableMoves[AI_Analyse.getRandomInt(AvailableMoves.length)]
    }
}

export class GeedAI extends ChessAI {
    getNextMove(pieces, state){
        const AvailableMoves = AI_Analyse.getMoves(pieces, state, this.color)
        if (AvailableMoves.length < 1) { return null }

        let BestmoveIdx = [[-1], 100000 * (this.color? 1 : -1)]
        for (let i=0; i <  AvailableMoves.length; i++){
             
            const [value, newState] = AI_Analyse.analyseMove(AvailableMoves[i], state)

            if ((this.color && BestmoveIdx[1] > value) || (!this.color && BestmoveIdx[1] < value)){
                BestmoveIdx[0] = [i]
                BestmoveIdx[1] = value
            }
            else if (value === BestmoveIdx[1])
            {
                BestmoveIdx[0].push(i)
            }
            
        }
        BestmoveIdx[0] = BestmoveIdx[0].length !== 1 ? BestmoveIdx[0][AI_Analyse.getRandomInt(BestmoveIdx[0].length)] : BestmoveIdx[0][0] 
        console.log(AvailableMoves[BestmoveIdx[0]], BestmoveIdx)
        AvailableMoves[BestmoveIdx[0]].splice(3,2)
        return AvailableMoves[BestmoveIdx[0]]
    }
}