/**
 * 메뉴 visible 및 hide
 */
const navMenu = document.getElementById("nav_menu");
const navToggle = document.getElementById("nav_toggle");
const navClose = document.getElementById("nav_close");
const navLink = document.querySelectorAll(".nav_link");

if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.add("show_menu");
    });
}

if (navClose) {
    navClose.addEventListener("click", () => {
        navMenu.classList.remove("show_menu");
    });
}

function linkAction() {
    navMenu.classList.remove("show_menu");
}

navLink.forEach((item) => item.addEventListener("click", linkAction));

/**
 * Scroll Top
 */
function scrollUp() {
    const scrollUp = document.getElementById("scroll_up");

    if (this.scrollY >= 200) {
        scrollUp.classList.add("show_scroll");
    } else {
        scrollUp.classList.remove("show_scroll");
    }
}

window.addEventListener("scroll", scrollUp);

/**
 * Dark Theme
 */
const themeBtn = document.getElementById("theme_btn");
const darkTheme = "dark_theme";
const iconTheme = "bx_sun";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";

const getCurrentIcon = () =>
    themeBtn.classList.contains(iconTheme) ? "bx-moon" : "bx-sun";

if (selectedTheme) {
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        darkTheme
    );
    themeBtn.classList[selectedIcon === "bx-moon" ? "add" : "remove"](
        iconTheme
    );
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeBtn.classList.toggle("iconTheme");
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
});
