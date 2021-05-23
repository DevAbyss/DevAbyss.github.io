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
                    '<pre class="hljs"><code>'
                    + hljs.highlight(lang, str, true).value
                    + '</code></pre>'
                );
            } catch (error) {
                console.log("md highlight error: ", error);
            }
        }

        return (
            '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
        );
    },
});

const {
    defaultTemplate,
    headerTemplate,
    aboutMeTemplate,
    listTemplate,
    articleTemplate,
    sideBarTemplate,
    navTemplate
} = require("./ReadHtmlFormat");
const { extractInfo, extractBody, extractHtmlFileName } = require("./ExtractFunction");

// 'posts' directory.
const directoryPath = path.join(__dirname, "..", "posts");
console.log('directoryPath: ', directoryPath);

// Reading files in a directory.
// ex) directoryFiles: [ 'test1.md', 'test2.md', 'test3.md' ]
const directories = fs.readdirSync(directoryPath);
console.log('directories: ', directories);

// Create deploy directory.
// const deployDir = path.join(__dirname, "..", "deploy");
// if (!fs.existsSync(deployDir)) {
//   fs.mkdirSync(deployDir);
// }

// Create category directory
const categoryDir = path.join(__dirname, '..', 'deploy/category');
if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir);
}

// List of files put in the deploy folder
const allArticles = [];
const filesByCategory = [];

// map function을 사용하여 deploy folder에 posts file의 html file을 반복하여 생성
directories.map((directory, index) => {
    console.log('directories: ', directories);
    console.log('directory: ', directory);
    const fileContent = fs.readdirSync(`../posts/${directory}`);
    // const fileContent = fs.readFileSync(`../posts/${file}`, "utf8");
    console.log('fileContent: ', fileContent);

    let files = [];

    fileContent.map((file) => {
        const mdFile = fs.readFileSync(`../posts/${directories[index]}/${file}`, 'utf-8');

        // 글 정보 추출
        const articleInfo = extractInfo(mdFile);
        console.log('articleInfo: ', articleInfo);

        // md File을 HTML로 변환
        const convertedBody = md.render(extractBody(mdFile));

        const categoryName = articleInfo.category && articleInfo.category.replace(/(^\s*)|(\s*$)/gi, '');

        const folder =
            articleInfo.category && articleInfo.category.toLocaleLowerCase().replace(/(\s*)/g, '');

        const fileName = (
            file.slice(0, file.indexOf('.')).toLocaleLowerCase() + `.html`
        ).replace(/(\s*)/g, '');

        // Array.prototype.findIndex();
        // 주어진 판별 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스 반환
        // 만족하는 요소가 없으면 -1을 반환
        let findIndex = files.findIndex(i => i.categoryName === categoryName);
        console.log('findIndex: ', findIndex);
        let fileObj = {
            folder,
            fileName,
            articleInfo,
            convertedBody
        };

        if (articleInfo.category) {
            allArticles.push({
                title: articleInfo.title,
                date: articleInfo.date,
                path: `../deploy/${folder}/${fileName}`
            });
            console.log('allArticles: ', allArticles);

            if (findIndex === -1) {
                files.push({
                    folder,
                    categoryName,
                    files: [fileObj]
                });
            } else {
                files[findIndex].files.push(fileObj);
            }
        }
    });
    console.log('files: ', files);

    filesByCategory.push(...files);
    console.log('filesByCategory: ', filesByCategory);

    /**
    if (info) {
      const title = info.title || "";
      const date = info.date || "";
      const desc = info.desc || "";
  
      const articleContent = ejs.render(articleHtmlFormat, {
        body: convertedFileContent,
        title,
        date,
        desc
      });
  
      const articleHtml = ejs.render(defaultTemplate, {
        content: articleContent,
        header
      });
  
      const fileName = extractHtmlFileName(file);
      fs.writeFileSync(`../deploy/${fileName}.html`, articleHtml);
      allArticles.push({ path: `${fileName}.html`, title, date, desc });
      console.log('allArticles: ', allArticles);
    }
     */
});
console.log('allArticles: ', allArticles);

// Reading Introduction.md
const introductionFile = fs.readFileSync('../Introduction.md', 'utf8');
const introductionInfo = extractInfo(introductionFile);

// allArticles: [{title: 'test3', date: '2021-03-11', path: '../deploy/asd/test3.html'}, {...}]
// filesByCategory: [{folder: 'test1', categoryName: 'test1', files: [ [Object], [Object] ]}, {...}]
const header = ejs.render(headerTemplate, {
    introductionInfo: introductionInfo,
    allArticles: allArticles,
    categories: filesByCategory,
    aboutMe: '/deploy/aboutMe/aboutMe.html',
    nav: navTemplate
});

// About Me
const aboutMeDir = `../deploy/aboutMe`;
if (!fs.existsSync(aboutMeDir)) {
    fs.mkdirSync(aboutMeDir);
}

const aboutMe = ejs.render(defaultTemplate, {
    content: aboutMeTemplate,
    header
});

fs.writeFileSync('../deploy/aboutMe/aboutMe.html', aboutMe);

const sideBar = ejs.render(sideBarTemplate, {
    categories: filesByCategory,
});

filesByCategory.map((category) => {
    // category
});

const listContent = ejs.render(listTemplate, {
    lists: allArticles,
});

const listHtml = ejs.render(defaultTemplate, {
    content: listContent,
    header
});

// Create "index.html"
fs.writeFileSync("../index.html", listHtml);
