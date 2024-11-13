var nextBtn = document.querySelector('.next'),
    prevBtn = document.querySelector('.prev'),
    carousel = document.querySelector('.carousel'),
    list = document.querySelector('.list'), 
    item = document.querySelectorAll('.item');

nextBtn.onclick = function(){
    showSlider('next')
}

prevBtn.onclick = function(){
    showSlider('prev')
}


function showSlider(type) {
    let sliderItemsDom = list.querySelectorAll('.carousel .list .item')
    if(type === 'next'){
        list.appendChild(sliderItemsDom[0])
        carousel.classList.add('next')
    } else{
        list.prepend(sliderItemsDom[sliderItemsDom.length - 1])
        carousel.classList.add('prev')
    }// Reset the running time animation
}

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