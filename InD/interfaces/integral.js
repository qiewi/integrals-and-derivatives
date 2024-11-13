// Get modal elements
const modal = document.getElementById("videoModal");
const closeBtn = document.querySelector(".close-btn");
const videoTitle = document.getElementById("videoTitle");
const videoList = document.getElementById("videoList");
const watchVideoButtons = document.querySelectorAll(".watch-video");

// Show modal with specific video content when "Watch Video" is clicked
watchVideoButtons.forEach(button => {
    button.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default link action

        // Get the title and video list from data attributes
        const title = button.getAttribute("data-title");
        const videos = JSON.parse(button.getAttribute("data-videos"));

        // Set the modal title
        videoTitle.textContent = title;

        // Clear any existing videos in the modal
        videoList.innerHTML = "";

        // Add each video to the modal
        videos.forEach(video => {
            // Create a container for each video
            const videoItem = document.createElement("div");
            videoItem.className = "video-item";
            
            // Create and set up the title
            const videoTitle = document.createElement("h3");
            videoTitle.textContent = video.title;
            videoItem.appendChild(videoTitle);
            
            // Create and set up the iframe
            const iframe = document.createElement("iframe");
            iframe.src = video.url;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            videoItem.appendChild(iframe);

            // Append this video item to the video list in the modal
            videoList.appendChild(videoItem);
        });

        // Show the modal
        modal.style.display = "block";
    });
});

// Close modal and clear videos
closeBtn.onclick = function() {
    modal.style.display = "none";
    videoList.innerHTML = ""; // Clear videos to stop playback
};

// Close modal when clicking outside the modal content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        videoList.innerHTML = ""; // Clear videos to stop playback
    }
};


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
        title: "Level 5 - Level Up",
        question: "Hitung usaha, W, dalam memindahkan objek di bawah gaya F(x) = 5x dari x = 0 hingga x = 3: W = ∫₀³ 5x dx.",
        options: [
            "15 J",
            "22.5 J",
            "30 J",
            "45 J"
        ],
        correct: 1
    },
    {
        title: "Level 1 - Level Up",
        question: "Konversikan jumlah berikut menjadi integral tentu saat n → ∞: ∑ᵢ₌₁ⁿ i / n²",
        options: [
            "∫₀¹ x dx",
            "∫₀¹ x² dx",
            "∫₀¹ x³ dx",
            "∫₀¹ √x dx"
        ],
        correct: 0
    },
    {
        title: "Level 2 - Level Up",
        question: "Gunakan Teorema Dasar Kalkulus untuk menemukan turunan dari fungsi F(x) = ∫₀ˣ sin(t²) dt.",
        options: [
            "sin(x²)",
            "cos(x²)",
            "2x sin(x²)",
            "-sin(x²)"
        ],
        correct: 0
    },
    {
        title: "Level 3 - Level Up",
        question: "Jika f(x) = x² pada interval [1, 3], hitung perkiraan luas di bawah kurva menggunakan metode titik tengah dengan 2 subinterval.",
        options: [
            "8",
            "8.5",
            "9",
            "9.5"
        ],
        correct: 1
    },
    {
        title: "Level 4 - Level Up",
        question: "Temukan volume yang dihasilkan dengan memutar area di bawah y = x² dari x = 0 hingga x = 2 di sekitar sumbu x.",
        options: [
            "8π/5",
            "8π/10",
            "16π/5",
            "32π/5",
        ],
        correct: 2
    },
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
            optionButton.addEventListener("click", () => checkAnswer(i, quiz.correct));
            quizOptions.appendChild(optionButton);
        });

        // Show the quiz modal
        quizModal.style.display = "block";
    });
});

// Function to check the answer
function checkAnswer(selected, correct) {
    if (selected === correct) {
        alert("Correct!");
    } else {
        alert("Incorrect. Try again!");
    }
    quizModal.style.display = "none";
}

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
