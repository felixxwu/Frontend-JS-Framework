import Component from './Component'
import TextComponent from './TextComponent'
import Renderer from './Renderer'
import State from './State'

const componentProxy = (component) => new Proxy(component, {
    get(_, property) {
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
    setLocalState(localState) {
        component.localState = new Proxy(localState, {
            set: (target, key, value) => {
                target[key] = value;
                console.log('localState', key, '=', value)
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

const text = (content) => ({component: new TextComponent(content)})
const div = () => componentProxy(new Component('div'))
const br = () => componentProxy(new Component('br'))
const h1 = () => componentProxy(new Component('h1'))
const h2 = () => componentProxy(new Component('h2'))
const h3 = () => componentProxy(new Component('h3'))
const h4 = () => componentProxy(new Component('h4'))
const h5 = () => componentProxy(new Component('h5'))
const h6 = () => componentProxy(new Component('h6'))

export { Renderer, State, text, div, br, h1, h2, h3, h4, h5, h6 }
