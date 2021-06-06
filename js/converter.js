const path = require("path");
const fs = require("fs");
const ejs = require("ejs");

const hljs = require("highlight.js");
const md = require("markdown-it")({
    html: false, // Enable HTML tags in source.
    xhtmlOut: false, // Use '/' to close single tags (<br />). This is only for full CommonMark compatibility.
    breaks: false, // Convert '\n' in paragraphs into <br>.
    langPrefix: "language-", // CSS language prefix for fenced blocks. Can be useful for external highlighters.
    linkify: true, // Autoconvert URL-like text to links
    // Enable some language-neutral replacement + quotes beautification
    // For the full list of replacements
    // see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js
    typographer: true,
    // single, double quotes replacement pairs, when typographer enabled, and smartquotes on.
    // Could be either a String or an Array.
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    // Highlighter function. Should return escaped HTML, or ''.
    // if the source string is not changed and should be escaped externally.
    // If result starts with <pre... internal wrapper is skipped.
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return (
                    '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    "</code></pre>"
                );
            } catch (error) {
                console.log("md highlight error: ", error);
            }
        }

        return (
            '<pre class="hljs"><code>' +
            md.utils.escapeHtml(str) +
            "</code></pre>"
        );
    },
});

const {
    defaultTemplate,
    navTemplate,
    aboutTemplate,
    listTemplate,
    articleTemplate,
    sideBarTemplate,
    articleListTemplate,
} = require("./ReadHtmlFormat");
const {
    extractInfo,
    extractBody,
    extractHtmlFileName,
} = require("./ExtractFunction");

// 'posts' folder 읽기
const directoryPath = path.join(__dirname, "..", "posts");
const directories = fs.readdirSync(directoryPath);

// 'deploy' folder 생성
const deployDir = path.join(__dirname, "..", "deploy");
if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir);
}

// 전체 'category' folder 생성
const categoryDir = path.join(__dirname, "..", "deploy/category");
if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir);
}

// 'nav' folder 생성
const navDir = "../deploy/nav";
if (!fs.existsSync(navDir)) {
    fs.mkdirSync(navDir);
}

const articleList = [];
const articles = [];
const filesByCategory = [];

directories.map((directory, index) => {
    const fileList = fs.readdirSync(`../posts/${directory}`);

    let files = [];

    fileList.map((file) => {
        const mdFile = fs.readFileSync(
            `../posts/${directories[index]}/${file}`,
            "utf-8"
        );

        // 글 정보 추출
        const articleInfo = extractInfo(mdFile);

        // md File을 HTML로 변환
        const convertedBody = md.render(extractBody(mdFile));

        const categoryName =
            articleInfo.category &&
            articleInfo.category.replace(/(^\s*)|(\s*$)/gi, "");

        const folder =
            articleInfo.category &&
            articleInfo.category.toLocaleLowerCase().replace(/(\s*)/g, "");

        const fileName = (
            file.slice(0, file.indexOf(".")).toLocaleLowerCase() + `.html`
        ).replace(/(\s*)/g, "");

        let fileObj = {
            categoryName,
            fileName,
            articleInfo,
            convertedBody,
        };

        // Array.prototype.findIndex();
        // 주어진 판별 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스 반환
        // 만족하는 요소가 없으면 -1을 반환
        let findIndex = files.findIndex((i) => i.categoryName === categoryName);

        if (articleInfo.category) {
            articleList.push({
                title: articleInfo.title,
                date: articleInfo.date,
                path: `../deploy/${folder}/${fileName}`,
            });

            if (findIndex === -1) {
                files.push({
                    categoryName,
                    files: [fileObj],
                });
            } else {
                files[findIndex].files.push(fileObj);
            }
            articles.push(fileObj);
        }
    });

    filesByCategory.push(...files);
});

// Reading Introduction.md
const introductionFile = fs.readFileSync("../Introduction.md", "utf8");
const introductionInfo = extractInfo(introductionFile);

// articleList: [{title: 'test3', date: '2021-03-11', path: '../deploy/asd/test3.html'}, {...}]
// filesByCategory: [{categoryName: 'test1', files: [ [Object], [Object] ]}, {...}]
const nav = ejs.render(navTemplate, {
    introductionInfo: introductionInfo,
    categories: filesByCategory,
});

// const sideBar = ejs.render(sideBarTemplate, {
//     categories: filesByCategory,
// });

filesByCategory.map((category) => {
    // category 별 folder 생성
    if (category.categoryName !== undefined) {
        const categoryDir = `../deploy/${category.categoryName}`;
        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir);
        }
    }

    // category 별로 file의 list를 보여주는 category page 생성
    // files 최신순으로 정렬
    const orderdFiles = category.files.sort((a, b) => {
        return new Date(b.articleInfo.date) - new Date(a.articleInfo.date);
    });

    const categoryArticleList = ejs.render(listTemplate, {
        files: orderdFiles,
        category: category.categoryName,
    });

    const categoryArticleTemplate = ejs.render(defaultTemplate, {
        content: categoryArticleList,
        nav,
        // sideBar,
    });

    fs.writeFileSync(
        `../deploy/category/${category.categoryName}.html`,
        categoryArticleTemplate
    );

    // category 안의 file 별로 article page 생성
    category.files.map((file) => {
        const path = `../deploy/${category.categoryName}/${file.fileName}`;

        const article = ejs.render(articleTemplate, {
            body: file.convertedBody,
            articleInfo: file.articleInfo,
            path: path,
        });

        const articleHtml = ejs.render(defaultTemplate, {
            content: article,
            nav,
            // sideBar,
        });

        fs.writeFileSync(
            `../deploy/${category.categoryName}/${file.fileName}`,
            articleHtml
        );
    });
});

// About Me Menu
const about = ejs.render(defaultTemplate, {
    content: aboutTemplate,
    nav,
    // sideBar
});

fs.writeFileSync("../deploy/nav/about.html", about);

// Study Menu
const orderdArticles = articles.sort((a, b) => {
    return new Date(b.articleInfo.date) - new Date(a.articleInfo.date);
});

const articleContent = ejs.render(articleListTemplate, {
    articles: orderdArticles,
});

const study = ejs.render(defaultTemplate, {
    content: articleContent,
    nav,
    // sideBar
});

fs.writeFileSync("../deploy/nav/study.html", study);

const indexHtml = ejs.render(defaultTemplate, {
    content: aboutTemplate,
    nav,
    // sideBar,
});

fs.writeFileSync("../index.html", indexHtml);
