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

        this.runPostRenderJobs()
    },
    renderComponent(component, id) {
        if (component.tag === null) return this.renderTextComponent(component)

        // set the attribute id, create new if doesnt exist
        if (!component.attributes) component.attributes = {}
        component.attributes.id = id
        
        component.rerender = () => this.render(component, id, false)

        const element = document.createElement(component.tag)

        if (component.attributes) this.setAttributes(element, component)
        if (component.children) this.setChildren(element, component, id)
        if (component.events) this.setEventHandlers(element, component)
        if (component.onCreate) this.runOnCreate(component)

        return element
    },
    runPostRenderJobs() {
        setTimeout(() => {
            while(postRenderJobs.length !== 0) postRenderJobs.pop()()
        }, 0)
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

        postRenderJobs.push(() => {
            if (component.attributes.style) {
                const style = component.attributes.style
                const styleObject = typeof(style) === 'function' ? style.bind(component)() : style
                element.setAttribute('style', styleObject)
                component.oldStyle = styleObject
            }
        });
    },
    setEventHandlers(element, component) {
        const handlers = component.events
        Object.keys(handlers).forEach(eventName => {
            const handler = component.events[eventName]
            element.addEventListener(eventName, e => {
                handler.bind(component)(e)
                e.stopPropagation()
                component.rerender()
            })
        })
    },
    setChildren(element, component, id) {
        const children = typeof(component.children) === 'function' ?
            component.children.bind(component)() :
            component.children
        children.forEach((child, index) => {
            const childComponent = child.component ? child.component : child
            const childElement = this.renderComponent(childComponent, id + '-' + index)
            element.appendChild(childElement)
        })
    },
    runOnCreate(component) {
        postRenderJobs.push(() => {
            if (!component.isOld) {
                component.onCreate.bind(component)()
                component.rerender()
            }
            component.isOld = true
        })
    }
}