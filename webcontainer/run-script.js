


const modelReg = /(hrwa)|(hrhi)|(hrjf)|(hrpub)|(hrcm)|(hryf)|(hrp)|(hrzz)|(hrjq)|(hrkq)|(dev\-component)|(hrtrn)|(hrys)|(hrbm)/

const build = require('./d-b/nrb');
let args = [...process.argv];

args.splice(0, 2);

let compileModule = [];

args.map((item) => {
    if(modelReg.test(item)) {
        compileModule.push(item);
    }
});

if(compileModule.length > 0) {
    build(compileModule);
}
else {
    build();
}
