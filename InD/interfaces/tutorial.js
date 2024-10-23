let currentStep = 0;

const tutorialSteps = [
    'Welcome to the game! Let’s start with the basics.',
    'This is your dice, press it to roll a number.',
    'These are your player pieces, click on them to move based on the dice roll.',
    'If you land on a snake, you will slide down! If you land on a ladder, you will climb up.',
    'You win by reaching the 100th tile!'
];

const overlay = document.getElementById('tutorial-specific-overlay');
const tutorialBox = document.getElementById('tutorial-popup');
const tutorialText = document.getElementById('tutorial-step');
const nextBtn = document.getElementById('next-tutorial-btn');

// Function to show the current step of the tutorial
function showStep(step) {
    if (step >= tutorialSteps.length) {
        // Hide tutorial
        tutorialBox.classList.remove('show-popup');
        overlay.classList.remove('show');
        return;
    }
    // Update tutorial text
    tutorialText.innerText = tutorialSteps[step];
}

// Function to start the tutorial
function startTutorial() {
    currentStep = 0;
    showStep(currentStep);

    // Show the overlay and the tutorial popup
    tutorialBox.classList.add('show-popup');
    overlay.classList.add('show');
}

// Event listener for the "Next" button in the tutorial
nextBtn.addEventListener('click', () => {
    currentStep++;
    showStep(currentStep);
});

// Event listener for the "Start Game" button
document.querySelector('#start-btn').addEventListener('click', () => {
    // Hide the menu screen
    document.querySelector('.menu-screen').classList.add('hide');

    // Show the game container
    document.querySelector('.game-container').classList.remove('hide');

    // Start the tutorial
    startTutorial();
});
