import { text, div, h1 } from '../Framework/Framework'
import State from './Example7State'

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
            h1().children([text('child ' + number)]),
            text(`I have my own local state! click count: ${this.localState.count}.`)
        ]})
}
