const Framework = {
    init(root, id, stateConfig) {
        this.root = root
        this.id = id
        this.postRenderJobs = []
        this.styleMemory = {}
        this.actions = stateConfig.actions
        Object.keys(stateConfig.state).forEach(variable => {
            this.state[variable] = stateConfig.state[variable]
        })
        this.render(this.root, this.id)
    },

    // STATE #######################################################################

    state: new Proxy({}, {
        set: (target, key, value) => {
            target[key] = value;
            console.log(key, '=', value)
            updateSubscribers(key)
            return true;
        }
    }),

    dispatch(action, arg) {
        this.actions(this.state)[action](arg)
    },

    subscribe(name, variable) {
        if (!this.subscriptions[variable]) this.subscriptions[variable] = []
        if (this.subscriptions[variable].includes(name)) return
        this.subscriptions[variable].push(name)
    },

    subscriptions: {},

    // RENDERING #####################################################################

    // renders html element nodes using "component" into the DOM at id="id"
    render(component, id) {
        const t0 = performance.now()
        
        if (!id) id = component.id
        this.validateComponent(component)

        const render = this.renderElement(component, id)
        const el = document.getElementById(id)
        el && el.parentNode.replaceChild(render, el)

        this.postRender()

        console.log('Render took', Math.round(performance.now() - t0), 'ms id:', id)
    },

    // execture post-render jobs
    postRender() {
        setTimeout(() => {
            while (this.postRenderJobs.length !== 0) this.postRenderJobs.pop()()
        }, 0);
    },

    // re-renders all components with that name
    renderByName(name) {
        this.renderComponentByName(this.root, name)
    },

    // re-renders all components with that name starting at this component
    renderComponentByName(component, name) {
        if (component.name === name) {
            this.render(component)
            return
        }
        if (component.child) {
            this.renderComponentByName(component.child.bind(component)(), name)
        }
        if (component.children) {
            component.children.bind(component)().forEach(child => {
                this.renderComponentByName(child, name)
            })
        }
    },

    // returns an element node from a json component
    renderElement(component, id) {
        if (id) {
            component.id = id
        }

        // simple text component
        if (component.text !== undefined) return document.createTextNode(component.text)

        // other types
        const el = document.createElement(component.tag)
        el.setAttribute('id', component.id)
        
        // add all the attrs using element.setAttribute()
        if (component.attrs !== undefined) {
            Object.keys(component.attrs).forEach(attrName => {
                const attrValue = component.attrs[attrName]
                el.setAttribute(attrName, attrValue)
            })
        }
        
        // add all the event listeners using element.addEventListener()
        if (component.events !== undefined) {
            Object.keys(component.events).forEach(event => {
                const handler = component.events[event]
                el.addEventListener(event, (e) => {
                    const flag = handler.bind(component)(e)
                    if (flag !== this.flags.NO_SELF_RENDER) {
                        this.render(component)
                    }
                    e.stopPropagation()
                })
            })
        }
        
        // add a single child component
        if (component.child !== undefined) {
            el.appendChild(this.renderElement(component.child.bind(component)(), `${id}-0`))
        }
        
        // add an array of children components
        if (component.children !== undefined) {
            component.children.bind(component)().forEach((child, index) => {
                el.appendChild(this.renderElement(child, `${id}-${index}`))
            })
        }

        // only set this.styles don't actually set the attribute, since it needs to be set after render for transitions to work
        if (component.style !== undefined) {
            el.setAttribute('style', this.styleMemory[component.id])
            this.postRenderJobs.push(() => {
                const newStyle = component.style.bind(component)()
                const el = document.getElementById(component.id)
                if (el) el.style = newStyle
                this.styleMemory[component.id] = newStyle
            })
        }

        if (component.subscribeTo !== undefined) {
            component.subscribeTo.forEach(variable => {
                this.subscribe(component.name, variable)
            })
        }
        
        return el
    },

    // VALIDATION ##############################################################

    validateComponent(component) {
        const acceptedFields = ['text', 'name', 'tag', 'data', 'attrs', 'events', 'child', 'children', 'style', 'id', 'subscribeTo']
        Object.keys(component).forEach(key => {
            if (!acceptedFields.includes(key)) {
                throw `Field "${key}" is not an accepted component field, use one of ${JSON.stringify(acceptedFields)}`
            }
        })

        if (component.text !== undefined && Object.keys(component).length !== 1) {
            throw 'Simple text components must only contain a "text" field ' + JSON.stringify(component) 
        }
        if (component.text === undefined) {
            if (!component.tag) throw 'Component must have a "tag" ' + JSON.stringify(component) 
            if (!component.name) throw 'Component must have a "name" ' + JSON.stringify(component)
        }

        // type checking
        if (component.text !== undefined && typeof(component.text) !== 'string') {
            throw 'Field "text" must be of type string ' + JSON.stringify(component)
        }
        if (component.name !== undefined && typeof(component.name) !== 'string') {
            throw 'Field "name" must be of type string ' + JSON.stringify(component)
        }
        if (component.tag !== undefined && typeof(component.tag) !== 'string') {
            throw 'Field "tag" must be of type string ' + JSON.stringify(component)
        }
        if (component.style !== undefined && typeof(component.style) !== 'function') {
            throw 'Field "style" must be of type function ' + JSON.stringify(component)
        }

        if (component.attrs !== undefined && typeof(component.attrs) !== 'object') {
            throw 'Field "attrs" must be of type object ' + JSON.stringify(component)
        }
        if (component.attrs !== undefined) {
            Object.keys(component.attrs).forEach(key => {
                if (typeof(component.attrs[key]) !== 'string') {
                    throw 'All "attrs" must be of type string ' + JSON.stringify(component)
                }
            })
        }

        if (component.events !== undefined && typeof(component.events) !== 'object') {
            throw 'Field "events" must be of type object ' + JSON.stringify(component)
        }
        if (component.events !== undefined) {
            Object.keys(component.events).forEach(key => {
                if (typeof(component.events[key]) !== 'function') {
                    throw 'All "events" must be of type function ' + JSON.stringify(component)
                }
            })
        }

        // if (component.child !== undefined && typeof(component.child) !== 'object') {
        //     throw 'Field "child" must be of type object ' + JSON.stringify(component)
        // }
        // if (component.children !== undefined && !Array.isArray(component.children)) {
        //     throw 'Field "children" must be an array ' + JSON.stringify(component)
        // }
    },

    flags: Object.freeze({
        NO_SELF_RENDER: 1
    }),
}

const updateSubscribers = (variable) => {
    const subscribed = Framework.subscriptions[variable]
    subscribed && subscribed.forEach(name => {
        Framework.renderByName(name)
    })
}

export default Framework
