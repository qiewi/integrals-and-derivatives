import { COORDINATES_MAP, PLAYERS, STEP_LENGTH } from '../constants/position.js';

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
        const playerImage = document.getElementById('player-image');

        // Display player ID
        if (player === 'P1') {
            // document.querySelector('.active-player').classList.remove('green');
            // document.querySelector('.active-player').classList.add('yellow');
            document.querySelector('.active-player span').innerText = "Yellow";

            playerImage.src = 'InD/assets/yellow-player.png';
            document.getElementById('player-turn').style.backgroundColor = '#f7ca15'; // Optional: Blue background
        } else {
            // document.querySelector('.active-player').classList.remove('yellow');
            // document.querySelector('.active-player').classList.add('green');
            document.querySelector('.active-player span').innerText = "Green";

            playerImage.src = 'InD/assets/green-player.png'; 
            document.getElementById('player-turn').style.backgroundColor = '#00b550'; // Optional: Green background
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

    static showChallengePopup() {
        const container = document.querySelector('.challenge-container');
        const overlay = document.querySelector('.overlay');

        // Ensure the popup is hidden first
        container.style.display = 'none';
        container.classList.remove('show-popup');
        overlay.style.display = 'none';
        overlay.classList.remove('show-overlay');

        // Show after a delay 
        setTimeout(() => {
            overlay.style.display = 'block';
            container.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('show-overlay');
                container.classList.add('show-popup');
            }, 100); 
        }, 800);  
    }

    static hideChallengePopup() {
        const container = document.querySelector('.challenge-container');
        const overlay = document.querySelector('.overlay');

        // Hide both popup and overlay
        container.classList.remove('show-popup');
        container.style.display = 'none';
        overlay.classList.remove('show-overlay');
        overlay.style.display = 'none';
    }

    static showChallenge(type) {
        UI.showChallengePopup();  
        initGame(type);  
    }

    
    // static showWordScramble(type) {
    //     document.querySelector('.container').classList.remove('hide');
    //     initGame(type);  // Start the word scramble game
    // }

    static listenForResult(callback) {
        const checkBtn = document.querySelector('button#check-btn');
        const surrendBtn = document.querySelector('button#surrend-btn');
        const timeDisplay = document.querySelector('.time b');
        const wordText = document.querySelector('.word');  // Element to display the correct answer
        let maxTime = 30;
    
        timeDisplay.innerText = maxTime;
        let timer = setInterval(() => {
            if (maxTime > 0) {
                maxTime--;
                timeDisplay.innerText = maxTime;
            } else {
                clearInterval(timer);
                wordText.innerText = `<strong>Time's Up!</strong> <br> Correct Answer: ${correctAnswer}`;
                wordText.style.color = "red";  // Display the correct answer in red
                setTimeout(() => {
                    callback(false);
                    UI.hideChallengePopup();
                }, 3000);  // Wait for 3 seconds before hiding
            }
        }, 1000);
    
        checkBtn.addEventListener('click', () => {
            const inputField = document.querySelector('.input-field');
            const userAnswer = inputField.value.toLowerCase();
    
            if (userAnswer === correctAnswer) {
                clearInterval(timer);  
                wordText.innerHTML = "<strong>Correct!</strong>";
                wordText.style.color = "green";  // Highlight correct answer
                setTimeout(() => {
                    callback(true); 
                    UI.hideChallengePopup(); 
                }, 2000);  // Wait for 2 seconds before hiding
            } else {
                clearInterval(timer);  
                wordText.innerHTML = `<strong>Wrong!</strong> <br> Correct Answer: ${correctAnswer}`;
                wordText.style.color = "red";  // Highlight wrong answer
                setTimeout(() => {
                    callback(false);  
                    UI.hideChallengePopup(); 
                }, 3000);  // Wait for 3 seconds to show correct answer before hiding
            }
        });
    
        surrendBtn.addEventListener('click', () => {
            clearInterval(timer);  
            wordText.innerHTML = `Correct Answer: ${correctAnswer}`;
            wordText.style.color = "red";  // Show correct answer if surrender
            setTimeout(() => {
                callback(false);  
                UI.hideChallengePopup();  
            }, 3000);  // Wait for 3 seconds before hiding
        });
    }

    static showWinPopup(player) {
        const container = document.querySelector('div#win');
        const overlay = document.querySelector('.overlay');
        const playerColorElement = document.querySelector('.win-text span');
        const winIconElement = document.querySelector('.win-icon');
    
        playerColorElement.innerText = player === 'P1' ? 'Blue' : 'Green';

        if (player === 'P1') {
            winIconElement.src = 'InD/assets/blue-win.png';
        } else {
            winIconElement.src = 'InD/assets/green-win.png';
        }

        container.style.display = 'none';
        container.classList.remove('show-popup');
        overlay.style.display = 'none';
        overlay.classList.remove('show-overlay');

        // Show after a delay 
        setTimeout(() => {
            overlay.style.display = 'block';
            container.style.display = 'block';
            setTimeout(() => {
                overlay.classList.add('show-overlay');
                container.classList.add('show-popup');
            }, 100); 
        }, 800);  
    }

    static hideWinPopup() {
        const container = document.querySelector('div#win');
        const overlay = document.querySelector('.overlay');

        // Hide both popup and overlay
        container.classList.remove('show-popup');
        container.style.display = 'none';
        overlay.classList.remove('show-overlay');
        overlay.style.display = 'none';
    }

    static showWin(player) {
        UI.showWinPopup(player);  
        // initGame(type);  
    }

    static listenForWin(callback) {
        const playAgainBtn = document.querySelector('button#playAgain-btn');
        const backToMenuBtn = document.querySelector('button#backToMenu-btn');

        playAgainBtn.addEventListener('click', () => {
            callback(true);
            UI.hideWinPopup(); 
        });

        backToMenuBtn.addEventListener('click', () => {
            callback(false);  
            UI.hideWinPopup();  
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