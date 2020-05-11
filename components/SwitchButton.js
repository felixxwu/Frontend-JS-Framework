import State from './State'

export default () => {
    return {
        tag: 'button',
        child: {text: 'switch'},
        events: {
            click: () => {
                State.dispatch('setTransparent')
                State.dispatch('select', null)
                setTimeout(() => {
                    State.dispatch('switch')
                    State.dispatch('setOpaque')
                }, State.cssVars.transitionSpeedMS);
            }
        }
    }
}