export default class Action1 {
    constructor(comp) {
        this.comp = comp;
    }
    reverseName = () => {
        let comp = this.comp
        let originName = comp.context.scope.name
        this.pubSub.publish('updateState', {
            name: [...originName].reverse().join('')
        })
    }
}