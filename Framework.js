export default class Framework {
    constructor(id, state, rootComponent) {
        state.init(this)
        this.id = id
        this.rootComponent = rootComponent
        this.componentId = 0;
        this.oldStyles = {}
        this.styles = {}
    }

    // renders nodes into this.id
    render() {
        const t0 = performance.now()

        // delete element content and add the new render
        this.componentId = 0;
        const el = document.getElementById(this.id)
        el.textContent = ''
        el.appendChild(this.renderComponent(this.rootComponent()))

        setTimeout(() => {
            Object.keys(this.styles).forEach(id => {
                document.getElementById(id).style = this.styles[id]
            })
        }, 0);

        this.oldStyles = this.styles

        console.log('Render took', Math.round(performance.now() - t0), 'ms')
    }

    /***************************************************************************************
     * Returns a node from a component.
     * 
     * A component has the following structure:
     * { text: string } OR
     * {
     *  tag: string,
     *  name: string,
     *  attrs?: {
     *      attribute: value,
     *      ...
     *  },
     *  events?: {
     *      eventName: handler,
     *      ...
     *  },
     *  child?: Component,
     *  children?: [Component, ...],
     *  style: `string`
     * }
     **************************************************************************************/
    renderComponent(component) {
        this.validateComponent(component)

        if (component.text !== undefined) return document.createTextNode(component.text)

        const el = document.createElement(component.tag)

        const id = `${component.name}-${this.componentId}`
        el.setAttribute('id', id)
        this.componentId++
        
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
                el.addEventListener(event, handler)
            })
        }
        
        // add a single child component
        if (component.child !== undefined) {
            el.appendChild(this.renderComponent(component.child))
        }
        
        // add an array of children components
        if (component.children !== undefined) {
            component.children.forEach(child => {
                el.appendChild(this.renderComponent(child))
            })
        }

        // only set this.styles don't actually set the attribute, since it needs to be set after render for transitions to work
        if (component.style !== undefined) {
            el.setAttribute('style', this.oldStyles[id])
            this.styles[id] = component.style
        }
        
        return el
    }

    validateComponent(component) {
        const acceptedFields = ['text', 'name', 'tag', 'attrs', 'events', 'child', 'children', 'style']
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
        if (component.text !== undefined && typeof(component.text) !== 'string') {
            throw 'Field "text" must be of type string ' + JSON.stringify(component)
        }

        if (component.name !== undefined && typeof(component.name) !== 'string') {
            throw 'Field "name" must be of type string ' + JSON.stringify(component)
        }
        if (component.tag !== undefined && typeof(component.tag) !== 'string') {
            throw 'Field "tag" must be of type string ' + JSON.stringify(component)
        }
        if (component.style !== undefined && typeof(component.style) !== 'string') {
            throw 'Field "style" must be of type string ' + JSON.stringify(component)
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

        if (component.child !== undefined && typeof(component.child) !== 'object') {
            throw 'Field "child" must be of type object ' + JSON.stringify(component)
        }
        if (component.children !== undefined && !Array.isArray(component.children)) {
            throw 'Field "children" must be an array ' + JSON.stringify(component)
        }
    }
}
