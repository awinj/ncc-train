export default class ActionMain {
    constructor(comp) {
        this.comp = comp;
    }
    didMount = () => {
        this.pubSub.subscribe('updateState', (obj) => {
            this.comp.setState({
                ...obj
            });
        });
    }
    reverseName = () => {
        let comp = this.comp
        let originName = comp.state.name
        comp.setState({
            name: [...originName].reverse().join('')
        });
    }
}