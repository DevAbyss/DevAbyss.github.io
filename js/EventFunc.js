"use strict";

const navBar = document.querySelector(".nav");

document.addEventListener("scroll", () => {
  if (window.pageYOffset > 80) {
    console.log("add 실행");
    navBar.classList.add("sticky");
  } else {
    console.log("remove 실행");
    navBar.classList.remove("sticky");
  }
});
