import { auth, db } from "../api/config/firebaseConfig.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { unlockCard } from "../api/card.js";

const levelCardsOrder = [5, 1, 2, 3, 4]; // Order of levels based on the array

// Function to display levels with lock overlays if not unlocked
async function displayLevels() {
    const user = auth.currentUser;
    if (user) {
        // Fetch user progress
        const userRef = doc(db, "Derivative", user.uid);
        const docSnap = await getDoc(userRef);
        const completedLevels = docSnap.exists() ? docSnap.data().completedLevels : 0;

        // Display levels with lock overlay if not unlocked
        levelCardsOrder.forEach((level, index) => {
            const cardElement = document.getElementById(`level-card-${level}`);
            if (!cardElement) {
                console.warn(`Element with ID level-card-${level} not found.`);
                return; // Skip to the next iteration if element is missing
            }

            const watchVideoButton = cardElement.querySelector(".watch-video");
            const levelUpButton = cardElement.querySelector(".level-up");

            if ((index - 1 > completedLevels) || (index === 0 && completedLevels < 4)) {
                // Apply locked overlay for levels beyond the user's completed level count
                const overlay = document.createElement("div");
                overlay.classList.add("lock-overlay");
                overlay.innerHTML = '<span>🔒</span>Locked'; // Lock icon and text
                cardElement.appendChild(overlay);

                // Disable buttons
                if (watchVideoButton) {
                    watchVideoButton.classList.add("disabled");
                    watchVideoButton.setAttribute("aria-disabled", "true");
                }
                if (levelUpButton) {
                    levelUpButton.classList.add("disabled");
                    levelUpButton.setAttribute("aria-disabled", "true");
                }
            } else {
                // Apply unlocked style to levels that are completed
                cardElement.classList.add("unlocked");
            }
        });
    }
}

// Call the displayLevels function when the page loads or user signs in
auth.onAuthStateChanged((user) => {
    if (user) {
        displayLevels();
    }
});

// Get quiz modal elements
const quizModal = document.getElementById("quizModal");
const closeQuizBtn = document.querySelector(".close-quiz-btn");
const quizTitle = document.getElementById("quizTitle");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const levelUpButtons = document.querySelectorAll(".buttons .btn:nth-child(2)");

// Sample quiz data
const quizData = [
    {
        title: "Level 5 - Anti Turunan",
        question: "Hitung ∫ 3x² dx.",
        options: [
            "x³ + C",
            "3x³ + C",
            "x² + C",
            "3x + C"
        ],
        correct: 0
    },
    {
        title: "Level 1 - Turunan",
        question: "Jika f(x) = x², berapakah f'(x)?",
        options: [
            "x²",
            "2x",
            "x",
            "2"
        ],
        correct: 1
    },
    {
        title: "Level 2 - Turunan Implisit",
        question: "Jika y² + x² = 25, berapakah dy/dx?",
        options: [
            "-x/y",
            "y/x",
            "-y/x",
            "x/y"
        ],
        correct: 2
    },
    {
        title: "Level 3 - Titik Maksimum dan Minimum",
        question: "Jika f(x) = -x² + 4x pada interval [0, 4], berapakah nilai maksimum f(x)?",
        options: [
            "4",
            "5",
            "6",
            "8"
        ],
        correct: 3
    },
    {
        title: "Level 4 - Sketsa Grafik dengan Kalkulus",
        question: "Jika f(x) = x³ - 3x, berapakah interval dimana f(x) meningkat?",
        options: [
            "x < -1",
            "-1 < x < 1",
            "x > 1",
            "Semua x"
        ],
        correct: 1
    }
];


// Show quiz modal when "Level Up" is clicked
levelUpButtons.forEach((button, index) => {
    button.addEventListener("click", function(event) {
        event.preventDefault();

        // Load the quiz data for the level
        const quiz = quizData[index];
        quizTitle.textContent = quiz.title;
        quizQuestion.textContent = quiz.question;
        
        // Clear existing options
        quizOptions.innerHTML = "";

        // Add new options
        quiz.options.forEach((option, i) => {
            const optionButton = document.createElement("button");
            optionButton.textContent = option;
            optionButton.addEventListener("click", () => checkAnswer(i, quiz.correct, index));
            quizOptions.appendChild(optionButton);
        });

        // Show the quiz modal
        quizModal.style.display = "block";
    });
});

// Get feedback modal elements
const feedbackModal = document.getElementById("feedbackModal");
const closeFeedbackBtn = document.querySelector(".close-feedback-btn");
const feedbackImage = document.getElementById("feedbackImage");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackMessage = document.getElementById("feedbackMessage");
let correctAnswer = false;

// Function to check the answer and show feedback
async function checkAnswer(selected, correct, quizIndex) {
    // Close the quiz modal
    quizModal.style.display = "none";
    quizOptions.innerHTML = ""; // Clear options

    // Show feedback based on answer correctness
    if (selected === correct) {
        feedbackImage.src = "../assets/green-player.png";
        feedbackTitle.textContent = "Correct Answer!";
        
        // Check if it's the last quiz (Level 5)
        if (quizIndex === 0) {
            feedbackMessage.textContent = "CONGRATULATIONS! YOU HAVE COMPLETED THE DERIVATIVE MODULE";
            unlockCard(4);
            correctAnswer = true;
        } else {
            feedbackMessage.textContent = `CONGRATS, YOU HAVE LEVELED UP TO LEVEL ${quizIndex + 1}!`;
            correctAnswer = true;
        }
        
        feedbackTitle.style.backgroundColor = "#4CAF50"; // Green for correct answer

        // Update user's progress in Firestore if this level is higher than completedLevels
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "Derivative", user.uid);
            
            try {
                // Fetch the current completed levels
                const docSnap = await getDoc(userRef);
                const currentCompletedLevels = docSnap.exists() ? docSnap.data().completedLevels : 0;
                
                // Update only if this level is higher than the current completed level
                if (quizIndex + 1 > currentCompletedLevels) {
                    await updateDoc(userRef, {
                        completedLevels: quizIndex // Update to the highest level completed
                    });
                    console.log("User progress updated in Firestore to level:", quizIndex);
                }
                if (quizIndex === 0) {
                    await updateDoc(userRef, {
                        completedLevels: 5 // Update to the highest level completed
                    });
                    console.log("User progress updated in Firestore to level:", 5);
                }
            } catch (error) {
                console.error("Error updating progress:", error);
            }
        }
    } else {
        feedbackImage.src = "../assets/red-player.png";
        feedbackTitle.textContent = "Wrong Answer!";
        feedbackMessage.textContent = "OOPS! REVIEW YOUR ANSWER AND TRY AGAIN!";
        feedbackTitle.style.backgroundColor = "#f44336"; // Red for incorrect answer
    }

    // Show the feedback modal
    feedbackModal.style.display = "block";
}

// Close feedback modal and return to default view
closeFeedbackBtn.onclick = function() {
    feedbackModal.style.display = "none";
    if (correctAnswer) {
        window.location.reload();
        correctAnswer = false;
    }
};

// Close feedback modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target == feedbackModal) {
        feedbackModal.style.display = "none";
    }
};

// Close quiz modal and clear options
closeQuizBtn.onclick = function() {
    quizModal.style.display = "none";
    quizOptions.innerHTML = ""; // Clear options
};

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target == quizModal) {
        quizModal.style.display = "none";
        quizOptions.innerHTML = ""; // Clear options
    }
};





