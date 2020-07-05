import State from './state.js'

export default (number) => ({
    tag: 'div',
    localState: {
        count: 0
    },
    events: {
        click: function() {
            this.localState.count++
            State.state.incrementCount(number)
        }
    },
    children: function() { return [
        {
            tag: 'h2',
            children: [{
                tag: null,
                text: 'child ' + number
            }]
        },
        {
            tag: null,
            text: `I increase the total count by ${number}. click count: ${this.localState.count}.`
        }
    ]}
})