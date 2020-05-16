import { div, text } from '../Framework/Framework'
import State from '../state'

export default div()
    .class('a2')
    .onCreate(function() {
        State.subscribe(this, 'count')
    })
    .children(function() {
        return [
            text(`Count: ${State.state.count}`)
        ]
    })
