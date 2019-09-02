

class LogAfterCompilePlugin {
    constructor(param = {}) {
        this.word = param.word
    }
    apply(compiler) {   
        let word = this.word || '勇敢的少年啊快去创造奇迹！'
        compiler.hooks.done.tapAsync('LogAfterCompilePlugin', (stat, callback) => {
            console.log('==============================');
            console.log(`    ${word}   `);
            console.log('==============================');
            console.log('耗时：', stat.endTime - stat.startTime);
            callback();
        });
    }
}

module.exports = LogAfterCompilePlugin;