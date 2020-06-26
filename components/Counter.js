import { div, text } from '../Framework/Framework.js'
import State from './state.js'

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
