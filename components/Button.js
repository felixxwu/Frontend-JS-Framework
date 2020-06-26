import { div, text } from '../Framework/Framework.js'
import State from './state.js'

export default (number) => {
    let className = ''
    if (number === 1) className = 'a4'
    if (number === 2) className = 'a5'
    if (number === 3) className = 'a6'

    return div()
        .class(`${className} grid3x3 button`)
        .localState({
            myCount: 0,
        })
        .event.click(function() {
            this.localState.myCount += 1
            State.state.incrementCount(number)
        })
        .children(function() {
            return [
                div().children([
                    text(`+${number} (${this.localState.myCount})`
                )])
            ]
        })
}
