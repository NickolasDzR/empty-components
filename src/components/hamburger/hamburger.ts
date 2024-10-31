const hamburger = document.querySelector(".hamburger") as HTMLDivElement;

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
})