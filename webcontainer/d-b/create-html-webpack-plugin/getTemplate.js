const fs = require('fs');

// 获取模板内容并且拼装模板
module.exports = function getTemplate(templateMap) {

    let templateContentMap = {};

    Object.keys(templateMap).map((item) => {
        let templatePath = templateMap[item];
        let content = fs.readFileSync(templatePath, {
            encoding: 'utf8'
        });

        templateContentMap[item] = {
            content: content,
            templatePath: templatePath
        }
    });

    return templateContentMap
}