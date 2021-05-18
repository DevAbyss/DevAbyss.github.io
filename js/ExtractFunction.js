// Function to extract article information
const extractInfo = (text) => {
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

// Function to extract body
const extractBody = (text) => {
    return text.replace(/(\+{3})([\s\S]+?)(\1)/, "");
};

// Function to get file name excluding extension
const extractHtmlFileName = (file) => {
    return file.slice(0, file.indexOf("."));
};

module.exports = {
    extractInfo,
    extractBody,
    extractHtmlFileName
};