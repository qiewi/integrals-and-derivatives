const wordText = document.querySelector(".word"),
titleText = document.querySelector(".container h2"),
hintText = document.querySelector(".hint span"),
timeText = document.querySelector(".time b"),
inputField = document.querySelector("input"),
refreshBtn = document.querySelector(".refresh-word"),
checkBtn = document.querySelector(".check-word");

let correctWord;

const initGame = (type) => {
    if (type === 'LADDERS') {
        let randomObj = integrals[Math.floor(Math.random() * integrals.length)];
        let wordArray = randomObj.question;
        wordText.innerText = wordArray;
        titleText.innerText = "A Ladder Fell from the Sky!"
        correctWord = randomObj.answer.toLowerCase();
    } else {
        let randomObj = derivatives[Math.floor(Math.random() * derivatives.length)];
        let wordArray = randomObj.question;
        wordText.innerText = wordArray;
        titleText.innerText = "A Wild Snake Appeared!"
        correctWord = randomObj.answer.toLowerCase();
    }
    
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
}