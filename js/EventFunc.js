"use strict";

const navBar = document.querySelector(".nav");

if (window.scrollY > 200) {
  console.log("add 실행");
  navBar.classList.add("sticky");
} else {
  console.log("remove 실행");
  navBar.classList.remove("sticky");
}