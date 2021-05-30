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

// Article Template
const articleListTemplate = fs.readFileSync('../templates/articleList.html', 'utf8');
const listTemplate = fs.readFileSync("../templates/list.html", "utf8");
const articleTemplate = fs.readFileSync(
    "../templates/article.html",
    "utf8"
);
const sideBarTemplate = fs.readFileSync('../templates/sideBar.html', 'utf8');

const aboutTemplate = fs.readFileSync("../templates/about.html", "utf8");


module.exports = {
    defaultTemplate,
    headerTemplate,
    articleListTemplate,
    listTemplate,
    articleTemplate,
    sideBarTemplate,
    aboutTemplate,
};