import Framework from '../Framework'

export default {
    name: 'counter',
    tag: 'div',
    attrs: {
        class: 'a2'
    },
    subscribeTo: ['count'],
    child: () => ({text: `Count: ${Framework.state.count}`})
}
