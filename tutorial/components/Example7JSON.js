import ExampleChild from './Example7ChildJSON.js'
import ExampleCountDisplay from './Example7CountDisplayJSON.js'

export default {
    tag: 'div',
    attributes: {
        class: 'example'
    },
    children: [
        ExampleCountDisplay,
        ExampleChild(1),
        { tag: 'br' },
        ExampleChild(2),
    ]
}
