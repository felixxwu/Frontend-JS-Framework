import State from './components/State'

export default class Framework {
    constructor(id, rootComponent) {
        this.id = id
        State.init(this)
        this.rootComponent = rootComponent
    }

    render() {
        const t0 = performance.now()

        const el = document.getElementById(this.id)
        el.textContent = ''
        el.appendChild(this.renderComponent(this.rootComponent()))

        const style = Object.keys(State.cssVars).map(name => {
            return `--${name}: ${State.cssVars[name]}`
        }).join('; ')
        el.setAttribute('style', style)

        console.log('Render took', Math.round(performance.now() - t0), 'ms')
    }

    renderComponent(component) {
        if (component.text !== undefined) return document.createTextNode(component.text)
    
        const el = document.createElement(component.tag)
    
        if (component.attrs !== undefined) {
            Object.keys(component.attrs).forEach(attrName => {
                const attrValue = component.attrs[attrName]
                el.setAttribute(attrName, attrValue)
            })
        }
    
        if (component.events !== undefined) {
            Object.keys(component.events).forEach(event => {
                const handler = component.events[event]
                el.addEventListener(event, handler)
            })
        }
    
        if (component.child !== undefined) {
            el.appendChild(this.renderComponent(component.child))
        }
    
        if (component.children !== undefined) {
            component.children.forEach(child => {
                el.appendChild(this.renderComponent(child))
            })
        }
        
        return el
    }
}
