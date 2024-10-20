import { BASE_POSITIONS, HOME_POSITIONS, PLAYERS, START_POSITIONS, STATE, LADDERS, SNAKES } from './constants.js';
import { UI } from './UI.js';

export class InD {
    currentPositions = {
        P1: [],
        P2: []
    }

    _diceValue;
    get diceValue() {
        return this._diceValue;
    }
    set diceValue(value) {
        this._diceValue = value;

        UI.setDiceValue(value);
    }

    _turn;
    get turn() {
        return this._turn;
    }
    set turn(value) {
        this._turn = value;
        UI.setTurn(value);
    }

    _state;
    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;

        if(value === STATE.DICE_NOT_ROLLED) {
            UI.enableDice();
            UI.unhighlightPieces();
        } else {
            UI.disableDice();
        }
    }

    constructor() {
        console.log('Hello World! Lets play Ludo!');

        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();
        this.listenStartClick();

        this.resetGame();
    }

    listenStartClick() {
        UI.listenStartClick(this.onStartClick.bind(this))
    }

    onStartClick() {
        document.querySelector('.menu-screen').classList.add("hide");
        document.querySelector('.outer-container').classList.remove("hide"); 
    }

    listenDiceClick() {
        UI.listenDiceClick(this.onDiceClick.bind(this))
    }

    onDiceClick() {
        console.log('dice clicked!');
        this.diceValue = 1 + Math.floor(Math.random() * 6);
        this.state = STATE.DICE_ROLLED;
        
        this.checkForEligiblePieces();
    }

    checkForEligiblePieces() {
        const player = PLAYERS[this.turn];
        // eligible pieces of given player
        const eligiblePieces = this.getEligiblePieces(player);
        if(eligiblePieces.length) {
            // highlight the pieces
            UI.highlightPieces(player, eligiblePieces);
        } else {
            this.incrementTurn();
        }
    }

    incrementTurn() {
        this.turn = this.turn === 0 ? 1 : 0;
        this.state = STATE.DICE_NOT_ROLLED;
    }

    getEligiblePieces(player) {
        return [0].filter(piece => {
            const currentPosition = this.currentPositions[player][piece];

            if(currentPosition + this.diceValue > HOME_POSITIONS[player]) {
                return false;
            }

            if(
                BASE_POSITIONS[player].includes(currentPosition)
                && this.diceValue !== 6
            ){
                return false;
            }

            return true;
        });
    }

    listenResetClick() {
        UI.listenResetClick(this.resetGame.bind(this))
    }

    resetGame() {
        console.log('reset game');
        this.currentPositions = structuredClone(BASE_POSITIONS);

        PLAYERS.forEach(player => {
            [0].forEach(piece => {
                this.setPiecePosition(player, piece, this.currentPositions[player][piece])
            })
        });

        this.turn = 0;
        this.diceValue = '';
        this.state = STATE.DICE_NOT_ROLLED;
    }

    listenPieceClick() {
        UI.listenPieceClick(this.onPieceClick.bind(this));
    }

    onPieceClick(event) {
        const target = event.target;

        if(!target.classList.contains('player-piece') || !target.classList.contains('highlight')) {
            return;
        }
        console.log('piece clicked')

        const player = target.getAttribute('player-id');
        const piece = target.getAttribute('piece');
        this.handlePieceClick(player, piece);
    }

    handlePieceClick(player, piece) {
        console.log(player, piece);
        const currentPosition = this.currentPositions[player][piece];
        
        if(BASE_POSITIONS[player].includes(currentPosition)) {
            this.setPiecePosition(player, piece, START_POSITIONS[player]);
            this.state = STATE.DICE_NOT_ROLLED;
            return;
        }

        UI.unhighlightPieces();
        this.movePiece(player, piece, this.diceValue);
    }

    setPiecePosition(player, piece, newPosition) {
        this.currentPositions[player][piece] = newPosition;
        UI.setPiecePosition(player, piece, newPosition)
    }

    movePiece(player, piece, moveBy) {
        const pieceElement = document.querySelector(`.player-piece[player-id="${player}"][piece="${piece}"]`);
    
        let moveSteps = moveBy;
    
        const interval = setInterval(() => {
            const currentPosition = this.currentPositions[player][piece];
    
            // Prevent the piece from moving beyond 100
            if (currentPosition + moveSteps > 100) {
                clearInterval(interval);
                console.log(`Cannot move beyond 100: ${currentPosition} + ${moveSteps}`);
                this.incrementTurn();
                return;
            }
    
            // Move the piece incrementally
            this.incrementPiecePosition(player, piece);
            moveSteps--;
    
            if (moveSteps === 0) {
                clearInterval(interval);
    
                // Wait for the CSS transition to complete 
                pieceElement.addEventListener('transitionend', () => {
                    const finalPosition = this.currentPositions[player][piece];
    
                    if (LADDERS.hasOwnProperty(finalPosition)) {
                        const ladderPosition = LADDERS[finalPosition];
                        console.log(`Ladder! Moving from ${finalPosition} to ${ladderPosition}`);
                        this.setPiecePosition(player, piece, ladderPosition);
                        this.currentPositions[player][piece] = ladderPosition; 
                    }
    
                    if (SNAKES.hasOwnProperty(finalPosition)) {
                        const snakePosition = SNAKES[finalPosition];
                        console.log(`Snake! Moving from ${finalPosition} to ${snakePosition}`);
                        this.setPiecePosition(player, piece, snakePosition);
                        this.currentPositions[player][piece] = snakePosition; 
                    }
    
                    if (this.currentPositions[player][piece] === 100) {
                        if (this.hasPlayerWon(player)) {
                            alert(`Player: ${player} has won!`);
                            this.resetGame();
                            return;
                        }
                    }
    
                    const isKill = this.checkForKill(player, piece);
                    if (isKill || this.diceValue === 6) {
                        this.state = STATE.DICE_NOT_ROLLED;
                        return;
                    }
    
                    this.incrementTurn();
                }, { once: true });
            }
        }, 200);
    }
    

    checkForKill(player, piece) {
        const currentPosition = this.currentPositions[player][piece];
        const opponent = player === 'P1' ? 'P2' : 'P1';

        let kill = false;

        [0].forEach(piece => {
            const opponentPosition = this.currentPositions[opponent][piece];

            if(currentPosition === opponentPosition) {
                this.setPiecePosition(opponent, piece, BASE_POSITIONS[opponent][piece]);
                kill = true
            }
        });

        return kill
    }

    hasPlayerWon(player) {
        return [0].every(piece => this.currentPositions[player][piece] === HOME_POSITIONS[player])
    }

    incrementPiecePosition(player, piece) {
        const newPosition = this.getIncrementedPosition(player, piece);
        
        if (newPosition !== undefined) {
            this.setPiecePosition(player, piece, newPosition);
        } else {
            console.error(`Failed to increment position for player ${player}, piece ${piece}`);
        }
    }
    
    getIncrementedPosition(player, piece) {
        const currentPosition = this.currentPositions[player][piece];
    
        if (currentPosition === undefined) {
            console.error(`Invalid currentPosition for player ${player}, piece ${piece}`);
            return currentPosition; 
        }
    
        return currentPosition + 1;
    }
}