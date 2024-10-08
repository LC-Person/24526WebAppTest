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

const winnerContainer = document.getElementById("winnerContainer")
const winnerMessage = document.getElementById("winnerMessage")
const playAgain = document.getElementById("PlayAgain")
const SettingsReset = document.getElementById("SettingsOpen")

let BoardBlocks = {}

const columnLetter = chessObj.columnId
const chessBoard = new chessObj.chessBoard()

const gameSettings = {
    playerColor     :-1,
    playerOption    :-1,
    ComDificulty    :-1,
    LobbyHost       :false,
    LobbyIp         :""
}
//Online Local AI
let PLAYERS = ['', '']
let AI = null

const updateBoardMove = (moves)=>{
    moves.forEach(element => {
        const currBlock = BoardBlocks[`${columnLetter[element[0]]}-${element[1]}`]
        if (currBlock){currBlock.style.backgroundColor ='gray'}
    });
}

const updateBoardCellPrep = ()=>{
    for (const [key, value] of Object.entries(BoardBlocks)){
        value.style.backgroundColor = (value.className === 'White') ? 'white' : 'rgb(133, 66, 4)';
        value.innerHTML = ""
    }
}

const updateBoardAlive = (alivePices) =>{
    for (const piece of alivePices){
        const block = BoardBlocks[`${columnLetter[piece.col]}-${piece.rank}`]
        if(block){
            block.style.color = piece.color ? 'brown':'white'
            block.innerHTML = `<img src="${piece.img}">`
        }
    }
}

const updateBoardMoveHelp = (x,y) => {
    const currPiece = chessBoard.findPiece(x,y)
    if(currPiece != undefined){
        updateBoardMove(currPiece.getMoves(chessBoard.getDetailState()));  
        chessBoard.targetPiece= currPiece.id
    }
}

const Human_Play = () =>{}
const COM_PLay = () => {
    return AI.getNextMove(chessBoard.pieces, chessBoard.getDetailState())
}

const pieceClick = () =>{
    console.log(chessBoard.getStateStr())    
    console.log(chessBoard.turn, chessBoard.targetPiece)
    //check if the game has ended
    if (chessBoard.targetPiece === "GG") { return }
    
    
    let target = event.target;
    if (target.tagName === 'IMG') { target = target.parentElement }
    const id = target.id
    
    let cords = id.split('-')
    cords = [columnLetter.indexOf(cords[0]), parseInt(cords[1])]
    updateBoardCellPrep()

    let NextMove = []
    switch (PLAYERS[(chessBoard.turn +1)% 2]){
        case ('Online'):
            break
        case ('AI'):
            NextMove = COM_PLay()
            chessBoard.updateMove(NextMove[0],NextMove[1],NextMove[2])
            break
        case ('Local'):
        default:
            if (chessBoard.targetPiece !== ""){
                chessBoard.updateMove(cords[0],cords[1], chessBoard.targetPiece)
            }

    }
    /*
    //temp hyjack
    if (chessBoard.targetPiece !== ""){
        chessBoard.updateMove(cords[0],cords[1], chessBoard.targetPiece)
    }
    */

    if (chessBoard.targetPiece === "GameEnded"){
        chessBoard.targetPiece = "GG"
        EndGame()
    } 
    if (chessBoard.targetPiece === "Valid") { 
        chessBoard.targetPiece = ''
    }
    else if (chessBoard.targetPiece !== "GG"){
        updateBoardMoveHelp(cords[0],cords[1])
    }

    updateBoardAlive(chessBoard.pieces)
    
    console.log(chessBoard.turn, chessBoard.targetPiece)
}

const generateBoard = () => {
    const size = 8;
    BoardBlocks = {}
    
    for (let rank =1; rank <= size; rank++){
        for (let col = 0; col< size; col++){
            const block = document.createElement('div')
            const id = columnLetter[col] + '-' + (size-rank)
            block.id = id

            if((rank+col) %2 === 1){
                block.classList.add('White')
            }
            else
            {
                block.classList.add('Black')
            }

            block.addEventListener('click', pieceClick)
            gameBoard.appendChild(block)

            BoardBlocks[id] = block
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
        gameSettings['playerColor'] = parseInt(document.querySelector('input[name=Color]:checked').value )
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

const rematch = ()=>{
    winnerContainer.hidden = true
    chessBoard.resetBoard()
    updateBoardCellPrep()
    updateBoardAlive(chessBoard.pieces)
}
const OpenSettings = ()=>{
    chessBoard.emptyBoard()
    chessContainer.hidden = true
    settingsMenu.hidden = false
    winnerContainer.hidden = true
    gameBoard.innerHTML = ""
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

    if(gameSettings['playerOption'] === 0){
        PLAYERS = ['Local', 'Local']
    } else if (gameSettings['playerOption'] === 1) {
        const pColor = gameSettings['playerColor'] === 1 
        PLAYERS = pColor ? ['Local', 'AI'] : ['AI', 'Local']
        switch (gameSettings['ComDificulty']){
            case(1):
                AI = new chessObj.GeedAI(!pColor)
                break
            case(0):
            default:        
                AI = new chessObj.EzAI(!pColor)
        }
    }
    console.log(chessBoard.getStateStr())    
}
const EndGame = () =>{  
    winnerMessage.textContent = `Congratulations ${chessBoard.turn%2===0? "Black" : "White"}, You Win!`
    winnerContainer.hidden = false
}

settingsMenu.addEventListener('click', updateGameSettings)
startGameBtn.addEventListener('click', StartGame)
SettingsReset.addEventListener('click', OpenSettings)
playAgain.addEventListener('click', rematch)