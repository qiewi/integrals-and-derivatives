// sound.js
document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('sound-btn');
    const audio = document.getElementById('background-audio');
    let isMuted = false;

    // Play audio automatically when the game starts
    audio.play();

    soundBtn.addEventListener('click', () => {
        if (isMuted) {
            audio.play();
            soundBtn.textContent = '🔊';
        } else {
            audio.pause();
            soundBtn.textContent = '🔈';
        }
        isMuted = !isMuted;
    });
});