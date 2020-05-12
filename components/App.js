import Box from './Box'

export default {
    name: 'app',
    tag: 'div',
    attrs: { class: 'grid3x3' },
    style: () => `
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        font-family: 'Lexend Deca', sans-serif;
    `,
    children() {
        return [Box]
    }
}
