const nav = document.querySelector("nav"),
      toggleBtn = nav.querySelector(".toggle-btn"),
      spans = nav.querySelectorAll("span");

toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
});

function onDrag({movementY}) { 
    const navStyle = window.getComputedStyle(nav),
          navTop = parseInt(navStyle.top),
          navHeight = parseInt(navStyle.height),
          windHeight = window.innerHeight;

    nav.style.top = navTop > 0 ? `${navTop + movementY}px` : "1px";
    if(navTop > windHeight - navHeight){
        nav.style.top = `${windHeight - navHeight}px`;
    }

    // Change --i values when at the top
    if (navTop <= 70) { // Adjust 10px as the threshold for "at the top"
        spans[0].style.setProperty("--i", "3");
        spans[1].style.setProperty("--i", "2");
    } else {
        spans[0].style.setProperty("--i", "4"); // Reverting back to default
        spans[1].style.setProperty("--i", "3");
    }
}

nav.addEventListener("mousedown", () => {
    nav.addEventListener("mousemove", onDrag);
});

nav.addEventListener("mouseup", () => {
    nav.removeEventListener("mousemove", onDrag);
});

nav.addEventListener("mouseleave", () => {
    nav.removeEventListener("mousemove", onDrag);
});
