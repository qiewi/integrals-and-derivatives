const nav = document.querySelector("nav"),
    toggleBtn = nav.querySelector(".toggle-btn");

toggleBtn.addEventListener("click" , () =>{
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
}

nav.addEventListener("mousedown", () =>{
    nav.addEventListener("mousemove", onDrag);
});

nav.addEventListener("mouseup", () =>{
    nav.removeEventListener("mousemove", onDrag);
});
nav.addEventListener("mouseleave", () =>{
    nav.removeEventListener("mousemove", onDrag);
});

