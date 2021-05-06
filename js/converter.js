// modules
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

// 'posts' directory.
const directoryPath = path.join(__dirname, "..", "posts");

// Reading files in a directory.
// ex) directoryFiles: [ 'test1.md', 'test2.md', 'test3.md' ]
const directoryFiles = fs.readdirSync(directoryPath);

// Reading the template file to apply the template engine.
const layoutHtmlFormat = fs.readFileSync(
  "../templates/layout-format.html",
  "utf8"
);

const articleHtmlFormat = fs.readFileSync(
  "../templates/article_format.html",
  "utf8"
);

const listHtmlFormat = fs.readFileSync("../templates/list-format.html", "utf8");

const extractBody = (text) => {
  return text.replace(/(\+{3})([\s\S]+?)(\1)/, "");
};

// Function to get file name excluding extension
getHtmlFileName = (file) => {
  return file.slice(0, file.indexOf("."));
};

// Function to extract article information
extractInfo = (text) => {
  const string = text.match(/(\+{3})([\s|\S]+?)\1/);


  if (!string) {
    return null;
  } else {
    const infoLines = string[2].match(/[^\r\n]+/g);
    const info = {};
    console.log('infoLines: ', infoLines);
    if (infoLines) {
      infoLines.map(infoLine => {
        console.log('infoLine: ', infoLine);
        const keyAndValue = infoLine.match(/(.+?):(.+)/);
        console.log('keyAndValue: ', keyAndValue);
        if (keyAndValue) {
          const key = keyAndValue[1].replace(/\s/g, "");
          const value = keyAndValue[2].replace(/['"]/g, "").trim();
          info[key] = value;
        }
      });
      return info;
    }
  }
};

// Create deploy directory.
const deployDir = path.join(__dirname, "..", "deploy");

if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir);
}

// List of files put in the deploy folder
const deployFiles = [];

// Create html file in deploy by looping through files in posts with map function.
directoryFiles.map((file) => {
  const fileContent = fs.readFileSync(`../posts/${file}`, "utf8");

  // Converting markdown file to HTML language.
  const convertedFileContent = md.render(extractBody(fileContent));

  // Extract article information
  const info = extractInfo(fileContent);
  console.log('info: ', info);

  // Render
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

    const articleHtml = ejs.render(layoutHtmlFormat, {
      content: articleContent,
    });

    const fileName = getHtmlFileName(file);
    fs.writeFileSync(`../deploy/${fileName}.html`, articleHtml);
    deployFiles.push({ path: `${fileName}.html`, title, date, desc });
    console.log('deployFiles: ', deployFiles);
  }
});

// File List Render
const listContent = ejs.render(listHtmlFormat, {
  lists: deployFiles,
});

const listHtml = ejs.render(layoutHtmlFormat, {
  content: listContent,
});

// Create "index.html"
fs.writeFileSync("../index.html", listHtml);
