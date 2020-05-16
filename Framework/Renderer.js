const postRenderJobs = []

export default {
    render(component, id, isProxy = true) {
        const t0 = performance.now()

        const componentObject = isProxy ? component.component : component
        const render = this.renderComponent(componentObject, id)
        const element = document.getElementById(id)
        element && element.parentNode.replaceChild(render, element)
        
        const renderTime = Math.round(performance.now() - t0)
        renderTime > 10 && console.log('Render took', renderTime, 'ms id:', id)
    },
    renderComponent(component, id) {
        // console.log('rendering component', component)
        if (component.tag === null) return this.renderTextComponent(component)

        component.attributes.id = id
        component.rerender = () => this.render(component, id, false)

        const element = document.createElement(component.tag)

        this.setAttributes(element, component)
        this.setChildren(element, component, id)
        this.setEventHandlers(element, component)
        this.runOnCreate(component)

        return element
    },
    renderTextComponent(component) {
        return document.createTextNode(component.text)
    },
    setAttributes(element, component) {
        Object.keys(component.attributes).forEach(attribute => {
            if (attribute === 'style') return
            const value = component.attributes[attribute]
            if (typeof(value) === 'function') {
                element.setAttribute(attribute, value.bind(component)())
            } else {
                element.setAttribute(attribute, value)
            }
        })

        if (component.oldStyle !== null) {
            element.setAttribute('style', component.oldStyle)
        }

        setTimeout(() => {
            if (component.attributes.style) {
                const style = component.attributes.style
                const styleObject = typeof(style) === 'function' ? style.bind(component)() : style
                element.setAttribute('style', styleObject)
                component.oldStyle = styleObject
            }
        }, 0);
    },
    setEventHandlers(element, component) {
        const handlers = component.events
        Object.keys(handlers).forEach(eventName => {
            const handler = component.events[eventName]
            element.addEventListener(eventName, e => {
                handler.bind(component)(e)
                e.stopPropagation()
            })
        })
    },
    setChildren(element, component, id) {
        const children = typeof(component.children) === 'function' ?
            component.children.bind(component)():
            component.children
        children.forEach((child, index) => {
            const childElement = this.renderComponent(child.component, id + '-' + index)
            element.appendChild(childElement)
        })
    },
    runOnCreate(component) {
        setTimeout(() => {
            if (component.isNew) {
                component.onCreate.bind(component)()
                component.rerender()
            }
            component.isNew = false
        }, 1);
    }
}