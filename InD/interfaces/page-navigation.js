function navigateWithFade(url) {
    document.body.classList.add('fade-out');  // Add the fade-out class
    setTimeout(function() {
        window.location.href = url;  // Navigate after the fade-out
    }, 500);  // Delay for the duration of the fade-out (500ms)
}