// Function to extract article information
const extractInfo = (md) => {
    const string = md.match(/(\+{3})([\s|\S]+?)\1/);
    const info = {};

    if (string === null) {
        info = { title: '', date: '', category: '', desc: '' };
        return info;
    } else {
        const infoLines = string[2].match(/[^\r\n]+/g);

        if (infoLines) {
            infoLines.map(infoLine => {
                const keyAndValue = infoLine.match(/(.+?):(.+)/);

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
const extractBody = (md) => {
    return md.replace(/(\+{3})([\s\S]+?)(\1)/, "");
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