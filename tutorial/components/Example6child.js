import { text, div, h2 } from '../../Framework/Framework'

export default (number) => {
    return div()
        .localState({
            count: 0
        })
        .event.click(function() {
            this.localState.count++
        })
        .children(function() { return [
            h2().children([text('child ' + number)]),
            text(`I have my own local state! click count: ${this.localState.count}.`)
        ]})
}
