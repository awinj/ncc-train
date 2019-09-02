const path = require('path');
const cheerio = require('cheerio');
const h = require('./hammer');

module.exports = function createHtml(fileInfo, templateContent, templateName, publicPath, targetPath, beforeAppendCss, beforeAppendJs) {

    try {
        let filePath = fileInfo['.css'].dir;
        let htmlPath = filePath + '/' + templateName;
        let cssPath = path.join(publicPath, filePath, fileInfo['.css'].base);
        let jsPath = path.join(publicPath, filePath, fileInfo['.js'].base);
        let content = templateContent;

        let $ = cheerio.load(content);
        beforeAppendCss && beforeAppendCss($);
        $('head').append(`<link rel="stylesheet" href="${cssPath}" />`);
        
        beforeAppendJs && beforeAppendJs($);
        $('body').append(`<script src="${jsPath}"></script>`);

        h.writeFile(targetPath, htmlPath, $.html());
    }
    catch(e) {
        console.log('createHtml', e);
    }
}