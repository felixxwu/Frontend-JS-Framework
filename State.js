// state.js is a singleton object, so it can be imported everywhere and share the same state
export default {
    init(framework) {
        this.framework = framework
        this.boxDim = [100, 40]
        this.page = 'start'
    },

    // methods for modifying the state
    get actions() {
        return {
            setBoxDim: dim => this.boxDim = dim,
            setPage: page => this.page = page
        }
    },

    dispatch(action, arg) {
        console.log('dipatched', action, arg)
        this.actions[action](arg)
        this.framework.render()
    }
}