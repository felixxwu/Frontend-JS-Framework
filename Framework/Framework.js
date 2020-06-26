import Component from './Component.js'
import TextComponent from './TextComponent.js'
import Renderer from './Renderer.js'
import State from './State.js'

// the framework exports all the html tags

const text = (content) => ({component: new TextComponent(content)})
const div = () => (new Component('div')).getProxy()
const br = () => (new Component('br')).getProxy()
const h1 = () => (new Component('h1')).getProxy()
const h2 = () => (new Component('h2')).getProxy()
const h3 = () => (new Component('h3')).getProxy()
const h4 = () => (new Component('h4')).getProxy()
const h5 = () => (new Component('h5')).getProxy()
const h6 = () => (new Component('h6')).getProxy()

export { Renderer, State, text, div, br, h1, h2, h3, h4, h5, h6 }
