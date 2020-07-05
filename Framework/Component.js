const Component = class Component {
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
        this.isOld = false
        this.rerender = () => {}
    }

    // a proxy is used to override the behaviour of reading and writing attributes of an object
    // for example, with a proxy we can allow the attribute of a component to be set using:
    // <component>.<property>(<value>) [e.g. div().class('button')]
    // which has the equivalent behaviour of component.attributes[property] = value (see setAttribute)
    getProxy() {
        const component = this
        return new Proxy(component, {

            // get is called whenever the attribute of an object is read such as in div().class or div().children
            get(_, property) {

                // event, localState, listeners, children, onCreate, component are attributes reserved for special component behaviour
                // if the component attribute is not one of these, then you are setting a DOM attribute
                if (property === 'event') {
                    return this.getEventSetter()

                } else if (property === 'localState') {
                    return this.setLocalState
        
                } else if (property === 'listeners') {
                    return this.setListeners
        
                } else if (property === 'children') {
                    return this.setChildren
        
                } else if (property === 'onCreate') {
                    return this.setOnCreate
        
                } else if (property === 'component') {
                    return component
        
                } else {
                    return this.getAttributeSetter(property)
                }
            },
            getEventSetter() {
                const proxy = this
                return new Proxy({}, {
                    get(_, eventName) {
                        return handler => proxy.setEventHandler(eventName, handler)
                    }
                })
            },
            setEventHandler(eventName, handler) {
                component.events[eventName] = handler
                return component.getProxy()
            },
            getAttributeSetter(property) {
                return value => {
                    this.setAttribute(property, value)
                    return component.getProxy()
                }
            },
            setAttribute(property, value) {
                component.attributes[property] = value
                return component.getProxy()
            },
            setLocalState(localState) {
                component.localState = new Proxy(localState, {
                    set: (target, key, value) => {
                        target[key] = value;
                        console.log('Local State', key, '=', value)
                        component.rerender()
                        return true;
                    }
                })
                return component.getProxy()
            },
            setListeners(names) {
                component.listeners = names
                return component.getProxy()
            },
            setChildren(children) {
                component.children = children
                return component.getProxy()
            },
            setOnCreate(func) {
                component.onCreate = func
                return component.getProxy()
            }
        })
    }
}

export default Component
