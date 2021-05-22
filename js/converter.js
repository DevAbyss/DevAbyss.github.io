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

const { defaultTemplate, headerHtmlFormat, aboutMeHtmlFormat, listHtmlFormat, articleHtmlFormat } = require("./ReadHtmlFormat");
const { extractInfo, extractBody, extractHtmlFileName } = require("./ExtractFunction");

// 'posts' directory.
const directoryPath = path.join(__dirname, "..", "posts");

// Reading files in a directory.
// ex) directoryFiles: [ 'test1.md', 'test2.md', 'test3.md' ]
const directoryFiles = fs.readdirSync(directoryPath);

// Reading Introduction.md
const introductionFile = fs.readFileSync('../Introduction.md', 'utf8');
const introductionInfo = extractInfo(introductionFile);

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

// Render
const header = ejs.render(headerHtmlFormat, {
  title: introductionInfo.title,
  github: introductionInfo.github,
  logo: introductionInfo.logo,
  aboutMe: '../templates/about_me_format.html'
});

const aboutMe = ejs.render(defaultTemplate, {
  content: aboutMeHtmlFormat,
  header
});

// List of files put in the deploy folder
const deployFiles = [];
const filesByCategory = [];

// map function을 사용하여 deploy folder에 posts file의 html file을 반복하여 생성
directoryFiles.map((directory, index) => {
  const fileContent = fs.readdirSync(`../posts/${directory}`);
  // const fileContent = fs.readFileSync(`../posts/${file}`, "utf8");
  console.log('fileContent: ', fileContent);

  fileContent.map(file => {
    const mdFile = fs.readFileSync(`../post/${directoryFiles[index]}/${file}`, 'utf-8');
    console.log('mdFile: ', mdFile);
    // 글 정보 추출
    const info = extractInfo(mdFile);
    console.log('info: ', info);

    // md File을 HTML로 변환
    const convertedFileBody = md.render(extractBody(mdFile));

    const categoryName = info.category && info.category.replace(/(^\s*)|(\s*$)/gi, '');

    const folder =
      info.category && info.category.toLocaleLowerCase().replace(/(\s*)/g, '');

    const fileName = (
      file.slice(0, file.indexOf('.')).toLocaleLowerCase() + `.html`
    ).replace(/(\s*)/g, '');

  });

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
    deployFiles.push({ path: `${fileName}.html`, title, date, desc });
    console.log('deployFiles: ', deployFiles);
  }
});

const listContent = ejs.render(listHtmlFormat, {
  lists: deployFiles,
});

const listHtml = ejs.render(defaultTemplate, {
  content: listContent,
  header
});

// Create "index.html"
fs.writeFileSync("../index.html", listHtml);
