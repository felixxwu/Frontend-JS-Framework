import State from '../State'

export default () => {
    return {
        name: 'box',
        tag: 'div',
        events: {
            click: () => State.dispatch('setBoxDim', [500, 300])
        },
        style: `
            width: ${State.boxDim[0]}px;
            height: ${State.boxDim[1]}px;
            max-width: 100vw;
            border: 1px solid grey;
            transition: 0.5s;
        `
    }
}