import { text, div, h2 } from '../../Framework/Framework'
import State from './state'

export default (number) => {
    return div()
        .localState({
            count: 0
        })
        .event.click(function() {
            this.localState.count++
            State.state.incrementCount(number)
        })
        .children(function() { return [
            h2().children([
                text('child ' + number)
            ]),
            text(`I increase the total count by ${number}. click count: ${this.localState.count}.`)
        ]})
}
