const fs = require("fs");

// Reading the template file to apply the template engine.
const layoutHtmlFormat = fs.readFileSync(
    "../templates/layout-format.html",
    "utf8"
);

const headerHtmlFormat = fs.readFileSync("../templates/header_format.html",
    "utf8");

const articleHtmlFormat = fs.readFileSync(
    "../templates/article_format.html",
    "utf8"
);

const listHtmlFormat = fs.readFileSync("../templates/list-format.html", "utf8");

module.exports = {
    layoutHtmlFormat,
    headerHtmlFormat,
    articleHtmlFormat,
    listHtmlFormat,
};