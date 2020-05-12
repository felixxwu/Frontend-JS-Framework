import Box from './Box'

export default () => {
    return {
        name: 'app',
        tag: 'div',
        attrs: { class: 'grid3x3' },
        style: `
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        `,
        child: Box()
    }
}
