/**
 * MENU SHOW Y HIDDEN
 */
const navMenu = document.getElementById("nav_menu");
const navToggle = document.getElementById("nav_toggle");
const navClose = document.getElementById("nav_close");

// 메뉴 보이기
if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show_menu");
    });
}

// 메뉴 감추기
if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show_menu");
    });
}

// Remove Menu Mobile
const navLink = document.querySelectorAll(".nav_link");

function linkAction() {
    // When we click on each nav_link, we remove the show-menu class
    navMenu.classList.remove("show_menu");
}

navLink.forEach((item) => item.addEventListener("click", linkAction));

// ! IIFE(Immediately-invoked function expression: 즉시 호출되는 함수 표현식
// Pure Javascript에서 사용
// # 사용하는 이유
// # 1. 코드 사이의 충돌 예방: 다른 코드, 변수, 함수명 등이 충돌하지 않도록 예방
// # 2. 전역 변수, 전역 함수가 되지 않도록 방지
// # 3. 변수의 값을 즉시 할당
// (function (window, document) {
//     "use strict";

//     const toggles = document.querySelectorAll(".toggle"); // NodeList (유사배열)
//     const toggleBtn = document.getElementById("toggle-btn");

//     toggleBtn.addEventListener("click", () => {
//         toggleElements();
//     });

//     function toggleElements() {
//         // .toggle의 개수가 바뀔 수 있기 때문에 forEach 사용
//         [].forEach.call(toggles, (toggle) => {
//             toggle.classList.toggle("on");
//         });
//     }

//     window.addEventListener("resize", () => {
//         if (window.innerWidth > 1024) {
//             // off toggle element
//             offElements();
//         }
//     });

//     function offElements() {
//         // .toggle의 개수가 바뀔 수 있기 때문에 forEach 사용
//         [].forEach.call(toggles, (toggle) => {
//             toggle.classList.remove("on");
//         });
//     }
// })(window, document);

// "use strict";

// const navBar = document.querySelector(".nav");
// const menu = document.querySelector("nav .menu");
// const menuBtn = document.querySelector(".menu-btn");

// // ScrollY Event
// document.addEventListener("scroll", () => {
//   if (window.pageYOffset > 80) {
//     console.log("add 실행");
//     navBar.classList.add("sticky");
//   } else {
//     console.log("remove 실행");
//     navBar.classList.remove("sticky");
//   }
// });

// document.addEventListener("click", () => {
//   menu.classList.toggle("active");
//   menuBtn.classList.toggle("active");
// });
