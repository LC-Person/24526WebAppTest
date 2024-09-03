import * as chessObj from './chessObj.js'

const gameBoard = document.getElementById('ChessGame')

const columnLetter = chessObj.columnId

const updateBoardMove = (moves)=>{
    moves.forEach(element => {
        const currBlock = document.getElementById(`${columnLetter[element[0]]}-${element[1]}`)
        currBlock.style.backgroundColor ='gray'
    });
}

const updateBoardCellPrep = ()=>{
    Array.from(gameBoard.children).forEach(element => {
        element.style.backgroundColor = (element.className === 'White') ? 'white' : 'rgb(133, 103, 4)';
        element.textContent = ""
    });
}

const updateBoardAlive = (alivePices) =>{
    for (const piece of alivePices){
        const block = document.getElementById(`${columnLetter[piece.col]}-${piece.rank}`)
        block.style.color = piece.color ? 'brown':'white'
        block.textContent = piece.id 
    }
}

const pieceClick = () =>{
    const id = event.target.id
    let cords = id.split('-')
    cords = [columnLetter.indexOf(cords[0]), parseInt(cords[1])]
    console.log(`hi from ${id}, ${cords}`)
    updateBoardCellPrep()
    
    if (chessBoard.lastPieceTuched !== "") {
        chessBoard.updateMove(cords[0], cords[1], chessBoard.lastPieceTuched)
        chessBoard.lastPieceTuched = ""
    }

    if(chessBoard.lastPieceTuched === "ded"){
        chessBoard.lastPieceTuched = ""
    }
    else
    {
        const currPiece = chessBoard.findPiece(cords[0],cords[1])
        if(currPiece != undefined){
            updateBoardMove(currPiece.getMoves(chessBoard.getState()));  
            chessBoard.lastPieceTuched= currPiece.id
        }
    }
    
     
    updateBoardAlive(chessBoard.pieces)
    
}

const generateBoard = () => {
    const size = 8;
    
    for (let rank =1; rank <= size; rank++){
        for (let col = 0; col< size; col++){
            const block = document.createElement('div')
            block.id = columnLetter[col] + '-' + (size-rank)
            if((rank+col) %2 === 1){
                block.classList.add('White')
            }
            else
            {
                block.classList.add('Black')
            }
            block.addEventListener('click', pieceClick)
            gameBoard.appendChild(block)
        }
    }
}

generateBoard()
const chessBoard = new chessObj.chessBoard()
chessBoard.resetBoard()
updateBoardAlive(chessBoard.pieces)
console.log(chessBoard.getStateStr())