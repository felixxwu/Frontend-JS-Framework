export default class Component {
    constructor(tag) {
        this.tag = tag
        this.id = null
        this.attributes = {}
        this.localState = {}
        this.events = {}
        this.listeners = []
        this.children = () => []
        this.oldStyle = null
        this.onCreate = () => {}
        this.isNew = true
        this.rerender = () => {}
    }
}