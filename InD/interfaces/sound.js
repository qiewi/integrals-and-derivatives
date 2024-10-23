document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('sound-btn');
    const audio = document.getElementById('background-audio');
    let isMuted = false;

    // Function to start the audio after the first user interaction
    function playAudioOnInteraction() {
        audio.play().catch(error => {
            console.log('Autoplay prevented: ', error);
        });
        // Remove the event listener after the first interaction
        document.removeEventListener('click', playAudioOnInteraction);
        document.removeEventListener('keydown', playAudioOnInteraction);
    }

    // Listen for the user's first interaction (click or keydown)
    document.addEventListener('click', playAudioOnInteraction);
    document.addEventListener('keydown', playAudioOnInteraction);

    // Control sound button to mute/unmute
    soundBtn.addEventListener('click', () => {
        if (isMuted) {
            audio.play().catch(error => {
                console.log('Audio play failed: ', error);
            });
            soundBtn.textContent = '🔊';
        } else {
            audio.pause();
            soundBtn.textContent = '🔈';
        }
        isMuted = !isMuted;
    });
});
