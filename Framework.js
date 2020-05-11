import State from './components/State'

export default class Framework {
    constructor(id, rootComponent) {
        this.id = id
        State.init(this)
        this.rootComponent = rootComponent
    }

    // renders nodes into this.id
    render() {
        const t0 = performance.now()

        // delete element content and add the new render
        const el = document.getElementById(this.id)
        el.textContent = ''
        el.appendChild(this.renderComponent(this.rootComponent()))

        // update the css variables
        const style = Object.keys(State.cssVars).map(name => {
            return `--${name}: ${State.cssVars[name]}`
        }).join('; ')
        el.setAttribute('style', style)

        console.log('Render took', Math.round(performance.now() - t0), 'ms')
    }

    /*
    Returns a node from a component.
    A component has the following structure:
    { text: string } OR
    {
        tag: string,
        attrs?: {
            attribute: value,
            ...
        },
        events?: {
            eventName: handler,
            ...
        },
        child?: Component,
        children?: [Component, ...]
    }
    */
    renderComponent(component) {
        if (component.text !== undefined) return document.createTextNode(component.text)

        if (component.tag === undefined) throw 'must specify a tag for non-text components'
    
        const el = document.createElement(component.tag)
    
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
        
        return el
    }
}
