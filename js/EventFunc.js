"use strict";

const navBar = document.querySelector(".nav");
const menu = document.querySelector("nav .menu");
const menuBtn = document.querySelector(".menu-btn");

// ScrollY Event
document.addEventListener("scroll", () => {
  if (window.pageYOffset > 80) {
    console.log("add 실행");
    navBar.classList.add("sticky");
  } else {
    console.log("remove 실행");
    navBar.classList.remove("sticky");
  }
});

document.addEventListener("click", () => {
  menu.classList.toggle("active");
});
