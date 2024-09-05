import * as chessObj from './chessObj.js'

const gameBoard = document.getElementById('ChessGame')
const chessContainer = document.getElementById('ChessContainer')
const settingsMenu= document.getElementById('ChessSettings')
const startGameBtn = document.getElementById("GameStart")

const colorSelector = document.getElementById('chosenColor')
const botDifficultyMenu = document.getElementById('BotDificulty')
const onlineMenu = document.getElementById('OnlineMultyplayer')
const hostMenu = document.getElementById('Host')
const ipPeregraph = document.getElementById('hostOut')
const joinMenu = document.getElementById('Join')

const columnLetter = chessObj.columnId
const chessBoard = new chessObj.chessBoard()

const gameSettings = {
    playerColor     :-1,
    playerOption    :-1,
    ComDificulty    :-1,
    LobbyHost       :false,
    LobbyIp         :""
}

const updateBoardMove = (moves)=>{
    moves.forEach(element => {
        const currBlock = document.getElementById(`${columnLetter[element[0]]}-${element[1]}`)
        currBlock.style.backgroundColor ='gray'
    });
}

const updateBoardCellPrep = ()=>{
    Array.from(gameBoard.children).forEach(element => {
        element.style.backgroundColor = (element.className === 'White') ? 'white' : 'rgb(133, 66, 4)';
        element.innerHTML = ""
    });
}

const updateBoardAlive = (alivePices) =>{
    for (const piece of alivePices){
        const block = document.getElementById(`${columnLetter[piece.col]}-${piece.rank}`)
        block.style.color = piece.color ? 'brown':'white'
        block.innerHTML = `<img src="${piece.img}">`
    }
}

const pieceClick = () =>{
    let target = event.target;
    if (target.tagName === 'IMG') {
        target = target.parentElement;  // Get the parent <div> element
    }
    const id = target.id
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
const updateGameSettings= () => {
    gameSettings['playerOption'] = parseInt(document.querySelector('input[name=PlayerType]:checked').value)
   
    onlineMenu.hidden = true;
    botDifficultyMenu.hidden = true;
    colorSelector.hidden = true;

    if (gameSettings['playerOption'] > 0){
        colorSelector.hidden = false;
        gameSettings['playerColor'] = parseInt(document.querySelector('input[name=Dificulty]:checked').value === 0) ? 0:1
    }

    //TODO:For Multyplayer Make change IP to player's ip if hosting the game
    switch(gameSettings['playerOption']){
        case(1):
            botDifficultyMenu.hidden = false 
            gameSettings['ComDificulty'] = parseInt(document.querySelector('input[name=Dificulty]:checked').value)
            break;
        case(2):
            onlineMenu.hidden = false

            gameSettings['LobbyHost'] = parseInt(document.querySelector('input[name=OnlineHost]:checked').value)
            gameSettings['LobbyIp'] = document.querySelector('input[name=gameIp]').value
        
            joinMenu.hidden = true
            hostMenu.hidden = true
            
            if (gameSettings['LobbyHost']) { 
                hostMenu.hidden = false 
                ipPeregraph.textContent = gameSettings.LobbyIp || 'XXX.XXX.XXX.XXX::XXXX'
            }
            else {
                colorSelector.hidden = true 
                joinMenu.hidden = false
            }
        break;
    }
}

const StartGame = () =>{
    console.log('StartGame')
    updateGameSettings();
    chessContainer.hidden = false;
    settingsMenu.hidden = true;
    console.log(gameSettings)

    generateBoard()
    
    chessBoard.resetBoard()
    
    updateBoardAlive(chessBoard.pieces)

    console.log(chessBoard.getStateStr())    
}
const EndGame = () =>{}

settingsMenu.addEventListener('click', updateGameSettings)
startGameBtn.addEventListener('click', StartGame)
