const fs = require("fs");

// template engine을 적용하기 위해 template file 읽기
const defaultTemplate = fs.readFileSync(
    "../templates/default.html",
    "utf8"
);

const headerHtmlFormat = fs.readFileSync("../templates/header_format.html",
    "utf8");

const listHtmlFormat = fs.readFileSync("../templates/list-format.html", "utf8");

const articleHtmlFormat = fs.readFileSync(
    "../templates/article_format.html",
    "utf8"
);

const aboutMeHtmlFormat = fs.readFileSync("../templates/about_me_format.html", "utf8");

module.exports = {
    defaultTemplate,
    headerHtmlFormat,
    listHtmlFormat,
    articleHtmlFormat,
    aboutMeHtmlFormat
};