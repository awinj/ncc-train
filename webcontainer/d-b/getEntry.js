

const glob = require('glob');
const config = require('../new-config.json');

module.exports = (type = 'entry') => {
    let entry = {};
    let entryTemplateMap = {};

    let files = [];

    // 遍历用户配置的entry，讲最终的具体文件路径，放到files里
    config[type].map((item) => {
        if(typeof item === 'object') {
            glob.sync(item.entryPath).map((onePath) => {
                files.push({
                    entryPath: onePath,
                    template: item.template
                });
            });
        }
        else {
            files = files.concat(glob.sync(item));
        }
    }); 

    // 遍历files文件路径数组，处理数组生成最终符合webpack的entry
    files.map((item) => {
        let key = '';
        let entryPath = '';
        if(typeof item === 'object') {
            key = item.entryPath.replace('./src/', '').slice(0, -3);
            entryTemplateMap[key] = item.template;
            entryPath = item.entryPath;
        }
        else {
            key = item.replace('./src/', '').slice(0, -3);
            entryPath = item;
        }
        
        entry[key] = entryPath
    });

    return {
        entry,
        template: entryTemplateMap
    }
}