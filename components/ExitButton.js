export default handler => ({
    name: 'exit',
    tag: 'div',
    attrs: { class: 'a8 grid3x3' },
    style() {
        return `
            width: 100px;
            height: 50px;
            border: 1px solid grey;
            cursor: pointer;
        `
    },
    events: { click: handler },
    child: () => ({
        name: '',
        tag: 'div',
        child: () => ({text: 'exit'})
    })
})
