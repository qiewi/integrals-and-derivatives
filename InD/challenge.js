const wordText = document.querySelector(".word"),
titleText = document.querySelector(".challenge-container h2"),
timeText = document.querySelector(".time b"),
inputField = document.querySelector("input");

let correctAnswer;

const initGame = (type) => {
    if (type === 'LADDERS') {
        let randomObj = integrals[Math.floor(Math.random() * integrals.length)];
        let wordArray = randomObj.question;
        wordText.innerText = wordArray;
        titleText.innerText = "A Ladder Fell from the Sky!"
        correctAnswer = randomObj.answer.toLowerCase();
    } else {
        let randomObj = derivatives[Math.floor(Math.random() * derivatives.length)];
        let wordArray = randomObj.question;
        wordText.innerText = wordArray;
        titleText.innerText = "A Wild Snake Appeared!"
        correctAnswer = randomObj.answer.toLowerCase();
    }
    
    inputField.value = "";
    inputField.setAttribute("maxlength", correctAnswer.length);
}