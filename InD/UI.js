import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from './constant/constants.js';

const diceButtonElement = document.querySelector('#dice-btn');
const playerPiecesElements = {
    P1: document.querySelectorAll('[player-id="P1"].player-piece'),
    P2: document.querySelectorAll('[player-id="P2"].player-piece'),
}

export class UI {

    static listenStartClick(callback) {
        document.querySelector('button#start-btn').addEventListener('click', callback)
    }

    static listenCloseClick(callback) {
        document.querySelector('button#close-btn').addEventListener('click', callback)
    }

    static listenDiceClick(callback) {
        const audio = document.getElementById('dice-roll-sound'); 

        diceButtonElement.addEventListener('click', () => {
            audio.play()
            callback();  
        });
    }

    static listenResetClick(callback) {
        document.querySelector('button#reset-btn').addEventListener('click', callback)
    }

    static listenPieceClick(callback) {
        document.querySelector('.player-pieces').addEventListener('click', callback)
    }

    /**
     * 
     * @param {string} player 
     * @param {Number} piece 
     * @param {Number} newPosition 
     */
    static setPiecePosition(player, piece, newPosition) {
        if(!playerPiecesElements[player] || !playerPiecesElements[player][piece]) {
            console.error(`Player element of given player: ${player} and piece: ${piece} not found`)
            return;
        }

        const [x, y] = COORDINATES_MAP[newPosition];

        const pieceElement = playerPiecesElements[player][piece];
        pieceElement.style.top = y * STEP_LENGTH + '%';
        pieceElement.style.left = x * STEP_LENGTH + '%';
    }

    static setTurn(index) {
        if(index < 0 || index >= PLAYERS.length) {
            console.error('index out of bound!');
            return;
        }
        
        const player = PLAYERS[index];

        // Display player ID
        if (player === 'P1') {
            document.querySelector('.active-player').classList.remove('green');
            document.querySelector('.active-player').classList.add('blue');
            document.querySelector('.active-player span').innerText = "Blue";
        } else {
            document.querySelector('.active-player').classList.remove('blue');
            document.querySelector('.active-player').classList.add('green');
            document.querySelector('.active-player span').innerText = "Green";
        }

        const activePlayerBase = document.querySelector('.player-base.highlight');
        if(activePlayerBase) {
            activePlayerBase.classList.remove('highlight');
        }
        // highlight
        document.querySelector(`[player-id="${player}"].player-base`).classList.add('highlight')
    }

    static enableDice() {
        diceButtonElement.removeAttribute('disabled');
    }

    static disableDice() {
        diceButtonElement.setAttribute('disabled', '');
    }

    /**
     * 
     * @param {string} player 
     * @param {Number[]} pieces 
     */
    static highlightPieces(player, pieces) {
        pieces.forEach(piece => {
            const pieceElement = playerPiecesElements[player][piece];
            pieceElement.classList.add('highlight');
        })
    }

    static unhighlightPieces() {
        document.querySelectorAll('.player-piece.highlight').forEach(ele => {
            ele.classList.remove('highlight');
        })
    }

    static setDiceValue(value) {
        document.querySelector('.dice-value').innerText = value;
    }

    
    static showWordScramble(type) {
        document.querySelector('.container').classList.remove('hide');
        initGame(type);  // Start the word scramble game
    }

    static listenForScrambleResult(callback) {
        const checkBtn = document.querySelector('button#check-btn');
        const surrendBtn = document.querySelector('button#surrend-btn');
        const timeDisplay = document.querySelector('.time b');

        let maxTime = 30; // Example time limit of 30 seconds

        // Reset and start the timer
        timeDisplay.innerText = maxTime;
        let timer = setInterval(() => {
            if (maxTime > 0) {
                maxTime--;
                timeDisplay.innerText = maxTime;
            } else {
                clearInterval(timer); // Timer ends
                callback(false);  // Timer expired, so challenge is failed
                document.querySelector('.container').classList.add('hide');  // Hide scramble UI
            }
        }, 1000);  // Update every second

        // Listen for player's word submission
        checkBtn.addEventListener('click', () => {
            const inputField = document.querySelector('.input-field');
            const scrambledWord = inputField.value.trim().toLowerCase();

            if (scrambledWord === correctWord.toLowerCase()) {
                clearInterval(timer); // Stop the timer on correct submission
                callback(true);  // Success
            } else {
                clearInterval(timer); // Stop the timer on incorrect submission
                callback(false);  // Failure
            }

            document.querySelector('.container').classList.add('hide'); // Hide scramble UI
        });

        // Handle surrender (if applicable)
        surrendBtn.addEventListener('click', () => {
            clearInterval(timer);  // Stop the timer
            callback(false);  // Player gave up, failure callback
            document.querySelector('.container').classList.add('hide');
        });
    }
}

// UI.setPiecePosition('P1', 0, 0);
// UI.setTurn(0);
// UI.setTurn(1);

// UI.disableDice();
// UI.enableDice();
// UI.highlightPieces('P1', [0]);
// UI.unhighlightPieces();
// UI.setDiceValue(5);