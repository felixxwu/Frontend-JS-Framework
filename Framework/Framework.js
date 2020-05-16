import Component from './Component'
import TextComponent from './TextComponent'
import Renderer from './Renderer'
import State from './State'

const componentProxy = (component) => new Proxy(component, {
    get(_, property) {
        if (property === '$event') {
            return this.getEventSetter()

        } else if (property === '$data') {
            return this.setData

        } else if (property === '$listeners') {
            return this.setListeners

        } else if (property === '$children') {
            return this.setChildren

        } else if (property === '$onCreate') {
            return this.setOnCreate

        } else if (property === '$component') {
            return component

        } else {
            return this.getAttributeSetter(property)
        }
    },
    getEventSetter() {
        const self = this
        return new Proxy({}, {
            get(_, eventName) {
                return handler => self.setEventHandler(eventName, handler)
            }
        })
    },
    setEventHandler(eventName, handler) {
        component.events[eventName] = handler
        return componentProxy(component)
    },
    getAttributeSetter(property) {
        return value => {
            this.setAttribute(property, value)
            return componentProxy(component)
        }
    },
    setAttribute(property, value) {
        component.attributes[property] = value
        return componentProxy(component)
    },
    setData(data) {
        component.data = new Proxy(data, {
            set: (target, key, value) => {
                target[key] = value;
                console.log('data', key, '=', value)
                component.rerender()
                return true;
            }
        })
        return componentProxy(component)
    },
    setListeners(names) {
        component.listeners = names
        return componentProxy(component)
    },
    setChildren(children) {
        component.children = children
        return componentProxy(component)
    },
    setOnCreate(func) {
        component.onCreate = func
        return componentProxy(component)
    }

})

const text = (content) => ({$component: new TextComponent(content)})
const div = () => componentProxy(new Component('div'))
const br = () => componentProxy(new Component('br'))

export { Renderer, State, div, text, br }
