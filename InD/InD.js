import { BASE_POSITIONS, HOME_ENTRANCE, HOME_POSITIONS, PLAYERS, SAFE_POSITIONS, START_POSITIONS, STATE, TURNING_POINTS, LADDERS, SNAKES } from './constants.js';
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

        // this.diceValue = 4;
        // this.turn = 0;
        // this.state = STATE.DICE_ROLLED;
        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceClick();

        this.resetGame();
        // this.setPiecePosition('P1', 0, 0);
        // this.setPiecePosition('P2', 0, 1);
        // this.diceValue = 6;
        // console.log(this.getEligiblePieces('P1'))
        
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

            if(
                HOME_ENTRANCE[player].includes(currentPosition)
                && this.diceValue > HOME_POSITIONS[player] - currentPosition
                ) {
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
                alert(`Player: ${player} cannot move beyond 100! Stay at ${currentPosition}`);
                this.incrementTurn();
                return;
            }
    
            // Move the piece incrementally
            this.incrementPiecePosition(player, piece);
            moveSteps--;
    
            if (moveSteps === 0) {
                clearInterval(interval);
    
                // Wait for the CSS transition to complete before checking for ladders or snakes
                pieceElement.addEventListener('transitionend', () => {
                    const finalPosition = this.currentPositions[player][piece];
    
                    // After the full move is made, check for ladders or snakes
                    if (LADDERS.hasOwnProperty(finalPosition)) {
                        const ladderPosition = LADDERS[finalPosition];
                        console.log(`Ladder! Moving from ${finalPosition} to ${ladderPosition}`);
                        this.setPiecePosition(player, piece, ladderPosition);
                        this.currentPositions[player][piece] = ladderPosition; // Update position
                    }
    
                    if (SNAKES.hasOwnProperty(finalPosition)) {
                        const snakePosition = SNAKES[finalPosition];
                        console.log(`Snake! Moving from ${finalPosition} to ${snakePosition}`);
                        this.setPiecePosition(player, piece, snakePosition);
                        this.currentPositions[player][piece] = snakePosition; // Update position
                    }
    
                    // Check if the player has won
                    if (this.currentPositions[player][piece] === 100) {
                        if (this.hasPlayerWon(player)) {
                            alert(`Player: ${player} has won!`);
                            this.resetGame();
                            return;
                        }
                    }
    
                    // Check for a "kill" (opponent's piece in the same position)
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

            if(currentPosition === opponentPosition && !SAFE_POSITIONS.includes(currentPosition)) {
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
        this.setPiecePosition(player, piece, this.getIncrementedPosition(player, piece));
    }
    
    getIncrementedPosition(player, piece) {
        const currentPosition = this.currentPositions[player][piece];

        if(currentPosition === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0];
        }
        else if(currentPosition === 100) {
            return currentPosition + 1;
        }
        return currentPosition + 1;
    }
}