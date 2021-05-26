const fs = require("fs");

// template engine을 적용하기 위해 template file 읽기

// 기본 Template
const defaultTemplate = fs.readFileSync(
    "../templates/default.html",
    "utf8"
);

// Header&Navigation Template
const headerTemplate = fs.readFileSync("../templates/header.html",
    "utf8");
const navTemplate = fs.readFileSync('../templates/nav.html');

// Article Template
const articleListTemplate = fs.readFileSync('../templates/articleList.html', 'utf8');
const listTemplate = fs.readFileSync("../templates/list.html", "utf8");
const articleTemplate = fs.readFileSync(
    "../templates/article.html",
    "utf8"
);
const sideBarTemplate = fs.readFileSync('../templates/sideBar.html', 'utf8');

const aboutMeTemplate = fs.readFileSync("../templates/aboutMe.html", "utf8");

// Study Menu
const studyTemplate = fs.readFileSync("../templates/study.html", "utf8");

module.exports = {
    defaultTemplate,
    headerTemplate,
    navTemplate,
    articleListTemplate,
    listTemplate,
    articleTemplate,
    sideBarTemplate,
    aboutMeTemplate,
    studyTemplate
};